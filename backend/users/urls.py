from django.urls import path
from .views import CsrfView, LogoutView, MeView, RegisterView

urlpatterns = [
    path("users/me/", MeView.as_view(), name="me"),
    path("users/me/register/", RegisterView.as_view(), name="register"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/csrf/", CsrfView.as_view(), name="csrf"),
]