from .models import User


# pomoćna funkcija i kasnije varijabla koja će označavati kada se neki user po prvi put ulogirao sa oAuth, a idalje nema definiran dal je artist ili organizer
# pa za nedefinirane artist ili organizer rolove dobiva registration_complete == false, i šalje se na registraciju na frontendu. 
def is_registration_complete(user):
    return (
        user.role == User.Role.ADMIN
        or hasattr(user, "artist_profile")
        or hasattr(user, "organizer_profile")
    )