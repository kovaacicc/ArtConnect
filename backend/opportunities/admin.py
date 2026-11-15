from django.contrib import admin

from .models import (
    Application,
    ApplicationArtwork,
    ApplicationMaterial,
    CalendarEntry,
    Opportunity,
)


@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ("title", "type", "status", "organizer", "field", "deadline")
    list_filter = ("type", "status", "field")
    search_fields = ("title", "description", "address")
    readonly_fields = ("created_at",)


class ApplicationArtworkInline(admin.TabularInline):
    model = ApplicationArtwork
    extra = 1


class ApplicationMaterialInline(admin.TabularInline):
    model = ApplicationMaterial
    extra = 1


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("opportunity", "artist", "status", "participated", "submitted_at")
    list_filter = ("status", "participated")
    search_fields = ("opportunity__title", "artist__first_name", "artist__last_name")
    readonly_fields = ("submitted_at",)
    inlines = [ApplicationArtworkInline, ApplicationMaterialInline]


@admin.register(ApplicationMaterial)
class ApplicationMaterialAdmin(admin.ModelAdmin):
    list_display = ("name", "application", "url")


@admin.register(CalendarEntry)
class CalendarEntryAdmin(admin.ModelAdmin):
    list_display = ("application", "external_event_id", "added_at")
    readonly_fields = ("added_at",)