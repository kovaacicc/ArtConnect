from django.contrib import admin

from .models import ArtField, ArtistField, Artwork, ArtworkFile, PastExhibition


@admin.register(ArtField)
class ArtFieldAdmin(admin.ModelAdmin):
    list_display = ("name", "active")
    list_filter = ("active",)
    search_fields = ("name",)


@admin.register(ArtistField)
class ArtistFieldAdmin(admin.ModelAdmin):
    list_display = ("artist", "field")


class ArtworkFileInline(admin.TabularInline):
    model = ArtworkFile
    extra = 1


@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):
    list_display = ("title", "artist", "year_created", "is_public")
    list_filter = ("is_public", "year_created")
    search_fields = ("title", "artist__first_name", "artist__last_name")
    inlines = [ArtworkFileInline]


@admin.register(ArtworkFile)
class ArtworkFileAdmin(admin.ModelAdmin):
    list_display = ("artwork", "file_type", "url")


@admin.register(PastExhibition)
class PastExhibitionAdmin(admin.ModelAdmin):
    list_display = ("title", "artist", "year")
    search_fields = ("title",)