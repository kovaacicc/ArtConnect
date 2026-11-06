from rest_framework import serializers

from portfolio.models import ArtField
from portfolio.serializers import ArtFieldSerializer

from .models import ArtistProfile, OrganizerProfile, User

# A serializer converts between Python objects and JSON, and validates incoming data. Views call them explicitly.


# pomoćna funkcija i kasnije varijabla koja će označavati kada se neki user po prvi put ulogirao sa oAuth i idalje nema definiran dal je artist ili organizer
# pa za nedefinirane artist ili organizer rolove dobiva registration_complete == false, i šalje se na registraciju na frontendu. 
def is_registration_complete(user):
    """A user finished registration once they have a profile (admins are exempt)."""
    return (
        user.role == User.Role.ADMIN
        or hasattr(user, "artist_profile")
        or hasattr(user, "organizer_profile")
    )


class ArtistProfileSerializer(serializers.ModelSerializer):
    art_fields = ArtFieldSerializer(many=True, read_only=True)  # pretvorimo art_fields u svoje jsone

    # opis jsona za retke modela ArtistProfile 
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
        )


class OrganizerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizerProfile
        fields = ("name", "organization_type", "description", "approved")


class UserSerializer(serializers.ModelSerializer):
    """Response of GET /api/users/me/."""

    id = serializers.IntegerField(source="user_id", read_only=True)
    registration_complete = serializers.SerializerMethodField() # za SerializerMethodField() DRF traži metodu definiranu u ovoj klasi koja počinje sa get_ 
                                                                # i onda se prepiše ime varijablje od lijevo u koju spremamo rezultat: get_registration_complete, što je ime metode koju trebamo
    artist_profile = ArtistProfileSerializer(read_only=True, allow_null=True)
    organizer_profile = OrganizerProfileSerializer(read_only=True, allow_null=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "display_name",
            "role",
            "registration_complete",
            "artist_profile",
            "organizer_profile",
        )

    def get_registration_complete(self, user):
        return is_registration_complete(user)


class RegisterSerializer(serializers.Serializer):
    """Request body of POST /api/users/me/register/."""

    # POST register dolazi na backend i prvo se radi validacija podataka tako da se definiraju ovu seralizeri sa nekim uvjetima
    role = serializers.ChoiceField(
        choices=[User.Role.ARTIST.value, User.Role.ORGANIZER.value]
    )
    display_name = serializers.CharField(required=False, max_length=150)

    # artist fields
    first_name = serializers.CharField(required=False, max_length=100)
    last_name = serializers.CharField(required=False, max_length=100)
    biography = serializers.CharField(required=False, allow_blank=True)
    work_description = serializers.CharField(required=False, allow_blank=True)
    website_url = serializers.URLField(required=False, allow_blank=True)
    social_url = serializers.URLField(required=False, allow_blank=True)
    portfolio_public = serializers.BooleanField(default=False)
    art_fields = serializers.PrimaryKeyRelatedField(
        many=True,
        required=False,
        queryset=ArtField.objects.filter(active=True),
    )

    
    # organizer fields
    name = serializers.CharField(required=False, max_length=200)
    organization_type = serializers.CharField(
        required=False, allow_blank=True, max_length=100
    )
    description = serializers.CharField(required=False, allow_blank=True)

    # provjerava podatake koje backend dobi POST-om regeister nakon validacije serijalizera
    def validate(self, attrs):
        if attrs["role"] == User.Role.ARTIST:
            errors = {
                field: "This field is required for artists."
                for field in ("first_name", "last_name")
                if not attrs.get(field)
            }
            if not attrs.get("art_fields"):
                errors["art_fields"] = "Choose at least one art field."
            if errors:
                raise serializers.ValidationError(errors)
        else:
            if not attrs.get("name"):
                raise serializers.ValidationError(
                    {"name": "This field is required for organizers."}
                )
        return attrs