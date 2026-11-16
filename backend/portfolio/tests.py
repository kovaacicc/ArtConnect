from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase

from opportunities.models import Application, Opportunity
from users.models import ArtistProfile, OrganizerProfile, User

from .models import ArtField, Artwork, ArtworkFile, PastExhibition


# GET /api/portfolio/art-fields/
class ArtFieldListTests(APITestCase):
    def setUp(self):
        ArtField.objects.all().delete()
        
    def test_is_public_sorted_and_only_active(self):
        ArtField.objects.create(name="Sculpting")
        ArtField.objects.create(name="Painting")
        ArtField.objects.create(name="Hidden", active=False)

        response = self.client.get(reverse("art-fields"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [item["name"] for item in response.data], ["Painting", "Sculpting"]
        )

    def test_item_has_id_and_name_only(self):
        field = ArtField.objects.create(name="Painting")

        response = self.client.get(reverse("art-fields"))

        self.assertEqual(response.data, [{"id": field.pk, "name": "Painting"}])


def make_artist(email, first_name="Ana", last_name="Horvat", public=False):
    user = User.objects.create_user(
        email=email, display_name=first_name, role=User.Role.ARTIST
    )
    profile = ArtistProfile.objects.create(
        user=user,
        first_name=first_name,
        last_name=last_name,
        portfolio_public=public,
    )
    return user, profile


def make_organizer(email="org@example.com"):
    user = User.objects.create_user(
        email=email, display_name="Galerija", role=User.Role.ORGANIZER
    )
    profile = OrganizerProfile.objects.create(user=user, name="Galerija X")
    return user, profile


# GET/PATCH /api/portfolio/me/
class MyPortfolioTests(APITestCase):
    def setUp(self):
        self.user, self.profile = make_artist("ana@example.com")
        self.painting = ArtField.objects.create(name="Painting")
        self.sculpting = ArtField.objects.create(name="Sculpting")
        self.profile.art_fields.add(self.painting)
        self.url = reverse("portfolio-me")

    def test_get_returns_own_profile_with_art_fields(self):
        self.client.force_authenticate(self.user)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["first_name"], "Ana")
        self.assertEqual(
            response.data["art_fields"],
            [{"id": self.painting.pk, "name": "Painting"}],
        )
        self.assertEqual(response.data["participations"], [])

    def test_anonymous_gets_401(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 401)

    def test_organizer_gets_403(self):
        organizer, _ = make_organizer()
        self.client.force_authenticate(organizer)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 403)

    def test_patch_changes_only_sent_fields(self):
        self.client.force_authenticate(self.user)

        response = self.client.patch(
            self.url, {"biography": "Nova biografija"}, format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.biography, "Nova biografija")
        self.assertEqual(self.profile.first_name, "Ana")
        self.assertEqual(list(self.profile.art_fields.all()), [self.painting])

    def test_patch_portfolio_public(self):
        self.client.force_authenticate(self.user)

        response = self.client.patch(self.url, {"portfolio_public": True}, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["portfolio_public"])

    def test_patch_replaces_art_fields(self):
        self.client.force_authenticate(self.user)

        response = self.client.patch(
            self.url, {"art_fields": [self.sculpting.pk]}, format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [item["name"] for item in response.data["art_fields"]], ["Sculpting"]
        )
        self.assertEqual(list(self.profile.art_fields.all()), [self.sculpting])

    def test_patch_empty_art_fields_is_rejected(self):
        self.client.force_authenticate(self.user)

        response = self.client.patch(self.url, {"art_fields": []}, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("art_fields", response.data)
        self.assertEqual(list(self.profile.art_fields.all()), [self.painting])

    def test_patch_inactive_art_field_is_rejected(self):
        hidden = ArtField.objects.create(name="Hidden", active=False)
        self.client.force_authenticate(self.user)

        response = self.client.patch(self.url, {"art_fields": [hidden.pk]}, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("art_fields", response.data)

    def test_patch_blank_first_name_is_rejected(self):
        self.client.force_authenticate(self.user)

        response = self.client.patch(self.url, {"first_name": ""}, format="json")

        self.assertEqual(response.status_code, 400)

    def test_put_is_not_allowed(self):
        self.client.force_authenticate(self.user)

        response = self.client.put(self.url, {"first_name": "X"}, format="json")

        self.assertEqual(response.status_code, 405)


# /api/portfolio/artworks/
class ArtworkTests(APITestCase):
    def setUp(self):
        self.user, self.profile = make_artist("ana@example.com")
        self.other_user, self.other_profile = make_artist(
            "ivan@example.com", first_name="Ivan", last_name="Kovač"
        )
        self.client.force_authenticate(self.user)

    def test_create_artwork_is_owned_by_logged_in_artist(self):
        response = self.client.post(
            reverse("artwork-list"),
            {
                "title": "Sunce",
                "year_created": 2023,
                "technique": "Ulje na platnu",
                "dimensions": "50x70",
                "description": "Opis",
                "is_public": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], "Sunce")
        self.assertEqual(response.data["files"], [])
        self.assertEqual(Artwork.objects.get(title="Sunce").artist, self.profile)

    def test_artist_field_in_payload_is_ignored(self):
        response = self.client.post(
            reverse("artwork-list"),
            {"title": "Sunce", "artist": self.other_profile.pk},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Artwork.objects.get(title="Sunce").artist, self.profile)

    def test_title_is_required(self):
        response = self.client.post(reverse("artwork-list"), {}, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("title", response.data)

    def test_year_in_future_is_rejected(self):
        future = timezone.localdate().year + 5

        response = self.client.post(
            reverse("artwork-list"),
            {"title": "Sunce", "year_created": future},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("year_created", response.data)

    def test_list_returns_only_own_artworks_including_private(self):
        Artwork.objects.create(artist=self.profile, title="Javno", is_public=True)
        Artwork.objects.create(artist=self.profile, title="Privatno", is_public=False)
        Artwork.objects.create(artist=self.other_profile, title="Tuđe")

        response = self.client.get(reverse("artwork-list"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            sorted(item["title"] for item in response.data), ["Javno", "Privatno"]
        )

    def test_organizer_cannot_create_artwork(self):
        organizer, _ = make_organizer()
        self.client.force_authenticate(organizer)

        response = self.client.post(reverse("artwork-list"), {"title": "X"}, format="json")

        self.assertEqual(response.status_code, 403)

    def test_patch_own_artwork(self):
        artwork = Artwork.objects.create(artist=self.profile, title="Staro")

        response = self.client.patch(
            reverse("artwork-detail", kwargs={"artwork_id": artwork.pk}),
            {"title": "Novo", "is_public": False},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        artwork.refresh_from_db()
        self.assertEqual(artwork.title, "Novo")
        self.assertFalse(artwork.is_public)

    def test_delete_own_artwork(self):
        artwork = Artwork.objects.create(artist=self.profile, title="Staro")

        response = self.client.delete(
            reverse("artwork-detail", kwargs={"artwork_id": artwork.pk})
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Artwork.objects.filter(pk=artwork.pk).exists())

    def test_cannot_see_edit_or_delete_someone_elses_artwork(self):
        artwork = Artwork.objects.create(artist=self.other_profile, title="Tuđe")
        url = reverse("artwork-detail", kwargs={"artwork_id": artwork.pk})

        self.assertEqual(self.client.get(url).status_code, 404)
        self.assertEqual(
            self.client.patch(url, {"title": "Hak"}, format="json").status_code, 404
        )
        self.assertEqual(self.client.delete(url).status_code, 404)
        artwork.refresh_from_db()
        self.assertEqual(artwork.title, "Tuđe")


class ArtworkFileTests(APITestCase):
    def setUp(self):
        self.user, self.profile = make_artist("ana@example.com")
        self.other_user, self.other_profile = make_artist(
            "ivan@example.com", first_name="Ivan", last_name="Kovač"
        )
        self.artwork = Artwork.objects.create(artist=self.profile, title="Sunce")
        self.client.force_authenticate(self.user)

    def test_add_file_to_own_artwork(self):
        response = self.client.post(
            reverse("artwork-file-create", kwargs={"artwork_id": self.artwork.pk}),
            {"url": "https://example.com/slika.jpg", "file_type": "image"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["url"], "https://example.com/slika.jpg")
        self.assertEqual(self.artwork.files.count(), 1)

    def test_invalid_url_is_rejected(self):
        response = self.client.post(
            reverse("artwork-file-create", kwargs={"artwork_id": self.artwork.pk}),
            {"url": "nije-link", "file_type": "image"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("url", response.data)

    def test_cannot_add_file_to_someone_elses_artwork(self):
        other_artwork = Artwork.objects.create(artist=self.other_profile, title="Tuđe")

        response = self.client.post(
            reverse("artwork-file-create", kwargs={"artwork_id": other_artwork.pk}),
            {"url": "https://example.com/slika.jpg"},
            format="json",
        )

        self.assertEqual(response.status_code, 404)
        self.assertEqual(other_artwork.files.count(), 0)

    def test_artwork_response_includes_files(self):
        ArtworkFile.objects.create(
            artwork=self.artwork, url="https://example.com/a.jpg", file_type="image"
        )

        response = self.client.get(
            reverse("artwork-detail", kwargs={"artwork_id": self.artwork.pk})
        )

        self.assertEqual(len(response.data["files"]), 1)
        self.assertEqual(response.data["files"][0]["url"], "https://example.com/a.jpg")

    def test_delete_own_file(self):
        file = ArtworkFile.objects.create(
            artwork=self.artwork, url="https://example.com/a.jpg"
        )

        response = self.client.delete(
            reverse(
                "artwork-file-delete",
                kwargs={"artwork_id": self.artwork.pk, "file_id": file.pk},
            )
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(ArtworkFile.objects.filter(pk=file.pk).exists())

    def test_cannot_delete_file_through_wrong_artwork(self):
        file = ArtworkFile.objects.create(
            artwork=self.artwork, url="https://example.com/a.jpg"
        )
        another_artwork = Artwork.objects.create(artist=self.profile, title="Drugo")

        response = self.client.delete(
            reverse(
                "artwork-file-delete",
                kwargs={"artwork_id": another_artwork.pk, "file_id": file.pk},
            )
        )

        self.assertEqual(response.status_code, 404)
        self.assertTrue(ArtworkFile.objects.filter(pk=file.pk).exists())

    def test_cannot_delete_someone_elses_file(self):
        other_artwork = Artwork.objects.create(artist=self.other_profile, title="Tuđe")
        file = ArtworkFile.objects.create(
            artwork=other_artwork, url="https://example.com/a.jpg"
        )

        response = self.client.delete(
            reverse(
                "artwork-file-delete",
                kwargs={"artwork_id": other_artwork.pk, "file_id": file.pk},
            )
        )

        self.assertEqual(response.status_code, 404)
        self.assertTrue(ArtworkFile.objects.filter(pk=file.pk).exists())


class PastExhibitionTests(APITestCase):
    def setUp(self):
        self.user, self.profile = make_artist("ana@example.com")
        self.other_user, self.other_profile = make_artist(
            "ivan@example.com", first_name="Ivan", last_name="Kovač"
        )
        self.client.force_authenticate(self.user)

    def test_create_exhibition(self):
        response = self.client.post(
            reverse("exhibition-list"),
            {"title": "Samostalna izložba", "year": 2022, "description": "Opis"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            PastExhibition.objects.get(title="Samostalna izložba").artist,
            self.profile,
        )

    def test_list_returns_only_own_exhibitions_newest_first(self):
        PastExhibition.objects.create(artist=self.profile, title="Stara", year=2019)
        PastExhibition.objects.create(artist=self.profile, title="Nova", year=2024)
        PastExhibition.objects.create(artist=self.other_profile, title="Tuđa", year=2024)

        response = self.client.get(reverse("exhibition-list"))

        self.assertEqual([item["title"] for item in response.data], ["Nova", "Stara"])

    def test_patch_and_delete_own_exhibition(self):
        exhibition = PastExhibition.objects.create(artist=self.profile, title="Stara")
        url = reverse("exhibition-detail", kwargs={"exhibition_id": exhibition.pk})

        patch_response = self.client.patch(url, {"title": "Nova"}, format="json")
        delete_response = self.client.delete(url)

        self.assertEqual(patch_response.status_code, 200)
        self.assertEqual(patch_response.data["title"], "Nova")
        self.assertEqual(delete_response.status_code, 204)
        self.assertFalse(PastExhibition.objects.filter(pk=exhibition.pk).exists())

    def test_cannot_touch_someone_elses_exhibition(self):
        exhibition = PastExhibition.objects.create(artist=self.other_profile, title="Tuđa")
        url = reverse("exhibition-detail", kwargs={"exhibition_id": exhibition.pk})

        self.assertEqual(self.client.get(url).status_code, 404)
        self.assertEqual(
            self.client.patch(url, {"title": "Hak"}, format="json").status_code, 404
        )
        self.assertEqual(self.client.delete(url).status_code, 404)

    def test_year_in_future_is_rejected(self):
        future = timezone.localdate().year + 5

        response = self.client.post(
            reverse("exhibition-list"),
            {"title": "Buduća", "year": future},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("year", response.data)


# GET /api/portfolio/artists/<id>/
class PublicPortfolioTests(APITestCase):
    def setUp(self):
        self.user, self.profile = make_artist("ana@example.com", public=True)
        self.viewer_user, self.viewer_profile = make_artist(
            "ivan@example.com", first_name="Ivan", last_name="Kovač"
        )
        self.painting = ArtField.objects.create(name="Painting")
        self.profile.art_fields.add(self.painting)
        self.url = reverse("artist-public", kwargs={"artist_id": self.profile.pk})

    def test_shows_only_public_artworks(self):
        public = Artwork.objects.create(artist=self.profile, title="Javno", is_public=True)
        ArtworkFile.objects.create(artwork=public, url="https://example.com/a.jpg")
        Artwork.objects.create(artist=self.profile, title="Privatno", is_public=False)
        self.client.force_authenticate(self.viewer_user)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual([a["title"] for a in response.data["artworks"]], ["Javno"])
        self.assertEqual(len(response.data["artworks"][0]["files"]), 1)

    def test_includes_profile_fields_and_exhibitions(self):
        PastExhibition.objects.create(artist=self.profile, title="Izložba", year=2021)
        self.client.force_authenticate(self.viewer_user)

        response = self.client.get(self.url)

        self.assertEqual(response.data["id"], self.profile.pk)
        self.assertEqual(response.data["first_name"], "Ana")
        self.assertEqual(
            response.data["art_fields"], [{"id": self.painting.pk, "name": "Painting"}]
        )
        self.assertEqual(response.data["past_exhibitions"][0]["title"], "Izložba")

    def test_inactive_art_field_is_hidden_but_kept_in_database(self):
        sculpting = ArtField.objects.create(name="Sculpting")
        self.profile.art_fields.add(sculpting)
        sculpting.active = False
        sculpting.save()
        self.client.force_authenticate(self.viewer_user)

        public_response = self.client.get(self.url)
        self.client.force_authenticate(self.user)
        own_response = self.client.get(reverse("portfolio-me"))

        self.assertEqual(
            public_response.data["art_fields"],
            [{"id": self.painting.pk, "name": "Painting"}],
        )
        self.assertEqual(
            [f["name"] for f in own_response.data["art_fields"]], ["Painting"]
        )
        self.assertTrue(self.profile.art_fields.filter(pk=sculpting.pk).exists())

    def test_only_art_field_deactivated_gives_empty_list_without_errors(self):
        self.painting.active = False
        self.painting.save()
        self.client.force_authenticate(self.user)

        get_response = self.client.get(reverse("portfolio-me"))
        patch_response = self.client.patch(
            reverse("portfolio-me"), {"biography": "Nova"}, format="json"
        )

        self.assertEqual(get_response.status_code, 200)
        self.assertEqual(get_response.data["art_fields"], [])
        self.assertEqual(patch_response.status_code, 200)
        self.assertEqual(patch_response.data["biography"], "Nova")

    def test_deactivated_user_portfolio_returns_404(self):
        self.user.is_active = False
        self.user.save()
        self.client.force_authenticate(self.viewer_user)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 404)

    def test_reactivated_user_portfolio_is_visible_again(self):
        self.user.is_active = False
        self.user.save()
        self.user.is_active = True
        self.user.save()
        self.client.force_authenticate(self.viewer_user)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)

    def test_does_not_expose_private_data(self):
        self.client.force_authenticate(self.viewer_user)

        response = self.client.get(self.url)

        self.assertNotIn("email", response.data)
        self.assertNotIn("portfolio_public", response.data)
        self.assertNotIn("role", response.data)

    def test_organizer_can_view_public_portfolio(self):
        organizer, _ = make_organizer()
        self.client.force_authenticate(organizer)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)

    def test_anonymous_gets_401(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 401)

    def test_private_portfolio_returns_404_for_others(self):
        self.profile.portfolio_public = False
        self.profile.save()
        self.client.force_authenticate(self.viewer_user)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 404)

    def test_owner_also_gets_404_for_own_private_portfolio(self):
        self.profile.portfolio_public = False
        self.profile.save()
        self.client.force_authenticate(self.user)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 404)

    def test_owner_can_still_edit_own_data_while_portfolio_is_private(self):
        self.profile.portfolio_public = False
        self.profile.save()
        Artwork.objects.create(artist=self.profile, title="Privatno", is_public=False)
        self.client.force_authenticate(self.user)

        me_response = self.client.get(reverse("portfolio-me"))
        artworks_response = self.client.get(reverse("artwork-list"))

        self.assertEqual(me_response.status_code, 200)
        self.assertFalse(me_response.data["portfolio_public"])
        self.assertEqual([a["title"] for a in artworks_response.data], ["Privatno"])

    def test_publishing_portfolio_makes_it_visible_to_others(self):
        self.profile.portfolio_public = False
        self.profile.save()
        self.client.force_authenticate(self.user)

        patch_response = self.client.patch(
            reverse("portfolio-me"), {"portfolio_public": True}, format="json"
        )
        self.client.force_authenticate(self.viewer_user)
        view_response = self.client.get(self.url)

        self.assertEqual(patch_response.status_code, 200)
        self.assertEqual(view_response.status_code, 200)

    def test_unknown_artist_returns_404(self):
        self.client.force_authenticate(self.viewer_user)

        response = self.client.get(
            reverse("artist-public", kwargs={"artist_id": 999999})
        )

        self.assertEqual(response.status_code, 404)

    def test_participations_show_only_marked_and_not_deleted(self):
        organizer, organizer_profile = make_organizer()

        def make_opportunity(title, **extra):
            return Opportunity.objects.create(
                organizer=organizer_profile,
                field=self.painting,
                type="exhibition",
                title=title,
                **extra,
            )

        took_part = make_opportunity("Izložba A")
        not_marked = make_opportunity("Izložba B")
        deleted = make_opportunity("Izložba C", deleted_at=timezone.now())
        Application.objects.create(
            opportunity=took_part, artist=self.profile, participated=True
        )
        Application.objects.create(
            opportunity=not_marked, artist=self.profile, participated=False
        )
        Application.objects.create(
            opportunity=deleted, artist=self.profile, participated=True
        )
        self.client.force_authenticate(self.viewer_user)

        response = self.client.get(self.url)

        self.assertEqual(
            [p["title"] for p in response.data["participations"]], ["Izložba A"]
        )
        self.assertEqual(
            response.data["participations"][0]["opportunity_id"],
            took_part.opportunity_id,
        )
