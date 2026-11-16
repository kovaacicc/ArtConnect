from rest_framework.permissions import BasePermission

from users.models import User


class IsArtist(BasePermission):
    message = "Only artists can do this."

    def has_permission(self, request, view):
        user = request.user
        return (
            user.is_authenticated
            and user.role == User.Role.ARTIST
            and hasattr(user, "artist_profile")
        )
