from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated

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
    ProfileTracker
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