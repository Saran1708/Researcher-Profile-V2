# userdetails/serializers.py
from rest_framework import serializers
from UserDetails.models import Staff_Details,Research_Career


class StaffDetailsSerializer(serializers.ModelSerializer):
    """Expose only staff details."""
    class Meta:
        model = Staff_Details
        fields = ("name", "department")


class ResearchCareerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Research_Career
        fields = ['id', 'research_career_details', 'email']
   