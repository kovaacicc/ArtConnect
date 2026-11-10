from allauth.socialaccount.models import SocialAccount, SocialLogin
from django.test import RequestFactory, TestCase
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase

from portfolio.models import ArtField

from .adapters import SocialAdapter
from .models import ArtistProfile, OrganizerProfile, User


def make_user(email="ana@example.com"):
    return User.objects.create_user(email=email, display_name="Ana")


# ---------------------------------------------------------------------------
# GET /api/users/me/
# ---------------------------------------------------------------------------
class MeViewTests(APITestCase):
    def test_not_logged_in_returns_401(self):
        response = self.client.get(reverse("me"))
        self.assertEqual(response.status_code, 401)

    def test_new_user_has_incomplete_registration_and_no_profiles(self):
        self.client.force_login(make_user())
        response = self.client.get(reverse("me"))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data["registration_complete"])
        self.assertIsNone(response.data["artist_profile"])
        self.assertIsNone(response.data["organizer_profile"])


# ---------------------------------------------------------------------------
# POST /api/users/auth/register/
# ---------------------------------------------------------------------------
class RegisterViewTests(APITestCase):
    def setUp(self):
        self.user = make_user()
        self.client.force_login(self.user)
        self.url = reverse("register")
        self.painting = ArtField.objects.create(name="Painting")
        self.photo = ArtField.objects.create(name="Photography")

    def artist_payload(self, **overrides):
        payload = {
            "role": "artist",
            "first_name": "Ana",
            "last_name": "Kovač",
            "art_fields": [self.painting.pk, self.photo.pk],
        }
        payload.update(overrides)
        return payload

    def post(self, payload):
        return self.client.post(self.url, payload, format="json")

    def test_not_logged_in_returns_401(self):
        response = APIClient().post(self.url, self.artist_payload(), format="json")
        self.assertEqual(response.status_code, 401)

    def test_artist_registration_succeeds(self):
        response = self.post(self.artist_payload())
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["registration_complete"])
        self.assertEqual(response.data["role"], "artist")
        self.assertEqual(response.data["artist_profile"]["first_name"], "Ana")

        profile = ArtistProfile.objects.get(user=self.user)
        self.assertEqual(profile.art_fields.count(), 2)

    def test_organizer_registration_is_not_approved(self):
        response = self.post({"role": "organizer", "name": "Galerija X"})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["role"], "organizer")

        profile = OrganizerProfile.objects.get(user=self.user)
        self.assertFalse(profile.approved)

    def test_artist_without_first_name_returns_400(self):
        payload = self.artist_payload()
        del payload["first_name"]
        response = self.post(payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("first_name", response.data)
        self.assertFalse(ArtistProfile.objects.exists())

    def test_artist_without_art_fields_returns_400(self):
        response = self.post(self.artist_payload(art_fields=[]))
        self.assertEqual(response.status_code, 400)
        self.assertIn("art_fields", response.data)

    def test_organizer_without_name_returns_400(self):
        response = self.post({"role": "organizer"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("name", response.data)

    def test_admin_role_is_rejected(self):
        response = self.post(self.artist_payload(role="admin"))
        self.assertEqual(response.status_code, 400)
        self.user.refresh_from_db()
        self.assertNotEqual(self.user.role, "admin")

    def test_unknown_art_field_returns_400(self):
        response = self.post(self.artist_payload(art_fields=[9999]))
        self.assertEqual(response.status_code, 400)

    def test_inactive_art_field_returns_400(self):
        hidden = ArtField.objects.create(name="Hidden", active=False)
        response = self.post(self.artist_payload(art_fields=[hidden.pk]))
        self.assertEqual(response.status_code, 400)

    def test_invalid_url_returns_400(self):
        response = self.post(self.artist_payload(website_url="banana"))
        self.assertEqual(response.status_code, 400)
        self.assertIn("website_url", response.data)

    def test_registering_twice_returns_409(self):
        self.assertEqual(self.post(self.artist_payload()).status_code, 201)
        self.assertEqual(self.post(self.artist_payload()).status_code, 409)


# ---------------------------------------------------------------------------
# POST /api/users/auth/logout/ and GET /api/users/auth/csrf/
# ---------------------------------------------------------------------------
class LogoutAndCsrfTests(APITestCase):
    def test_logout_ends_the_session(self):
        self.client.force_login(make_user())
        self.assertEqual(self.client.get(reverse("me")).status_code, 200)

        response = self.client.post(reverse("logout"))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(self.client.get(reverse("me")).status_code, 401)

    def test_csrf_route_sets_cookie(self):
        response = APIClient().get(reverse("csrf"))
        self.assertEqual(response.status_code, 200)
        self.assertIn("csrftoken", response.cookies)

    def test_post_without_csrf_token_is_rejected(self):
        client = APIClient(enforce_csrf_checks=True)
        client.force_login(make_user())
        response = client.post(reverse("logout"))
        self.assertEqual(response.status_code, 403)

    def test_post_with_csrf_token_works(self):
        client = APIClient(enforce_csrf_checks=True)
        client.force_login(make_user())
        client.get(reverse("csrf"))
        token = client.cookies["csrftoken"].value
        response = client.post(reverse("logout"), HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, 204)


# ---------------------------------------------------------------------------
# users/adapters.py (runs during the Google login)
# ---------------------------------------------------------------------------
class SocialAdapterTests(TestCase):
    def populate(self, data):
        sociallogin = SocialLogin(
            user=User(),
            account=SocialAccount(provider="google", uid="12345"),
        )
        return SocialAdapter().populate_user(
            RequestFactory().get("/"), sociallogin, data
        )

    def test_display_name_comes_from_first_and_last_name(self):
        user = self.populate(
            {"email": "ana@example.com", "first_name": "Ana", "last_name": "Kovač"}
        )
        self.assertEqual(user.display_name, "Ana Kovač")
        self.assertEqual(user.oauth_provider, "google")
        self.assertEqual(user.oauth_subject, "12345")

    def test_display_name_falls_back_to_email(self):
        user = self.populate({"email": "ana@example.com"})
        self.assertEqual(user.display_name, "ana@example.com")
