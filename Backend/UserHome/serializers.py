# userdetails/serializers.py
from rest_framework import serializers
from UserDetails.models import Staff_Details


class StaffDetailsSerializer(serializers.ModelSerializer):
    """Expose only staff details."""
    class Meta:
        model = Staff_Details
        fields = ("name", "department")



   