from rest_framework.permissions import BasePermission

from users.models import User


class IsOrganizer(BasePermission):
    message = "Only organizers can do this."

    def has_permission(self, request, view):
        user = request.user
        return (
            user.is_authenticated
            and user.role == User.Role.ORGANIZER
            and hasattr(user, "organizer_profile")
        )
