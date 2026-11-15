from django.utils import timezone
from rest_framework import serializers

from users.models import ArtistProfile

from .models import ArtField, Artwork, ArtworkFile, PastExhibition


class ArtFieldSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="field_id", read_only=True)
    # ArtField po definiciji modela nema klasični id u svojoj tablici nego field_id pa se ovdje field_id samo preimenuje u id

    class Meta:
        model = ArtField # govori da se svaki dict (a kasnije i JSON) koji reprezentira jedan redak modela radi na temelju atributa ovog modela
        fields = ("id", "name")  # npr. izgled dicta koji opisuje jedan redak: {"id": 1, "name": "Painting"}


def validate_year_not_in_future(value):
    if value is not None and value > timezone.localdate().year:
        raise serializers.ValidationError("Year cannot be in the future.")
    return value


class ArtworkFileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="file_id", read_only=True)

    class Meta:
        model = ArtworkFile
        fields = ("id", "url", "file_type")


class ArtworkSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="artwork_id", read_only=True)
    files = ArtworkFileSerializer(many=True, read_only=True)

    class Meta:
        model = Artwork
        fields = (
            "id",
            "title",
            "year_created",
            "technique",
            "dimensions",
            "description",
            "is_public",
            "files",
        )

    def validate_year_created(self, value):
        return validate_year_not_in_future(value)


class PastExhibitionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="exhibition_id", read_only=True)

    class Meta:
        model = PastExhibition
        fields = ("id", "title", "year", "description")

    def validate_year(self, value):
        return validate_year_not_in_future(value)


def get_participations(profile):
    applications = (
        profile.applications.filter(participated=True) #dodati opportunity__deleted_at__isnull=True kad se spoji opportunities na main
        .select_related("opportunity")
        .order_by("-opportunity__starts_at")
    )
    return [
        {
            "opportunity_id": app.opportunity.opportunity_id,
            "title": app.opportunity.title,
            "type": app.opportunity.type,
            "starts_at": app.opportunity.starts_at, #moze biti null
        }
        for app in applications
    ]


class MyPortfolioSerializer(serializers.ModelSerializer):
    """GET/PATCH /api/portfolio/me/ - osnovni podaci i portfolio prijavljenog umjetnika."""

    art_fields = serializers.PrimaryKeyRelatedField(
        many=True,
        allow_empty=False,
        queryset=ArtField.objects.filter(active=True),
    )
    participations = serializers.SerializerMethodField()

    class Meta:
        model = ArtistProfile
        fields = (
            "first_name",
            "last_name",
            "biography",
            "work_description",
            "website_url",
            "social_url",
            "portfolio_public",
            "art_fields",
            "participations",
        )

    def get_participations(self, profile):
        return get_participations(profile)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["art_fields"] = ArtFieldSerializer(
            instance.art_fields.filter(active=True).order_by("name"), many=True
        ).data
        return data


class PublicArtistSerializer(serializers.ModelSerializer):
    """GET /api/portfolio/artists/<id>/ - javni portfolio (samo javna djela)."""

    id = serializers.IntegerField(source="pk", read_only=True)
    art_fields = serializers.SerializerMethodField()
    past_exhibitions = PastExhibitionSerializer(many=True, read_only=True)
    artworks = serializers.SerializerMethodField()
    participations = serializers.SerializerMethodField()

    class Meta:
        model = ArtistProfile
        fields = (
            "id",
            "first_name",
            "last_name",
            "biography",
            "work_description",
            "website_url",
            "social_url",
            "art_fields",
            "past_exhibitions",
            "artworks",
            "participations",
        )

    def get_art_fields(self, profile):
        active_fields = profile.art_fields.filter(active=True).order_by("name")
        return ArtFieldSerializer(active_fields, many=True).data

    def get_artworks(self, profile):
        public_artworks = profile.artworks.filter(is_public=True).prefetch_related(
            "files"
        )
        return ArtworkSerializer(public_artworks, many=True).data

    def get_participations(self, profile):
        return get_participations(profile)
