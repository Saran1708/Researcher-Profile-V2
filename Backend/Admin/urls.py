from django.urls import path
from Admin import views
from Admin.views import (
    ManageUsersView, UserDetailView,
    PhdScholarsCountView, PhdScholarsDetailsView, PhdSummaryView,
    FundingDetailsView, PublicationListView,
    ResearchIDListView, ResearchAreasListView, ResetUserPasswordView
)

urlpatterns = [
    # USERS
    path('users/', ManageUsersView.as_view(), name='manage-users'),
    path('users/<int:user_id>/', UserDetailView.as_view(), name='user-detail'),

    # PhD
    path('phd/scholars-count/', PhdScholarsCountView.as_view(), name='phd-count'),
    path('phd/scholars-details/', PhdScholarsDetailsView.as_view(), name='phd-details'),
    path('phd/summary/', PhdSummaryView.as_view(), name='phd-summary'),

    # FUNDING
    path('funding/', FundingDetailsView.as_view(), name='funding-details'),

    # PUBLICATIONS
    path('publications/', PublicationListView.as_view(), name='publications-list'),

    # RESEARCH
    path('research_ids/', ResearchIDListView.as_view(), name='research_ids_api'),
    path('research_areas/', ResearchAreasListView.as_view(), name='research_areas_api'),

    # DASHBOARD (FUNCTION BASED VIEWS)
    path('dashboard/stats/', views.dashboard_stats, name='dashboard_stats'),
    path('dashboard/publications-trend/', views.publications_yearly_trend, name='publications_trend'),
    path('dashboard/research-distribution/', views.research_distribution, name='research_distribution'),
    path('dashboard/funding-trend/', views.funding_yearly_trend, name='funding_trend'),
    path('dashboard/phd-status/', views.phd_supervision_status, name='phd_status'),

    path('profile-views-analytics/', views.admin_profile_views_analytics, name='admin_profile_views_analytics'),
    path('users/<int:user_id>/reset-password/', ResetUserPasswordView.as_view(), name='reset-user-password'),
    
    path('export/', views.export_data, name='export_data'),
]
