from django.urls import path
from . import views

urlpatterns = [

    path('staff-details/', views.staff_details_view, name='staff-details'),

    path('education/', views.education_view, name='education'),
    path('education/<int:pk>/', views.education_detail_view, name='education-detail'),

    path('research/', views.research_view, name='research'),
    path('research/<int:pk>/', views.research_detail_view, name='research-detail'),

    path('research-id/', views.research_id_view, name='research-id'),
    path('research-id/<int:pk>/', views.research_id_detail_view, name='research-id-detail'),

    path('funding/', views.funding_view, name='funding'),
    path('funding/<int:pk>/', views.funding_detail_view, name='funding-detail'),

    path('publication/', views.publication_view, name='publication'),
    path('publication/<int:pk>/', views.publication_detail_view, name='publication-detail'),

    path('administration-position/', views.administration_position_view, name='administration-position'),
    path('administration-position/<int:pk>/', views.administration_position_detail_view, name='administration-position-detail'),

    path('honary-position/', views.honary_position_view, name='honary-position'),
    path('honary-position/<int:pk>/', views.honary_position_detail_view, name='honary-position-detail'),

    path('conference/', views.conference_view, name='conference'),
    path('conference/<int:pk>/', views.conference_detail_view, name='conference-detail'),

    path('phd/', views.phd_view, name='phd-list-create'),
    path('phd/<int:pk>/', views.phd_detail_view, name='phd-detail'),

    path('resource-person/', views.resource_person_view, name='resource-person-list-create'),
    path('resource-person/<int:pk>/', views.resource_person_detail, name='resource-person-detail'),

    path('collaboration/', views.collaboration_view, name='collaboration-list-create'),
    path('collaboration/<int:pk>/', views.collaboration_detail, name='collaboration-detail'),

    path('consultancy/', views.consultancy_view, name='consultancy-list-create'),
    path('consultancy/<int:pk>/', views.consultancy_detail, name='consultancy-detail'),

    path('career-highlight/', views.career_highlight_view, name='career-highlight-list-create'),
    path('career-highlight/<int:pk>/', views.career_highlight_detail, name='career-highlight-detail'),

    path('research-career/', views.research_career_view, name='research-career-list-create'),
    path('research-career/<int:pk>/', views.research_career_detail, name='research-career-detail'),

    path('profile/status/', views.profile_completion_status, name='profile_status'),


]


