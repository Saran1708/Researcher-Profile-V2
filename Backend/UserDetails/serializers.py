from rest_framework import serializers
from .models import (
    User, 
    Staff_Details,
    Education, 
    Research, 
    Research_ID, 
    Funding,
    Publication, 
    Administration_Position, 
    Honary_Position, 
    Conferenece,
    Phd, 
    Resource_Person, 
    Career_Highlight, 
    Research_Career,
    Collaboration, 
    Consultancy
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class StaffDetailsSerializer(serializers.ModelSerializer):
    email_value = serializers.SerializerMethodField()
    class Meta:
        model = Staff_Details
        fields = '__all__'

    def get_email_value(self, obj):
        return obj.email.email if obj.email else None


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'


class ResearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Research
        fields = '__all__'


class ResearchIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Research_ID
        fields = '__all__'


class FundingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Funding
        fields = '__all__'


class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = '__all__'


class AdministrationPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administration_Position
        fields = '__all__'


class HonaryPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Honary_Position
        fields = '__all__'


class ConfereneceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conferenece
        fields = '__all__'


class PhdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phd
        fields = '__all__'


class ResourcePersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource_Person
        fields = '__all__'


class CareerHighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Career_Highlight
        fields = '__all__'


class ResearchCareerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Research_Career
        fields = '__all__'


class CollaborationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collaboration
        fields = '__all__'


class ConsultancySerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultancy
        fields = '__all__'
