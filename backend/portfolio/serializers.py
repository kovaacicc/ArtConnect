from rest_framework import serializers

from .models import ArtField

# A serializer converts between Python objects and JSON, and validates incoming data. Views call them explicitly.

class ArtFieldSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="field_id", read_only=True)
    # ArtField po definiciji modela nema klasični id u svojoj tablici nego field_id pa se ovdje field_id samo preimenuje u id

    class Meta:
        model = ArtField    # govori da se json radi na temelju redaka i atributa ovog modela
        fields = ("id", "name") # iz tog modela, iz redaka u json stavi samo sljedeće atribute npr. {"id": 1, "name": "Painting"}