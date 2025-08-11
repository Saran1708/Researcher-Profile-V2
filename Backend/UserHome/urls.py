
from django.urls import path
from .views import staff_details_view, research_career_view

urlpatterns = [
    path("name/", staff_details_view, name="staff-details"),
    path("research-career/", research_career_view, name="research-career"),
]
