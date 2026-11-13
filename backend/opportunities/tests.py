from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient, APITestCase

from portfolio.models import ArtField
from users.models import OrganizerProfile, User

from .models import Opportunity


def make_organizer(email="org@example.com", approved=True):
    user = User.objects.create_user(
        email=email, display_name="Org", role=User.Role.ORGANIZER
    )
    profile = OrganizerProfile.objects.create(
        user=user, name="Galerija X", approved=approved
    )
    return user, profile


class CreateOpportunityTests(APITestCase):
    def setUp(self):
        self.field = ArtField.objects.create(name="Painting")
        self.user, self.profile = make_organizer()
        self.client.force_login(self.user)
        self.url = reverse("opportunity-list")

    def payload(self, **overrides):
        payload = {
            "type": "exhibition",
            "title": "Proljetna izložba",
            "description": "Skupna izložba slikara.",
            "field": self.field.pk,
            "deadline": (timezone.localdate() + timedelta(days=30)).isoformat(),
        }
        payload.update(overrides)
        return payload

    def post(self, payload):
        return self.client.post(self.url, payload, format="json")

    def test_not_logged_in_returns_401(self):
        response = APIClient().post(self.url, self.payload(), format="json")
        self.assertEqual(response.status_code, 401)

    def test_artist_returns_403(self):
        artist = User.objects.create_user(email="test@example.com", display_name="TestIme")
        self.client.force_login(artist)
        self.assertEqual(self.post(self.payload()).status_code, 403)

    def test_organizer_creates_opportunity_in_preparation(self):
        response = self.post(self.payload())
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "preparation")

        opportunity = Opportunity.objects.get(pk=response.data["id"])
        self.assertEqual(opportunity.organizer, self.profile)

    def test_status_in_request_is_ignored(self):
        response = self.post(self.payload(status="open"))
        self.assertEqual(response.data["status"], "preparation")

    def test_missing_title_returns_400(self):
        payload = self.payload()
        del payload["title"]
        response = self.post(payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("title", response.data)

    def test_deadline_in_past_returns_400(self):
        past = (timezone.localdate() - timedelta(days=1)).isoformat()
        response = self.post(self.payload(deadline=past))
        self.assertEqual(response.status_code, 400)
        self.assertIn("deadline", response.data)

class ListOpportunitiesTests(APITestCase):
    def setUp(self):
        field = ArtField.objects.create(name="Painting")
        _, profile = make_organizer()
        for title, status in [("Draft", "preparation"), ("Open", "open")]:
            Opportunity.objects.create(
                organizer=profile, field=field, type="exhibition",
                title=title, status=status,
            )
        self.url = reverse("opportunity-list")

    def test_not_logged_in_returns_401(self):
        self.assertEqual(APIClient().get(self.url).status_code, 401)

    def test_artist_sees_only_published(self):
        artist = User.objects.create_user(email="a@example.com", display_name="Ana")
        self.client.force_login(artist)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["title"] for item in response.data], ["Open"])

class MyOpportunitiesTests(APITestCase):
    def setUp(self):
        self.field = ArtField.objects.create(name="Painting")
        self.user, self.profile = make_organizer()
        _, other_profile = make_organizer("other@example.com")

        for profile, title, status in [
            (self.profile, "My draft", "preparation"),
            (self.profile, "My open", "open"),
            (other_profile, "Their draft", "preparation"),
        ]:
            Opportunity.objects.create(
                organizer=profile, field=self.field, type="exhibition",
                title=title, status=status,
            )
        self.url = reverse("opportunity-mine")

    def test_organizer_sees_own_including_drafts_but_not_others(self):
        self.client.force_login(self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            sorted(item["title"] for item in response.data), ["My draft", "My open"]
        )

    def test_artist_returns_403(self):
        artist = User.objects.create_user(email="a@example.com", display_name="Ana")
        self.client.force_login(artist)
        self.assertEqual(self.client.get(self.url).status_code, 403)


class OpportunityDetailTests(APITestCase):
    def setUp(self):
        self.field = ArtField.objects.create(name="Painting")
        self.user, self.profile = make_organizer()
        self.other_user, _ = make_organizer("other@example.com")
        self.draft = Opportunity.objects.create(
            organizer=self.profile, field=self.field, type="exhibition",
            title="Draft", status="preparation",
        )
        self.open = Opportunity.objects.create(
            organizer=self.profile, field=self.field, type="exhibition",
            title="Open", status="open",
        )
        self.artist = User.objects.create_user(email="a@example.com", display_name="Ana")

    def url(self, opportunity):
        return reverse("opportunity-detail", args=[opportunity.pk])

    def test_not_logged_in_returns_401(self):
        self.assertEqual(APIClient().get(self.url(self.open)).status_code, 401)

    def test_artist_can_open_published(self):
        self.client.force_login(self.artist)
        response = self.client.get(self.url(self.open))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "Open")

    def test_artist_cannot_open_draft_returns_404(self):
        self.client.force_login(self.artist)
        self.assertEqual(self.client.get(self.url(self.draft)).status_code, 404)

    def test_owner_can_open_own_draft(self):
        self.client.force_login(self.user)
        self.assertEqual(self.client.get(self.url(self.draft)).status_code, 200)

    def test_other_organizer_cannot_open_draft_returns_404(self):
        self.client.force_login(self.other_user)
        self.assertEqual(self.client.get(self.url(self.draft)).status_code, 404)


