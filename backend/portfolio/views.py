from django.shortcuts import get_object_or_404
from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    ListAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import AllowAny

from users.models import ArtistProfile

from .models import ArtField, Artwork, ArtworkFile, PastExhibition
from .permissions import IsArtist
from .serializers import (
    ArtFieldSerializer,
    ArtworkFileSerializer,
    ArtworkSerializer,
    MyPortfolioSerializer,
    PastExhibitionSerializer,
    PublicArtistSerializer,
)


class ArtFieldListView(ListAPIView):
    queryset = ArtField.objects.filter(active=True).order_by("name")
    serializer_class = ArtFieldSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    pagination_class = None

class MyPortfolioView(RetrieveUpdateAPIView):
    """GET/PATCH /api/portfolio/me/"""

    serializer_class = MyPortfolioSerializer
    permission_classes = [IsArtist]
    http_method_names = ["get", "patch", "head", "options"]  # bez PUT

    def get_object(self):
        return self.request.user.artist_profile

class ArtworkListCreateView(ListCreateAPIView):
    """GET/POST /api/portfolio/artworks/"""

    serializer_class = ArtworkSerializer
    permission_classes = [IsArtist]
    pagination_class = None

    def get_queryset(self):
        return (
            Artwork.objects.filter(artist=self.request.user.artist_profile)
            .prefetch_related("files")
            .order_by("-artwork_id")
        )

    def perform_create(self, serializer):
        serializer.save(artist=self.request.user.artist_profile)


class ArtworkDetailView(RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/portfolio/artworks/<id>/"""

    serializer_class = ArtworkSerializer
    permission_classes = [IsArtist]
    http_method_names = ["get", "patch", "delete", "head", "options"]  # bez PUT
    lookup_field = "artwork_id"

    def get_queryset(self):
        return Artwork.objects.filter(
            artist=self.request.user.artist_profile
        ).prefetch_related("files")


class ArtworkFileCreateView(CreateAPIView):
    """POST /api/portfolio/artworks/<id>/files/"""

    serializer_class = ArtworkFileSerializer
    permission_classes = [IsArtist]

    def perform_create(self, serializer):
        artwork = get_object_or_404(
            Artwork,
            artwork_id=self.kwargs["artwork_id"],
            artist=self.request.user.artist_profile,
        )
        serializer.save(artwork=artwork)


class ArtworkFileDestroyView(DestroyAPIView):
    """DELETE /api/portfolio/artworks/<id>/files/<file_id>/"""

    permission_classes = [IsArtist]
    lookup_field = "file_id"

    def get_queryset(self):
        return ArtworkFile.objects.filter(
            artwork__artwork_id=self.kwargs["artwork_id"],
            artwork__artist=self.request.user.artist_profile,
        )


class PastExhibitionListCreateView(ListCreateAPIView):
    """GET/POST /api/portfolio/exhibitions/"""

    serializer_class = PastExhibitionSerializer
    permission_classes = [IsArtist]
    pagination_class = None

    def get_queryset(self):
        return PastExhibition.objects.filter(
            artist=self.request.user.artist_profile
        ).order_by("-year", "-exhibition_id")

    def perform_create(self, serializer):
        serializer.save(artist=self.request.user.artist_profile)


class PastExhibitionDetailView(RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/portfolio/exhibitions/<id>/"""

    serializer_class = PastExhibitionSerializer
    permission_classes = [IsArtist]
    http_method_names = ["get", "patch", "delete", "head", "options"]  # bez PUT
    lookup_field = "exhibition_id"

    def get_queryset(self):
        return PastExhibition.objects.filter(artist=self.request.user.artist_profile)
    

class PublicArtistView(RetrieveAPIView):
    """GET /api/portfolio/artists/<id>/"""

    serializer_class = PublicArtistSerializer
    lookup_field = "pk"
    lookup_url_kwarg = "artist_id"

    def get_queryset(self):
        return ArtistProfile.objects.filter(
            portfolio_public=True, user__is_active=True
        ).prefetch_related("past_exhibitions")
