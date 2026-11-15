from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Opportunity
from .permissions import IsOrganizer
from .serializers import DeleteSerializer, OpportunitySerializer, StatusChangeSerializer


class OpportunityListCreateView(ListCreateAPIView):
    serializer_class = OpportunitySerializer
    pagination_class = None

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsOrganizer()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return (
            Opportunity.objects.filter(deleted_at__isnull=True)
            .exclude(status=Opportunity.Status.PREPARATION)
            .select_related("organizer", "field")
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user.organizer_profile)


class MyOpportunityListView(ListAPIView):
    serializer_class = OpportunitySerializer
    permission_classes = [IsOrganizer]
    pagination_class = None

    def get_queryset(self):
        return (
            Opportunity.objects.filter(
                organizer=self.request.user.organizer_profile, deleted_at__isnull=True
            )
            .select_related("organizer", "field")
            .order_by("-created_at")
        )


class OpportunityDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = OpportunitySerializer
    http_method_names = ["get", "patch", "delete", "head", "options"]  # bez PUT
    lookup_field = "opportunity_id"

    def get_permissions(self):
        if self.request.method in ("PATCH", "DELETE"):
            return [IsOrganizer()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Opportunity.objects.filter(deleted_at__isnull=True).select_related(
            "organizer", "field"
        )
        if self.request.method in ("PATCH", "DELETE"):
            # mijenjati i brisati smije samo vlasnik
            return queryset.filter(organizer=self.request.user.organizer_profile)
        return queryset.filter(
            ~Q(status=Opportunity.Status.PREPARATION)
            | Q(organizer_id=self.request.user.pk)
        )

    def destroy(self, request, *args, **kwargs):
        opportunity = self.get_object()

        if not opportunity.is_published:
            # nacrt nitko nije vidio pa ga brišemo stvarno
            opportunity.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = DeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reason = serializer.validated_data["reason"].strip()
        if not reason:
            raise ValidationError(
                {"reason": "A reason is required to delete a published opportunity."}
            )

        opportunity.deleted_at = timezone.now()
        opportunity.deletion_reason = reason
        opportunity.save(update_fields=["deleted_at", "deletion_reason"])
        return Response(status=status.HTTP_204_NO_CONTENT)


class OpportunityStatusView(APIView):
    permission_classes = [IsOrganizer]

    def post(self, request, opportunity_id):
        opportunity = get_object_or_404(
            Opportunity,
            opportunity_id=opportunity_id,
            organizer=request.user.organizer_profile,
            deleted_at__isnull=True,
        )

        serializer = StatusChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_status = serializer.validated_data["status"]

        if not opportunity.can_transition_to(new_status):
            raise ValidationError(
                {"status": f"Cannot change status from '{opportunity.status}' to '{new_status}'."}
            )

        if new_status == Opportunity.Status.OPEN:
            self.check_can_open(request.user, opportunity)

        opportunity.status = new_status
        opportunity.save(update_fields=["status"])
        return Response(OpportunitySerializer(opportunity).data)

    @staticmethod
    def check_can_open(user, opportunity):
        if not user.organizer_profile.approved:
            raise PermissionDenied(
                "Your organizer account has not been approved by an administrator yet."
            )

        errors = {}
        if not opportunity.description.strip():
            errors["description"] = "Required to open applications."
        if opportunity.deadline is None:
            errors["deadline"] = "Required to open applications."
        elif opportunity.deadline < timezone.localdate():
            errors["deadline"] = "Deadline is in the past; change it before opening applications."
        if errors:
            raise ValidationError(errors)