class StatusChangeTests(APITestCase):
    def setUp(self):
        self.field = ArtField.objects.create(name="Painting")
        self.user, self.profile = make_organizer()
        self.client.force_login(self.user)
        self.opportunity = self.make_opportunity()

    def make_opportunity(self, profile=None, **kwargs):
        defaults = dict(
            organizer=profile or self.profile,
            field=self.field,
            type="exhibition",
            title="Izložba",
            description="Opis",
            deadline=timezone.localdate() + timedelta(days=30),
        )
        defaults.update(kwargs)
        return Opportunity.objects.create(**defaults)

    def change(self, new_status, opportunity=None):
        opportunity = opportunity or self.opportunity
        url = reverse("opportunity-status", args=[opportunity.pk])
        return self.client.post(url, {"status": new_status}, format="json")

    def test_publish_moves_preparation_to_open(self):
        response = self.change("open")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "open")
        self.opportunity.refresh_from_db()
        self.assertEqual(self.opportunity.status, "open")

    def test_full_lifecycle(self):
        for new_status in ("open", "closed", "open", "selection", "finished"):
            self.assertEqual(self.change(new_status).status_code, 200, new_status)

    def test_invalid_transition_returns_400(self):
        response = self.change("finished")
        self.assertEqual(response.status_code, 400)
        self.opportunity.refresh_from_db()
        self.assertEqual(self.opportunity.status, "preparation")

    def test_cannot_leave_finished(self):
        self.opportunity.status = "finished"
        self.opportunity.save()
        self.assertEqual(self.change("open").status_code, 400)

    def test_publish_requires_deadline_and_description(self):
        opportunity = self.make_opportunity(deadline=None, description="")
        response = self.change("open", opportunity)
        self.assertEqual(response.status_code, 400)
        self.assertIn("deadline", response.data)
        self.assertIn("description", response.data)

    def test_unapproved_organizer_cannot_publish_returns_403(self):
        user, profile = make_organizer("new@example.com", approved=False)
        self.client.force_login(user)
        opportunity = self.make_opportunity(profile)
        self.assertEqual(self.change("open", opportunity).status_code, 403)

    def test_other_organizer_gets_404(self):
        other_user, _ = make_organizer("other@example.com")
        self.client.force_login(other_user)
        self.assertEqual(self.change("open").status_code, 404)

    def test_artist_gets_403(self):
        artist = User.objects.create_user(email="a@example.com", display_name="Ana")
        self.client.force_login(artist)
        self.assertEqual(self.change("open").status_code, 403)


