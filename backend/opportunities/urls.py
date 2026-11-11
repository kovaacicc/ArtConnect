from django.urls import path

from .views import (
    MyOpportunityListView,
    OpportunityDetailView,
    OpportunityListCreateView,
    OpportunityStatusView,
)

urlpatterns = [
    path("", OpportunityListCreateView.as_view(), name="opportunity-list"),
    path("mine/", MyOpportunityListView.as_view(), name="opportunity-mine"),
    path("<int:opportunity_id>/", OpportunityDetailView.as_view(), name="opportunity-detail"),
    path("<int:opportunity_id>/status/", OpportunityStatusView.as_view(), name="opportunity-status"),
]
