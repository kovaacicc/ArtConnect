from django.db import migrations

ART_FIELDS = ["Slikarstvo", "Fotografija", "Kiparstvo", "Digitalna umjetnost"]

def insertArtFields(apps, schema_editor):
    art_field = apps.get_model("portfolio", "ArtField")
    for field in ART_FIELDS:
        art_field(name=field).save()


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0002_initial"),
    ]

    operations = [migrations.RunPython(insertArtFields),]