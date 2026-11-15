from rest_framework import serializers

from .models import ArtField


# Serializer klasa:
# - Prima retke (queryset) modela i vraća listu dictionaryija gdje svaki opisuje jedan redak onako kako je definirano u klasi meta ispod.
# - Usput ovisno o primjeni može i validirati podatke npr. za POST requestove.
# - Pozivaju ih viewovi

class ArtFieldSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="field_id", read_only=True)
    # ArtField po definiciji modela nema klasični id u svojoj tablici nego field_id pa se ovdje field_id samo preimenuje u id

    class Meta:
        model = ArtField        # govori da se svaki dict (a kasnije i JSON) koji reprezentira jedan redak modela radi na temelju atributa ovog modela
        fields = ("id", "name") # npr. izgled dicta koji opisuje jedan redak: {"id": 1, "name": "Painting"}