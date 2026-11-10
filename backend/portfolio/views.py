from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from .models import ArtField
from .serializers import ArtFieldSerializer


class ArtFieldListView(ListAPIView):    # ListAPIView je klasa koja će za nas vratiti HTTP response, koji će se kreirati na temelju stavki ispod

    queryset = ArtField.objects.filter(active=True).order_by("name")
    serializer_class = ArtFieldSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    pagination_class = None