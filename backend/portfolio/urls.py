from django.urls import path

from .views import ArtFieldListView

urlpatterns = [
    path("art-fields/", ArtFieldListView.as_view(), name="art-fields"),
]