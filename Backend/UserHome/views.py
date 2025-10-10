# userdetails/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from UserDetails.models import Staff_Details
from .serializers import StaffDetailsSerializer


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


