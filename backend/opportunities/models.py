from django.db import models
from portfolio.models import ArtField, Artwork
from users.models import OrganizerProfile, ArtistProfile

class Opportunity(models.Model):
    class Type(models.TextChoices):
        EXHIBITION = "exhibition", "Exhibition"
        COMPETITION = "competition", "Competition"
        WORKSHOP = "workshop", "Workshop"
        OTHER = "other", "Other"
 
    class Status(models.TextChoices):
        PREPARATION = "preparation", "Priprema"
        OPEN = "open", "Open"
        CLOSED = "closed", "Closed"
        SELECTION = "selection", "U procesu odabira"
        FINISHED = "finished", "Finished"

 
    opportunity_id = models.BigAutoField(primary_key=True)
    organizer = models.ForeignKey(
        OrganizerProfile, on_delete=models.CASCADE, related_name="opportunities"
    )
    field = models.ForeignKey(
        ArtField, on_delete=models.PROTECT, related_name="opportunities"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=20, choices=Type.choices)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    deadline = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=300, blank=True)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    age_criteria = models.CharField(max_length=200, blank=True)
    reward = models.CharField(max_length=300, blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PREPARATION
    )
    results = models.TextField(blank=True)
 
    class Meta:
        verbose_name_plural = "opportunities"   # kojim imenom će model biti displayan na Django Admin
 
    def __str__(self):
        return self.title

class Application(models.Model):
    class Status(models.TextChoices):
        SUBMITTED = "submitted", "Predana"
        IN_REVIEW = "in_review", "U pregledu"
        NEEDS_INFO = "needs_info", "Potrebna dopuna"
        ACCEPTED = "accepted", "Prihvaćena"
        REJECTED = "rejected", "Odbijena"
 
    application_id = models.BigAutoField(primary_key=True)
    opportunity = models.ForeignKey(
        Opportunity, on_delete=models.CASCADE, related_name="applications"
    )
    artist = models.ForeignKey(
        ArtistProfile, on_delete=models.CASCADE, related_name="applications"
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.SUBMITTED
    )
    message = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    participated = models.BooleanField(default=False)
 
    artworks = models.ManyToManyField(  # Povezujemo Application sa Artwork
        Artwork,
        through="ApplicationArtwork",   # preko ApplicationArtwork tablice
        related_name="applications",
        blank=True,
    )
 
    class Meta:
        constraints = [
            models.UniqueConstraint(    # ne smijemo imati dva retka sa istim ooportunity i artist jer su FK
                fields=["opportunity", "artist"], name="unique_application_per_artist"
            )
        ]
 
    def __str__(self):
        return f"{self.artist} -> {self.opportunity}"
 

class ApplicationArtwork(models.Model):
    """Join table for: Application <-> Artwork."""
 
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE)
 
    class Meta:
        constraints = [
            models.UniqueConstraint(    # ne mogu postojati 2 retka sa istim application i artwork, jer su oba dio PK i FK
                fields=["application", "artwork"], name="unique_application_artwork"
            )
        ]
 
    def __str__(self):
        return f"{self.application} - {self.artwork}"


class ApplicationMaterial(models.Model):
    material_id = models.BigAutoField(primary_key=True)
    application = models.ForeignKey(
        Application, on_delete=models.CASCADE, related_name="materials"
    )
    name = models.CharField(max_length=200)
    url = models.URLField(max_length=500)
 
    def __str__(self):
        return self.name

class CalendarEntry(models.Model):
    entry_id = models.BigAutoField(primary_key=True)
    application = models.OneToOneField(
        Application, on_delete=models.CASCADE, related_name="calendar_entry"
    )
    external_event_id = models.CharField(max_length=255)
    added_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        verbose_name_plural = "calendar entries"
 
    def __str__(self):
        return f"Calendar entry for {self.application}"



