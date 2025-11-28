from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from datetime import timedelta
from django.utils import timezone
from rest_framework.permissions import AllowAny


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
    Consultancy,
    ProfileTracker,
    ProfileViewLog
)

from .serializers import (
    UserSerializer,
    StaffDetailsSerializer,
    EducationSerializer,
    ResearchSerializer,
    ResearchIDSerializer,
    FundingSerializer,
    PublicationSerializer,
    AdministrationPositionSerializer,
    HonaryPositionSerializer,
    ConfereneceSerializer,
    PhdSerializer,
    ResourcePersonSerializer,
    CareerHighlightSerializer,
    ResearchCareerSerializer,
    CollaborationSerializer,
    ConsultancySerializer,
)


def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0]
    return request.META.get("REMOTE_ADDR")


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def staff_details_view(request):
    try:
        user = request.user
        staff_details = Staff_Details.objects.filter(email=user).first()

        if request.method == 'GET':
            if staff_details:
                serializer = StaffDetailsSerializer(staff_details)
                return Response(serializer.data)
            else:
                # Return empty/default data instead of 404
                serializer = StaffDetailsSerializer()
                return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method in ['POST', 'PUT']:
            data = request.data.copy()
            data['email'] = user.id

            if staff_details:
                serializer = StaffDetailsSerializer(staff_details, data=data, partial=True)
            else:
                serializer = StaffDetailsSerializer(data=data)

            if serializer.is_valid():
                serializer.save()
                tracker, _ = ProfileTracker.objects.get_or_create(user=user)
                tracker.profile_details_completed = True
                tracker.save()

                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def education_view(request):
    try:
        user = request.user
        
        if request.method == 'GET':
            # Return all education records for the user
            educations = Education.objects.filter(email=user)
            if educations.exists():
                serializer = EducationSerializer(educations, many=True)
                return Response(serializer.data)
            else:
                # Return empty array
                return Response([], status=status.HTTP_200_OK)
        
        elif request.method == 'POST':
            # Create new education record
            data = request.data.copy()
            data['email'] = user.id
            
            serializer = EducationSerializer(data=data)
            
            if serializer.is_valid():
                serializer.save()
                tracker, _ = ProfileTracker.objects.get_or_create(user=user)
                tracker.educational_details_completed = True
                tracker.save()

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def education_detail_view(request, pk):
    try:
        user = request.user
        
        try:
            education = Education.objects.get(pk=pk, email=user)
        except Education.DoesNotExist:
            return Response({"error": "Education not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'PUT':
            data = request.data.copy()
            data['email'] = user.id
            
            serializer = EducationSerializer(education, data=data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                tracker, _ = ProfileTracker.objects.get_or_create(user=user)
                tracker.educational_details_completed = True
                tracker.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'DELETE':
            education.delete()
            tracker, _ = ProfileTracker.objects.get_or_create(user=user)
            tracker.educational_details_completed = False
            tracker.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def research_view(request):
    try:
        user = request.user
        
        if request.method == 'GET':
            # Return all research records for the user
            research_list = Research.objects.filter(email=user)
            if research_list.exists():
                serializer = ResearchSerializer(research_list, many=True)
                return Response(serializer.data)
            else:
                # Return empty array
                return Response([], status=status.HTTP_200_OK)
        
        elif request.method == 'POST':
            # Create new research record
            data = request.data.copy()
            data['email'] = user.id
            
            serializer = ResearchSerializer(data=data)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def research_detail_view(request, pk):
    try:
        user = request.user
        
        try:
            research = Research.objects.get(pk=pk, email=user)
        except Research.DoesNotExist:
            return Response({"error": "Research not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'PUT':
            data = request.data.copy()
            data['email'] = user.id
            
            serializer = ResearchSerializer(research, data=data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'DELETE':
            research.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def research_id_view(request):
    try:
        user = request.user
        
        if request.method == 'GET':
            # Return all research ID records for the user
            research_ids = Research_ID.objects.filter(email=user)
            if research_ids.exists():
                serializer = ResearchIDSerializer(research_ids, many=True)
                return Response(serializer.data)
            else:
                # Return empty array
                return Response([], status=status.HTTP_200_OK)
        
        elif request.method == 'POST':
            # Create new research ID record
            data = request.data.copy()
            data['email'] = user.id
            
            serializer = ResearchIDSerializer(data=data)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def research_id_detail_view(request, pk):
    try:
        user = request.user
        
        try:
            research_id = Research_ID.objects.get(pk=pk, email=user)
        except Research_ID.DoesNotExist:
            return Response({"error": "Research ID not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'PUT':
            data = request.data.copy()
            data['email'] = user.id
            
            serializer = ResearchIDSerializer(research_id, data=data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'DELETE':
            research_id.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def funding_view(request):
    try:
        user = request.user
        
        if request.method == 'GET':
            fundings = Funding.objects.filter(email=user)
            serializer = FundingSerializer(fundings, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        elif request.method == 'POST':
            data = request.data.copy()
            data['email'] = user.id
            
            serializer = FundingSerializer(data=data)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def funding_detail_view(request, pk):
    try:
        user = request.user
        
        try:
            funding = Funding.objects.get(pk=pk, email=user)
        except Funding.DoesNotExist:
            return Response({"error": "Funding not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'PUT':
            data = request.data.copy()
            data['email'] = user.id
            
            serializer = FundingSerializer(funding, data=data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'DELETE':
            funding.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def publication_view(request):
    try:
        user = request.user
        if request.method == 'GET':
            publications = Publication.objects.filter(email=user)
            serializer = PublicationSerializer(publications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            data = request.data.copy()
            data['email'] = user.id
            serializer = PublicationSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def publication_detail_view(request, pk):
    try:
        user = request.user
        try:
            publication = Publication.objects.get(pk=pk, email=user)
        except Publication.DoesNotExist:
            return Response({"error": "Publication not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'PUT':
            data = request.data.copy()
            data['email'] = user.id
            serializer = PublicationSerializer(publication, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            publication.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def administration_position_view(request):
    try:
        user = request.user
        if request.method == 'GET':
            positions = Administration_Position.objects.filter(email=user)
            serializer = AdministrationPositionSerializer(positions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            data = request.data.copy()
            data['email'] = user.id
            serializer = AdministrationPositionSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def administration_position_detail_view(request, pk):
    try:
        user = request.user
        try:
            position = Administration_Position.objects.get(pk=pk, email=user)
        except Administration_Position.DoesNotExist:
            return Response({"error": "Administrative Position not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'PUT':
            data = request.data.copy()
            data['email'] = user.id
            serializer = AdministrationPositionSerializer(position, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            position.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def honary_position_view(request):
    try:
        user = request.user
        if request.method == 'GET':
            honorary_positions = Honary_Position.objects.filter(email=user)
            serializer = HonaryPositionSerializer(honorary_positions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            data = request.data.copy()
            data['email'] = user.id
            serializer = HonaryPositionSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def honary_position_detail_view(request, pk):
    try:
        user = request.user
        try:
            honary = Honary_Position.objects.get(pk=pk, email=user)
        except Honary_Position.DoesNotExist:
            return Response({'error': 'Honorary position not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'PUT':
            data = request.data.copy()
            data['email'] = user.id
            serializer = HonaryPositionSerializer(honary, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            honary.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def conference_view(request):
    try:
        user = request.user
        if request.method == 'GET':
            conferences = Conferenece.objects.filter(email=user)
            serializer = ConfereneceSerializer(conferences, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            data = request.data.copy()
            data['email'] = user.id
            serializer = ConfereneceSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def conference_detail_view(request, pk):
    try:
        user = request.user
        try:
            conference = Conferenece.objects.get(pk=pk, email=user)
        except Conferenece.DoesNotExist:
            return Response({"error": "Conference not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'PUT':
            data = request.data.copy()
            data['email'] = user.id 
            serializer = ConfereneceSerializer(conference, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            conference.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    





# Endpoint only for PhD counts (produced and registered)
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def phd_counts_view(request):
    user = request.user

    if request.method == 'GET':
        produced = getattr(user, 'phd_scholars_produced', '')
        registered = getattr(user, 'phd_scholars_registered', '')
        return Response({
            'phd_scholars_produced': produced,
            'phd_scholars_registered': registered,
        }, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        data = request.data
        produced = data.get('phd_scholars_produced')
        registered = data.get('phd_scholars_registered')

        # Validate counts presence
        if produced is None or registered is None:
            return Response({"error": "Both scholars produced and registered counts are required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            produced_val = int(produced)
            registered_val = int(registered)
            if produced_val < 0 or registered_val < 0:
                return Response({"error": "Counts cannot be negative."}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Counts must be integers."}, status=status.HTTP_400_BAD_REQUEST)

        # Save counts on user (adjust if you store in profile or dedicated model)
        user.phd_scholars_produced = produced_val
        user.phd_scholars_registered = registered_val
        user.save()

        return Response({"detail": "Counts updated successfully."}, status=status.HTTP_200_OK)





@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def phd_view(request):
    user = request.user
    try:
        if request.method == 'GET':
            scholars = Phd.objects.filter(email=user)
            serializer = PhdSerializer(scholars, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            data = request.data.copy()
            data['email'] = user.id
            serializer = PhdSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def phd_detail_view(request, pk=None):
    user = request.user
    try:
        try:
            scholar = Phd.objects.get(pk=pk, email=user)
        except Phd.DoesNotExist:
            return Response({"error": "PhD scholar not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'PUT':
            data = request.data.copy()
            data['email'] = user.id
            serializer = PhdSerializer(scholar, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            scholar.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)







@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def resource_person_view(request):
    user = request.user
    if request.method == 'GET':
        resources = Resource_Person.objects.filter(email=user)
        serializer = ResourcePersonSerializer(resources, many=True)
        return Response(serializer.data, status=200)
    elif request.method == 'POST':
        data = request.data.copy()
        data['email'] = user.id
        serializer = ResourcePersonSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def resource_person_detail(request, pk):
    user = request.user
    try:
        resource = Resource_Person.objects.get(pk=pk, email=user)
    except Resource_Person.DoesNotExist:
        return Response({"error": "Resource person not found"}, status=404)

    if request.method == 'PUT':
        data = request.data.copy()
        data['email'] = user.id
        serializer = ResourcePersonSerializer(resource, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        resource.delete()
        return Response(status=204)
    





@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def collaboration_view(request):
    user = request.user
    if request.method == 'GET':
        collaborations = Collaboration.objects.filter(email=user)
        serializer = CollaborationSerializer(collaborations, many=True)
        return Response(serializer.data, status=200)
    elif request.method == 'POST':
        data = request.data.copy()
        data['email'] = user.id
        serializer = CollaborationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def collaboration_detail(request, pk):
    user = request.user
    try:
        collaboration = Collaboration.objects.get(pk=pk, email=user)
    except Collaboration.DoesNotExist:
        return Response({"error": "Collaboration not found"}, status=404)

    if request.method == 'PUT':
        data = request.data.copy()
        data['email'] = user.id
        serializer = CollaborationSerializer(collaboration, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        collaboration.delete()
        return Response(status=204)






@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def consultancy_view(request):
    user = request.user
    if request.method == 'GET':
        consultancies = Consultancy.objects.filter(email=user)
        serializer = ConsultancySerializer(consultancies, many=True)
        return Response(serializer.data, status=200)
    elif request.method == 'POST':
        data = request.data.copy()
        data['email'] = user.id
        serializer = ConsultancySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def consultancy_detail(request, pk):
    user = request.user
    try:
        consultancy = Consultancy.objects.get(pk=pk, email=user)
    except Consultancy.DoesNotExist:
        return Response({"error": "Consultancy not found"}, status=404)

    if request.method == 'PUT':
        data = request.data.copy()
        data['email'] = user.id
        serializer = ConsultancySerializer(consultancy, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        consultancy.delete()
        return Response(status=204)






@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def career_highlight_view(request):
    user = request.user
    if request.method == 'GET':
        highlights = Career_Highlight.objects.filter(email=user)
        serializer = CareerHighlightSerializer(highlights, many=True)
        return Response(serializer.data, status=200)
    elif request.method == 'POST':
        data = request.data.copy()
        data['email'] = user.id
        serializer = CareerHighlightSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            tracker, _ = ProfileTracker.objects.get_or_create(user=user)
            tracker.career_highlights_completed = True
            tracker.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def career_highlight_detail(request, pk):
    user = request.user
    try:
        highlight = Career_Highlight.objects.get(pk=pk, email=user)
    except Career_Highlight.DoesNotExist:
        return Response({"error": "Career highlight not found"}, status=404)

    if request.method == 'PUT':
        data = request.data.copy()
        data['email'] = user.id
        serializer = CareerHighlightSerializer(highlight, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            tracker, _ = ProfileTracker.objects.get_or_create(user=user)
            tracker.career_highlights_completed = True
            tracker.save()

            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        highlight.delete()
        tracker, _ = ProfileTracker.objects.get_or_create(user=user)
        tracker.career_highlights_completed = False
        tracker.save()
        return Response(status=204)







@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def research_career_view(request):
    user = request.user
    if request.method == 'GET':
        research_careers = Research_Career.objects.filter(email=user)
        serializer = ResearchCareerSerializer(research_careers, many=True)
        return Response(serializer.data, status=200)
    elif request.method == 'POST':
        data = request.data.copy()
        data['email'] = user.id
        serializer = ResearchCareerSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            tracker, _ = ProfileTracker.objects.get_or_create(user=user)
            tracker.research_career_completed = True
            tracker.save()

            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def research_career_detail(request, pk):
    user = request.user
    try:
        research_career = Research_Career.objects.get(pk=pk, email=user)
    except Research_Career.DoesNotExist:
        return Response({"error": "Research career not found"}, status=404)

    if request.method == 'PUT':
        data = request.data.copy()
        data['email'] = user.id
        serializer = ResearchCareerSerializer(research_career, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            tracker, _ = ProfileTracker.objects.get_or_create(user=user)
            tracker.research_career_completed = True
            tracker.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        research_career.delete()
        tracker, _ = ProfileTracker.objects.get_or_create(user=user)
        tracker.research_career_completed = False
        tracker.save()
        return Response(status=204)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_completion_status(request):
    user = request.user
    tracker, _ = ProfileTracker.objects.get_or_create(user=user)

    data = {
        "profile_details_completed": tracker.profile_details_completed,
        "educational_details_completed": tracker.educational_details_completed,
        "research_career_completed": tracker.research_career_completed,
        "career_highlights_completed": tracker.career_highlights_completed,
        "is_profile_complete": tracker.is_profile_complete,
    }

    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view_analytics(request):
    user = request.user
    now = timezone.now()

    # Total views
    total_views = ProfileViewLog.objects.filter(user=user).count()

    # Weekly
    one_week_ago = now - timedelta(days=7)
    weekly_views = ProfileViewLog.objects.filter(
        user=user,
        timestamp__gte=one_week_ago
    ).count()

    # Previous week
    prev_week = now - timedelta(days=14)
    prev_weekly_views = ProfileViewLog.objects.filter(
        user=user,
        timestamp__gte=prev_week,
        timestamp__lt=one_week_ago
    ).count()

    # Monthly
    one_month_ago = now - timedelta(days=30)
    monthly_views = ProfileViewLog.objects.filter(
        user=user,
        timestamp__gte=one_month_ago
    ).count()

    # Previous month
    prev_month = now - timedelta(days=60)
    prev_monthly_views = ProfileViewLog.objects.filter(
        user=user,
        timestamp__gte=prev_month,
        timestamp__lt=one_month_ago
    ).count()

    # Growth calculations
    weekly_growth = (
        ((weekly_views - prev_weekly_views) / prev_weekly_views) * 100
        if prev_weekly_views > 0 else 0
    )

    monthly_growth = (
        ((monthly_views - prev_monthly_views) / prev_monthly_views) * 100
        if prev_monthly_views > 0 else 0
    )

    return JsonResponse({
        "total": total_views,
        "weekly": weekly_views,
        "monthly": monthly_views,
        "weeklyGrowth": round(weekly_growth, 1),
        "monthlyGrowth": round(monthly_growth, 1)
    })



@require_http_methods(["GET"])
def public_profile_view(request, slug):
   
    try:
        # Find user by slug
        user = User.objects.get(slug=slug)
        
        # Check if profile is complete
        try:
            profile_tracker = ProfileTracker.objects.get(user=user)
            
            if not profile_tracker.is_profile_complete:
                return JsonResponse({
                    'error': 'Profile not available',
                    'message': 'This profile is not yet complete',
                    'is_complete': False
                }, status=404)
                
        except ProfileTracker.DoesNotExist:
            return JsonResponse({
                'error': 'Profile not available',
                'message': 'No Profile available for this user',
                'is_complete': False
            }, status=404)
        
        # ✅ Profile is complete - fetch all data


        
        # Staff Details
        staff_details = Staff_Details.objects.filter(email=user).first()
        
        if not staff_details:
            return JsonResponse({
                'error': 'Profile data incomplete',
                'message': 'Staff details not found'
            }, status=404)
        

        try:
            if profile_tracker.is_profile_complete:

                ip = get_client_ip(request)
                time_threshold = timezone.now() - timedelta(minutes=5)

                # Check if same IP has viewed this profile in last 5 minutes
                recent_view_exists = ProfileViewLog.objects.filter(
                    user=user,
                    ip_address=ip,
                    timestamp__gte=time_threshold
                ).exists()

                if not recent_view_exists:
                    # Save new view log
                    ProfileViewLog.objects.create(
                        user=user,
                        ip_address=ip
                    )

                    # Increment main view counter
                    profile_tracker.view_count += 1
                    profile_tracker.save()

        except Exception:
            pass


        # Build profile picture URL
        profile_pic_url = ''
        if staff_details.profile_picture:
            profile_pic_url = request.build_absolute_uri(staff_details.profile_picture.url)
        
        # Fetch all related data
        educations = list(Education.objects.filter(email=user).values(
            'id', 'degree', 'college', 'start_year', 'end_year'
        ))
        
        research_areas = list(Research.objects.filter(email=user).values(
            'id', 'research_areas'
        ))
        
        research_ids = list(Research_ID.objects.filter(email=user).values(
            'id', 'research_title', 'research_link'
        ))
        
        fundings = list(Funding.objects.filter(email=user).values(
            'id', 'project_title', 'funding_agency', 'funding_month_and_year',
            'funding_amount', 'funding_status'
        ))
        
        publications = list(Publication.objects.filter(email=user).values(
            'id', 'publication_title', 'publication_link', 'publication_type',
            'publication_month_and_year'
        ))
        
        admin_positions = list(Administration_Position.objects.filter(email=user).values(
            'id', 'administration_position', 'administration_year_from', 'administration_year_to'
        ))
        
        honorary_positions = list(Honary_Position.objects.filter(email=user).values(
            'id', 'honary_position', 'honary_year'
        ))
        
        conferences = list(Conferenece.objects.filter(email=user).values(
            'id', 'paper_title', 'conference_details', 'conference_type',
            'conference_isbn', 'conference_year'
        ))
        
        phd_supervisions = list(Phd.objects.filter(email=user).values(
            'id', 'phd_name', 'phd_topic', 'phd_status', 'phd_years_of_completion'
        ))
        
        resource_persons = list(Resource_Person.objects.filter(email=user).values(
            'id', 'resource_topic', 'resource_department', 'resource_date'
        ))
        
        collaborations = list(Collaboration.objects.filter(email=user).values(
            'id', 'collaboration_details'
        ))
        
        consultancies = list(Consultancy.objects.filter(email=user).values(
            'id', 'consultancy_details'
        ))
        
        career_highlights = list(Career_Highlight.objects.filter(email=user).values(
            'id', 'career_highlight_details'
        ))
        
        research_career = list(Research_Career.objects.filter(email=user).values(
            'id', 'research_career_details'
        ))
        
        # Build response
        response_data = {
            'basic_details': {
                'name': f"{staff_details.prefix} {staff_details.name}".strip(),
                'prefix': staff_details.prefix,
                'department': staff_details.department,
                'institution': staff_details.institution,
                'phone': staff_details.phone,
                'email': user.email,
                'address': staff_details.address,
                'website': staff_details.website or '',
                'profile_picture': profile_pic_url,
                'slug': user.slug
            },
            'educations': educations,
            'research_areas': research_areas,
            'research_ids': research_ids,
            'fundings': fundings,
            'publications': publications,
            'admin_positions': admin_positions,
            'honorary_positions': honorary_positions,
            'conferences': conferences,
            'phd_supervisions': phd_supervisions,
            'resource_persons': resource_persons,
            'collaborations': collaborations,
            'consultancies': consultancies,
            'career_highlights': career_highlights,
            'research_career': research_career,
            'profile_status': {
                'is_complete': True,
                'profile_details_completed': profile_tracker.profile_details_completed,
                'educational_details_completed': profile_tracker.educational_details_completed,
                'research_career_completed': profile_tracker.research_career_completed,
                'career_highlights_completed': profile_tracker.career_highlights_completed
            }
        }
        
        return JsonResponse(response_data, status=200)
        
    except User.DoesNotExist:
        return JsonResponse({
            'error': 'User not found',
            'message': 'No user exists with this profile URL'
        }, status=404)
    
    except Exception as e:
        return JsonResponse({
            'error': 'Server error',
            'message': str(e)
        }, status=500)
    



@api_view(['GET'])
@permission_classes([AllowAny])
def faculty_search(request):
    """
    Global search across all faculty-related models
    Query params:
    - q: search query string
    - department: filter by department
    """
    query = request.GET.get('q', '').strip()
    department_filter = request.GET.get('department', '').strip()
    
    if not query and not department_filter:
        return Response({'results': [], 'count': 0})
    
    # Get all staff
    staff_query = Staff_Details.objects.select_related('email').all()
    
    # Apply department filter
    if department_filter:
        staff_query = staff_query.filter(department=department_filter)
    
    results = []
    
    for staff in staff_query:
        match_found = False
        matched_fields = []
        
        if query:
            # Search in Staff_Details
            if (query.lower() in staff.name.lower() or
                query.lower() in staff.email.email.lower() or
                query.lower() in staff.department.lower() or
                query.lower() in staff.phone.lower() or
                (staff.address and query.lower() in staff.address.lower())):
                match_found = True
                matched_fields.append('Profile')
            
            # Search in Education
            education = Education.objects.filter(email=staff.email)
            for edu in education:
                if (query.lower() in edu.degree.lower() or
                    query.lower() in edu.college.lower()):
                    match_found = True
                    if 'Education' not in matched_fields:
                        matched_fields.append('Education')
                    break
            
            # Search in Research Areas
            research = Research.objects.filter(email=staff.email)
            for res in research:
                if query.lower() in res.research_areas.lower():
                    match_found = True
                    if 'Research Areas' not in matched_fields:
                        matched_fields.append('Research Areas')
                    break
            
            # Search in Research IDs/Titles
            research_ids = Research_ID.objects.filter(email=staff.email)
            for rid in research_ids:
                if query.lower() in rid.research_title.lower():
                    match_found = True
                    if 'Research Projects' not in matched_fields:
                        matched_fields.append('Research Projects')
                    break
            
            # Search in Funding
            funding = Funding.objects.filter(email=staff.email)
            for fund in funding:
                if (query.lower() in fund.project_title.lower() or
                    query.lower() in fund.funding_agency.lower()):
                    match_found = True
                    if 'Funding' not in matched_fields:
                        matched_fields.append('Funding')
                    break
            
            # Search in Publications
            publications = Publication.objects.filter(email=staff.email)
            for pub in publications:
                if (query.lower() in pub.publication_title.lower() or
                    query.lower() in pub.publication_type.lower()):
                    match_found = True
                    if 'Publications' not in matched_fields:
                        matched_fields.append('Publications')
                    break
            
            # Search in Administration Positions
            admin_positions = Administration_Position.objects.filter(email=staff.email)
            for admin in admin_positions:
                if query.lower() in admin.administration_position.lower():
                    match_found = True
                    if 'Administration' not in matched_fields:
                        matched_fields.append('Administration')
                    break
            
            # Search in Honorary Positions
            honary_positions = Honary_Position.objects.filter(email=staff.email)
            for hon in honary_positions:
                if query.lower() in hon.honary_position.lower():
                    match_found = True
                    if 'Honorary Positions' not in matched_fields:
                        matched_fields.append('Honorary Positions')
                    break
            
            # Search in Conferences
            conferences = Conferenece.objects.filter(email=staff.email)
            for conf in conferences:
                if (query.lower() in conf.paper_title.lower() or
                    query.lower() in conf.conference_details.lower() or
                    query.lower() in conf.conference_type.lower()):
                    match_found = True
                    if 'Conferences' not in matched_fields:
                        matched_fields.append('Conferences')
                    break
            
            # Search in PhD
            phds = Phd.objects.filter(email=staff.email)
            for phd in phds:
                if (query.lower() in phd.phd_name.lower() or
                    query.lower() in phd.phd_topic.lower()):
                    match_found = True
                    if 'PhD Supervision' not in matched_fields:
                        matched_fields.append('PhD Supervision')
                    break
            
            # Search in Resource Person
            resources = Resource_Person.objects.filter(email=staff.email)
            for res in resources:
                if (query.lower() in res.resource_topic.lower() or
                    query.lower() in res.resource_department.lower()):
                    match_found = True
                    if 'Resource Person' not in matched_fields:
                        matched_fields.append('Resource Person')
                    break
            
            # Search in Collaboration
            collaborations = Collaboration.objects.filter(email=staff.email)
            for collab in collaborations:
                if query.lower() in collab.collaboration_details.lower():
                    match_found = True
                    if 'Collaborations' not in matched_fields:
                        matched_fields.append('Collaborations')
                    break
            
            # Search in Consultancy
            consultancies = Consultancy.objects.filter(email=staff.email)
            for cons in consultancies:
                if query.lower() in cons.consultancy_details.lower():
                    match_found = True
                    if 'Consultancy' not in matched_fields:
                        matched_fields.append('Consultancy')
                    break
            
            # Search in Career Highlights
            career_highlights = Career_Highlight.objects.filter(email=staff.email)
            for ch in career_highlights:
                if query.lower() in ch.career_highlight_details.lower():
                    match_found = True
                    if 'Career Highlights' not in matched_fields:
                        matched_fields.append('Career Highlights')
                    break
            
            # Search in Research Career
            research_careers = Research_Career.objects.filter(email=staff.email)
            for rc in research_careers:
                if query.lower() in rc.research_career_details.lower():
                    match_found = True
                    if 'Research Career' not in matched_fields:
                        matched_fields.append('Research Career')
                    break
        else:
            # If only department filter, include all staff from that department
            match_found = True
        
        if match_found:
            # Get research areas for this staff - split by comma and clean
            research_areas = []
            research_objs = Research.objects.filter(email=staff.email)
            for res in research_objs:
                if res.research_areas:
                    # Split by comma and strip whitespace
                    areas = [area.strip() for area in res.research_areas.split(',') if area.strip()]
                    research_areas.extend(areas)
            
            # Remove duplicates while preserving order
            seen = set()
            unique_research_areas = []
            for area in research_areas:
                if area.lower() not in seen:
                    seen.add(area.lower())
                    unique_research_areas.append(area)
            
            profile_pic_url = None
            if staff.profile_picture:
                profile_pic_url = staff.profile_picture.url
            
            results.append({
                'id': staff.id,
                'slug': staff.email.slug if hasattr(staff.email, 'slug') else None,
                'name': staff.name,
                'prefix': staff.prefix,
                'department': staff.department,
                'email': staff.email.email,
                'phone': staff.phone,
                'website': staff.website,
                'institution': staff.institution,
                'profile_picture': profile_pic_url,
                'research_areas': unique_research_areas,
                'matched_fields': matched_fields if matched_fields else []
            })
    
    # Sort results by name
    results.sort(key=lambda x: x['name'])
    
    return Response({
        'results': results,
        'count': len(results)
    })


