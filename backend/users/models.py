from django.db import models

from django.contrib.auth.models import (
    AbstractBaseUser,       # već gotove klase za stvaranje usera u bazi
    BaseUserManager,
    PermissionsMixin,
)

# Create your models here.

# UserManager je custom objects manager kako bi pazio da u kreiranju usera imamo normaliziran mail i pasword da se "onemogući" + admin kreacija
class UserManager(BaseUserManager):
    use_in_migrations = True    # znači da će označit postojanje ovog wrappanog objects managera u migration fileu, ali ne radi od njega tablicu

    # kreiramo novu instancu usera
    def create_user(self, email, display_name="", password=None, **extra):  
        # **extra su bilo koji drugi fieldovi, tj. atributi, tj. stupci u ovoj tablici
        if not email:
            raise ValueError("Email is required")
        user = self.model(
            email=self.normalize_email(email),  # normalize -> lowercases the domain part, npr. A@GMAIL.COM → A@gmail.com
            display_name=display_name,
            **extra,
        )
        # if password:          # ne koristimo password, ali ostavljam tu jer je potrebno za ovu klasu ako će se ikada dodavati
        #     user.set_password(password)
        # else:
        user.set_unusable_password()  # OAuth ne traži password, pa onemogućujemo atribut passworda u bazi, tj. stavljamo value koji se nikada neće moći dobiti u loginu
        user.save(using=self._db) # sprema usera u database kojeg UserManager klasa koristi
        return user

    def create_superuser(self, email, display_name="", password=None, **extra): 
        # koristi se za python manage.py createsuperuser, ako želimo kreirati Admin account za site
        # POTREBNO dodati za custom objects manager što UserManger upravo i jest
        extra.setdefault("role", User.Role.ADMIN)                           
        extra.setdefault("is_superuser", True)
        return self.create_user(email, display_name, password, **extra)


# klasa User definira atribute tablice User, tj. kako instanca (redak) klase (tablice) User izgleda
# AbstractBaseUser je model pa je s time i naš User model
class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices): # Enumovi za role
        ARTIST = "artist", "Artist"
        ORGANIZER = "organizer", "Organizer"
        ADMIN = "admin", "Administrator"

    # definicija atributa (columna) tablice
    user_id = models.BigAutoField(primary_key=True)
    display_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.ARTIST)
    oauth_provider = models.CharField(max_length=50, blank=True)
    oauth_subject = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager() # UserManager wrapa standardni User.objects manager koji ima svoje metode poput: 
                            # User.objects.all(), .filter(), .get(), .create() ... = query metode za pristup bazi
                            # sa novododanim metodama create_user i create_superuser koje su prilagođene našoj želji da prilikom kreacije 
                            # npr. User.objects.create_user(email="a@B.COM", display_name="Ana"), 
                            #       email postane "a@b.com" i da dodamo dodatne atribute kao što je display_name

    USERNAME_FIELD = "email"    # oznaka Djangu da je email login identifier umjesto usernamea i da to treba gledati na loginu (nama korisno samo kod Admina)
    REQUIRED_FIELDS = ["display_name"]  # važno za superusera, jer prilikom python manage.py createsuperuser, traži se Email i Password automatski, a
                                        # za druga traženja pogleda se REQUIRED_FIELDS tablice i vidi da treba tražiti i da se upiše display_name 

    class Meta:     # tu stavljamo settingse za tablicu, kao ordering, table name, constraints ...
        constraints = [
            models.UniqueConstraint(    # za usere koji koriste OAuth, a ovdje su to svi, ne smije postojati dva usera sa istim provider i subject
                fields=["oauth_provider", "oauth_subject"],
                condition=~models.Q(oauth_provider=""),
                name="unique_oauth_identity",
            )
        ]

    @property
    def is_staff(self): # ponovno potrebno samo za superusera, tj. admina. Ova funkcija se poziva nad userom koji želi ući na /admin, da se provjeri je li Admin
        # Needed for Django admin access
        return self.role == self.Role.ADMIN or self.is_superuser

    def __str__(self):  # kako se user instanca pretvara u string 
        return self.display_name or self.email


class ArtistProfile(models.Model):

    # (uvijek u definiciji tablice opisujemo sve veze prema njoj)
    user = models.OneToOneField(    # opisuje vezu User prema ArtistProfile 
        User,
        on_delete=models.CASCADE,
        primary_key=True,   # kaže da je FK, ali i PK ArtistProfila upravo ono PK od User-a, što je user_id
        related_name="artist_profile",  # služi za pristupanje relaciji ArtistProfile ako krenemo od instance user tablice User, npr:
                                        # user = User.objects.get(email="ana@gmail.com")
                                        # user.artist_profile.biography go from User to ArtistProfile
                                        
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    biography = models.TextField(blank=True)
    work_description = models.TextField(blank=True)
    website_url = models.URLField(blank=True)
    social_url = models.URLField(blank=True)
    portfolio_public = models.BooleanField(default=False)
 
    art_fields = models.ManyToManyField( # opisuje vezu ArtField prema ArtistProfile
        ArtField,
        through="ArtistField",
        related_name="artists",
    )
 
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class OrganizerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="organizer_profile",
    )
    name = models.CharField(max_length=200)
    organization_type = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    approved = models.BooleanField(default=False)
 
    def __str__(self):
        return self.name
