
from django.urls import path
from .views import staff_details_view

urlpatterns = [
    path("name/", staff_details_view, name="staff-details"),
]