class UpdateOpportunityTests(APITestCase):
    def setUp(self):
        self.field = ArtField.objects.create(name="Painting")
        self.user, self.profile = make_organizer()
        self.client.force_login(self.user)

    def make_opportunity(self, **kwargs):
        defaults = dict(
            organizer=self.profile,
            field=self.field,
            type="exhibition",
            title="Izložba",
            description="Opis",
            deadline=timezone.localdate() + timedelta(days=30),
        )
        defaults.update(kwargs)
        return Opportunity.objects.create(**defaults)

    def patch(self, opportunity, payload):
        url = reverse("opportunity-detail", args=[opportunity.pk])
        return self.client.patch(url, payload, format="json")

    def test_draft_can_be_edited_freely(self):
        opportunity = self.make_opportunity()
        response = self.patch(opportunity, {"title": "Novi naziv", "reward": "100 EUR"})
        self.assertEqual(response.status_code, 200)
        opportunity.refresh_from_db()
        self.assertEqual(opportunity.title, "Novi naziv")
        self.assertEqual(opportunity.reward, "100 EUR")

    def test_published_allows_location_deadline_and_time(self):
        opportunity = self.make_opportunity(status="open")
        new_deadline = (timezone.localdate() + timedelta(days=60)).isoformat()
        response = self.patch(opportunity, {
            "address": "Nova adresa 5",
            "latitude": "44.000000",
            "longitude": "16.000000",
            "deadline": new_deadline,
            "starts_at": "2030-05-01T10:00:00Z",
            "ends_at": "2030-05-01T12:00:00Z",
        })
        self.assertEqual(response.status_code, 200)
        opportunity.refresh_from_db()
        self.assertEqual(opportunity.address, "Nova adresa 5")
        self.assertEqual(opportunity.deadline.isoformat(), new_deadline)

    def test_published_rejects_other_fields(self):
        opportunity = self.make_opportunity(status="open")
        response = self.patch(opportunity, {"title": "Hijack", "reward": "1 EUR"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("title", response.data)
        self.assertIn("reward", response.data)
        opportunity.refresh_from_db()
        self.assertEqual(opportunity.title, "Izložba")

    def test_published_accepts_unchanged_value_for_locked_field(self):
        opportunity = self.make_opportunity(status="open")
        response = self.patch(opportunity, {"title": "Izložba", "address": "Druga"})
        self.assertEqual(response.status_code, 200)

    def test_finished_cannot_be_edited(self):
        opportunity = self.make_opportunity(status="finished")
        self.assertEqual(self.patch(opportunity, {"address": "X"}).status_code, 400)

    def test_status_cannot_be_changed_through_patch(self):
        opportunity = self.make_opportunity()
        self.patch(opportunity, {"status": "open"})
        opportunity.refresh_from_db()
        self.assertEqual(opportunity.status, "preparation")

    def test_other_organizer_gets_404(self):
        opportunity = self.make_opportunity(status="open")
        other_user, _ = make_organizer("other@example.com")
        self.client.force_login(other_user)
        self.assertEqual(self.patch(opportunity, {"address": "X"}).status_code, 404)

    def test_artist_gets_403(self):
        opportunity = self.make_opportunity(status="open")
        artist = User.objects.create_user(email="a@example.com", display_name="Ana")
        self.client.force_login(artist)
        self.assertEqual(self.patch(opportunity, {"address": "X"}).status_code, 403)

    def test_put_is_not_allowed(self):
        opportunity = self.make_opportunity()
        url = reverse("opportunity-detail", args=[opportunity.pk])
        self.assertEqual(self.client.put(url, {}, format="json").status_code, 405)


class DeleteOpportunityTests(APITestCase):
    def setUp(self):
        self.field = ArtField.objects.create(name="Painting")
        self.user, self.profile = make_organizer()
        self.client.force_login(self.user)

    def make_opportunity(self, **kwargs):
        defaults = dict(
            organizer=self.profile, field=self.field, type="exhibition", title="Izložba"
        )
        defaults.update(kwargs)
        return Opportunity.objects.create(**defaults)

    def delete(self, opportunity, payload=None):
        url = reverse("opportunity-detail", args=[opportunity.pk])
        return self.client.delete(url, payload, format="json")

    def test_published_delete_saves_reason_and_hides_it(self):
        opportunity = self.make_opportunity(status="open")
        response = self.delete(opportunity, {"reason": "Izložba otkazana"})
        self.assertEqual(response.status_code, 204)

        opportunity.refresh_from_db()  # redak i dalje postoji u bazi
        self.assertIsNotNone(opportunity.deleted_at)
        self.assertEqual(opportunity.deletion_reason, "Izložba otkazana")

        artist = User.objects.create_user(email="a@example.com", display_name="Ana")
        self.client.force_login(artist)
        self.assertEqual(self.client.get(reverse("opportunity-list")).data, [])
        url = reverse("opportunity-detail", args=[opportunity.pk])
        self.assertEqual(self.client.get(url).status_code, 404)

    def test_deleted_is_hidden_from_owner_list_too(self):
        opportunity = self.make_opportunity(status="open")
        self.delete(opportunity, {"reason": "x"})
        self.assertEqual(self.client.get(reverse("opportunity-mine")).data, [])

    def test_published_delete_without_reason_returns_400(self):
        opportunity = self.make_opportunity(status="open")
        for payload in (None, {}, {"reason": "   "}):
            self.assertEqual(self.delete(opportunity, payload).status_code, 400)
        opportunity.refresh_from_db()
        self.assertIsNone(opportunity.deleted_at)

    def test_draft_is_removed_without_reason(self):
        opportunity = self.make_opportunity()
        self.assertEqual(self.delete(opportunity).status_code, 204)
        self.assertFalse(Opportunity.objects.filter(pk=opportunity.pk).exists())

    def test_deleted_cannot_be_deleted_again(self):
        opportunity = self.make_opportunity(status="open")
        self.delete(opportunity, {"reason": "x"})
        self.assertEqual(self.delete(opportunity, {"reason": "x"}).status_code, 404)

    def test_other_organizer_gets_404(self):
        opportunity = self.make_opportunity(status="open")
        other_user, _ = make_organizer("other@example.com")
        self.client.force_login(other_user)
        self.assertEqual(self.delete(opportunity, {"reason": "x"}).status_code, 404)
        opportunity.refresh_from_db()
        self.assertIsNone(opportunity.deleted_at)

    def test_artist_gets_403(self):
        opportunity = self.make_opportunity(status="open")
        artist = User.objects.create_user(email="a@example.com", display_name="Ana")
        self.client.force_login(artist)
        self.assertEqual(self.delete(opportunity, {"reason": "x"}).status_code, 403)
