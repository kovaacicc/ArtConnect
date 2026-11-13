from django.utils import timezone
from rest_framework import serializers

from portfolio.models import ArtField

from .models import Opportunity


class OpportunitySerializer(serializers.ModelSerializer):
    # nakon objave organizator smije mijenjati samo ova polja (F-010)
    EDITABLE_AFTER_PUBLISH = {
        "address", "latitude", "longitude",   # lokacija
        "deadline",                           # rok za prijavu
        "starts_at", "ends_at",               # vrijeme održavanja
    }

    id =serializers.IntegerField(source="opportunity_id", read_only=True)
    field_name = serializers.CharField(source="field.name", read_only=True)
    organizer_name = serializers.CharField(source="organizer.name", read_only=True)

    field = serializers.PrimaryKeyRelatedField(
        queryset=ArtField.objects.filter(active=True)
    )

    latitude = serializers.DecimalField(
        max_digits=9, decimal_places=6, min_value=-90, max_value=90,
        required=False, allow_null=True,
    )
    longitude = serializers.DecimalField(
        max_digits=9, decimal_places=6, min_value=-180, max_value=180,
        required=False, allow_null=True,
    )

    class Meta:
        model = Opportunity
        fields = (
            "id",
            "type",
            "title",
            "description",
            "field",
            "field_name",
            "organizer_name",
            "deadline",
            "address",
            "latitude",
            "longitude",
            "starts_at",
            "ends_at",
            "age_criteria",
            "reward",
            "status",
            "created_at",
        )
        read_only_fields = ("status", "created_at")

    def validate_deadline(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError("Deadline cannot be in the past.")
        return value

    def validate(self, attrs):
        if self.instance is not None:
            self.check_editable(attrs)

        # kod uređivanja (PATCH) stiže samo dio polja pa ostala uzimamo iz postojeće prilike
        def value(name):
            if name in attrs:
                return attrs[name]
            return getattr(self.instance, name, None)

        starts_at, ends_at = value("starts_at"), value("ends_at")
        if starts_at and ends_at and ends_at < starts_at:
            raise serializers.ValidationError(
                {"ends_at": "Event cannot end before it starts."}
            )

        if (value("latitude") is None) != (value("longitude") is None):
            raise serializers.ValidationError(
                {"latitude": "Latitude and longitude must be set together."}
            )

        return attrs

    def check_editable(self, attrs):
        """F-010: što se smije mijenjati ovisno o statusu."""
        if self.instance.status == Opportunity.Status.FINISHED:
            raise serializers.ValidationError("A finished opportunity can no longer be edited.")

        if self.instance.is_published:
            locked = [
                name for name, new_value in attrs.items()
                if name not in self.EDITABLE_AFTER_PUBLISH
                and getattr(self.instance, name) != new_value
            ]
            if locked:
                raise serializers.ValidationError({
                    name: "Cannot be changed after publishing (only location, deadline and event time can)."
                    for name in locked
                })


class StatusChangeSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Opportunity.Status.choices)


class DeleteSerializer(serializers.Serializer):
    reason = serializers.CharField(max_length=2000, required=False, allow_blank=True, default="")
