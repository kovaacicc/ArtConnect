from django.urls import path

from .views import (
    ArtFieldListView,
    ArtworkDetailView,
    ArtworkFileCreateView,
    ArtworkFileDestroyView,
    ArtworkListCreateView,
    MyPortfolioView,
    PastExhibitionDetailView,
    PastExhibitionListCreateView,
    PublicArtistView,
)

urlpatterns = [
    path("art-fields/", ArtFieldListView.as_view(), name="art-fields"),
    path("me/", MyPortfolioView.as_view(), name="portfolio-me"),
    path("artworks/", ArtworkListCreateView.as_view(), name="artwork-list"),
    path("artworks/<int:artwork_id>/", ArtworkDetailView.as_view(), name="artwork-detail"),
    path(
        "artworks/<int:artwork_id>/files/",
        ArtworkFileCreateView.as_view(),
        name="artwork-file-create",
    ),
    path(
        "artworks/<int:artwork_id>/files/<int:file_id>/",
        ArtworkFileDestroyView.as_view(),
        name="artwork-file-delete",
    ),
    path("exhibitions/", PastExhibitionListCreateView.as_view(), name="exhibition-list"),
    path(
        "exhibitions/<int:exhibition_id>/",
        PastExhibitionDetailView.as_view(),
        name="exhibition-detail",
    ),
    path("artists/<int:artist_id>/", PublicArtistView.as_view(), name="artist-public"),
]
