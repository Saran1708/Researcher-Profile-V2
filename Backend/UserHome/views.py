# userdetails/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from UserDetails.models import Staff_Details,Research_Career
from .serializers import StaffDetailsSerializer, ResearchCareerSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def staff_details_view(request):
    """
    GET /api/staff/me/
    Returns: {"name": "...", "department": "..."}
    """
    try:
        staff_details = Staff_Details.objects.get(email=request.user)
        serializer = StaffDetailsSerializer(staff_details)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Staff_Details.DoesNotExist:
        return Response(
            {"error": "Staff details not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def research_career_view(request):
    """
    GET /api/research-career/me/
    Returns: {"research_career_details": "..."}
    """
    try:
        # Make sure you're using .get() not .filter()
        research_career = Research_Career.objects.get(email=request.user)
        
        # Make sure you're NOT using many=True here
        serializer = ResearchCareerSerializer(research_career)  # NO many=True
        
        print("Debug - research_career object:", research_career)
        print("Debug - serializer.data:", serializer.data)
        print("Debug - type of serializer.data:", type(serializer.data))
        
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Research_Career.DoesNotExist:
        return Response(
            {"research_career_details": ""},  
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        print("Debug - Exception:", str(e))
        return Response(
            {"error": str(e)},  
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
