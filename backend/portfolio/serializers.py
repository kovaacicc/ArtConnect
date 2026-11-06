from rest_framework import serializers

from .models import ArtField


class ArtFieldSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="field_id", read_only=True)

    class Meta:
        model = ArtField
        fields = ("id", "name")