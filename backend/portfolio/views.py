from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from .models import ArtField
from .serializers import ArtFieldSerializer


class ArtFieldListView(ListAPIView):    # ListAPIView je klasa koja već vraća response sa stvarima koje mi ispod navedemo
    """GET /api/art-fields/ - all active art fields (public, used by the register form)."""

    queryset = ArtField.objects.filter(active=True).order_by("name")
    serializer_class = ArtFieldSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    pagination_class = None