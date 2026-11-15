from django.urls import reverse
from rest_framework.test import APITestCase

from .models import ArtField


# GET /api/portfolio/art-fields/
class ArtFieldListTests(APITestCase):
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