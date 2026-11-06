from django.contrib import admin
from django import forms
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import ArtistProfile, OrganizerProfile, User


class CustomUserCreationForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ("email", "display_name", "role")

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_unusable_password()   # OAuth users have no password
        if commit:
            user.save()
        return user

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = "__all__"


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Django's default UserAdmin assumes a "username" field,
    # so everything below is adapted to email-based login.
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    list_display = ("email", "display_name", "role", "is_active", "registered_at")
    list_filter = ("role", "is_active")
    search_fields = ("email", "display_name")
    ordering = ("email",)
    readonly_fields = ("registered_at", "last_login")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("display_name", "role")}),
        ("OAuth", {"fields": ("oauth_provider", "oauth_subject")}),
        (
            "Permissions",
            {"fields": ("is_active", "is_superuser", "groups", "user_permissions")},
        ),
        ("Dates", {"fields": ("registered_at", "last_login")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "display_name", "role"),
            },
        ),
    )


@admin.register(ArtistProfile)
class ArtistProfileAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "user", "portfolio_public")
    list_filter = ("portfolio_public",)
    search_fields = ("first_name", "last_name", "user__email")


@admin.register(OrganizerProfile)
class OrganizerProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "organization_type", "user", "approved")
    list_filter = ("approved", "organization_type")
    search_fields = ("name", "user__email")