from django.db import models

class Artwork(models.Model):
    artwork_id = models.BigAutoField(primary_key=True)  # BigAutoField - bazaPodataka automatski piše integer brojeve za svaki redak kao IDeve
    artist = models.ForeignKey(
        "users.ArtistProfile", on_delete=models.CASCADE, related_name="artworks"
    )
    title = models.CharField(max_length=200)
    year_created = models.PositiveIntegerField(null=True, blank=True)
    technique = models.CharField(max_length=200, blank=True)    # CharField - kraći tekstovi sa limitom charactera
    dimensions = models.CharField(max_length=100, blank=True)   
    description = models.TextField(blank=True)                  # TextField - dulji tekstovi poput opisa biografija
    is_public = models.BooleanField(default=True)
 
    def __str__(self):
        return self.title

class ArtworkFile(models.Model):
    file_id = models.BigAutoField(primary_key=True)
    artwork = models.ForeignKey(
        Artwork, on_delete=models.CASCADE, related_name="files"
    )
    url = models.URLField(max_length=500)       # URLField - tekst za koji provjerava odgovara li URL-olikom zapisu ako se podnosi u formi
    file_type = models.CharField(max_length=50, blank=True)
 
    def __str__(self):
        return f"{self.artwork} file #{self.file_id}"


class PastExhibition(models.Model):
    exhibition_id = models.BigAutoField(primary_key=True)
    artist = models.ForeignKey(
        "users.ArtistProfile", on_delete=models.CASCADE, related_name="past_exhibitions"
    )
    title = models.CharField(max_length=200)
    year = models.PositiveIntegerField(null=True, blank=True)
    description = models.TextField(blank=True)
 
    def __str__(self):
        return self.title

class ArtField(models.Model):
    field_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    active = models.BooleanField(default=True)
 
    def __str__(self):
        return self.name


class ArtistField(models.Model):
    """Join table for: ArtistProfile <-> ArtField."""
 
    artist = models.ForeignKey("users.ArtistProfile", on_delete=models.CASCADE)
    field = models.ForeignKey(ArtField, on_delete=models.CASCADE)
 
    class Meta:
        constraints = [ 
            models.UniqueConstraint(    # Constraint da nijedna dva retka ne smiju imati istog artista i field jer su artist i field kompozitni PK
                fields=["artist", "field"], name="unique_artist_field"
            )
        ]
 
    def __str__(self):
        return f"{self.artist} - {self.field}"
