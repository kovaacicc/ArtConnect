from django.contrib.auth import logout
from django.db import transaction
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ArtistProfile, OrganizerProfile, User
from .helpers import is_registration_complete
from .serializers import RegisterSerializer, UserSerializer


class MeView(APIView):
    """GET /api/users/me/"""

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class RegisterView(APIView):
    """
    POST /api/users/me/register/
    Kreira artist ili organizer profile u bazi podataka i postavlja role.
    """

    def post(self, request):
        user = request.user

        if is_registration_complete(user):  
            return Response(
                {"detail": "Registration is already complete."},
                status=status.HTTP_409_CONFLICT,
            )

        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        with transaction.atomic():
            if data["role"] == User.Role.ARTIST:
                profile = ArtistProfile.objects.create(
                    user=user,
                    first_name=data["first_name"],
                    last_name=data["last_name"],
                    biography=data.get("biography", ""),
                    work_description=data.get("work_description", ""),
                    website_url=data.get("website_url", ""),
                    social_url=data.get("social_url", ""),
                    portfolio_public=data["portfolio_public"],
                )
                profile.art_fields.set(data["art_fields"])
            else:
                OrganizerProfile.objects.create(
                    user=user,
                    name=data["name"],
                    organization_type=data.get("organization_type", ""),
                    description=data.get("description", ""),
                    approved=False,  # an admin has to approve organizers
                )

            user.role = data["role"]
            if data.get("display_name"):
                user.display_name = data["display_name"]
            user.save(update_fields=["role", "display_name"])

        # ponovno dohvati usera da response koristi i nove informacije o useru
        user = User.objects.get(pk=user.pk)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LogoutView(APIView):
    """POST /api/auth/logout/ - ends the session."""

    permission_classes = [AllowAny]

    def post(self, request):
        logout(request) # flusha session data i briše session cookie
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfView(APIView):
    """GET /api/auth/csrf/ - sets the csrftoken cookie the frontend needs for POST requests."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({"detail": "CSRF cookie set."})