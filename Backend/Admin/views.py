from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Count, Sum, Q
from django.contrib.auth import get_user_model
from UserDetails.models import (
    Staff_Details, Education, Research, Research_ID, 
    Funding, Publication, Administration_Position, 
    Honary_Position, Conferenece, Phd, Resource_Person,
    Collaboration, Consultancy, Career_Highlight, Research_Career,ProfileTracker
)
from datetime import datetime
from django.http import JsonResponse
from django.utils import timezone
from datetime import timedelta

from django.db.models import Count
from UserDetails.models import ProfileViewLog  


User = get_user_model()



class ManageUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request): 
        """Get all users"""
        users = User.objects.all().order_by('id')

        users_data = []
        for user in users:
            users_data.append({
                'id': user.id,
                'email': user.email,
                'passwordChanged': user.password_changed,
                'role': user.role,
                'lastLogin': user.last_login.strftime('%Y-%m-%d %H:%M:%S') if user.last_login else 'Never'
            })

        return Response(users_data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create multiple users"""
        emails_text = request.data.get('emails', '')
        role = request.data.get('role', 'Staff')

        if not emails_text:
            return Response(
                {'error': 'Please provide emails'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Split emails by newline
        emails = [email.strip() for email in emails_text.split('\n') if email.strip()]

        if not emails:
            return Response(
                {'error': 'Please enter at least one valid email address'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate emails
        invalid_emails = []
        valid_emails = []

        for email in emails:
            if not email.endswith('@mcc.edu.in') or email.count('@') != 1:
                invalid_emails.append(email)
            else:
                valid_emails.append(email)

        if invalid_emails:
            return Response(
                {'error': f"Invalid emails: {', '.join(invalid_emails)}. All emails must end with @mcc.edu.in"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # CHECK FOR EXISTING USERS (BLOCK EVERYTHING IF ANY EXISTS)
        existing_users = list(
            User.objects.filter(email__in=valid_emails)
            .values_list('email', flat=True)
        )

        if existing_users:
            return Response(
                {'error': f"These emails already exist: {', '.join(existing_users)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create users (safe now)
        created_users = []
        default_password = "Mcc@admin@321" if role == "Admin" else "Mcc@123"

        for email in valid_emails:
            user = User.objects.create_user(
                email=email,
                password=default_password,
                role=role,
                password_changed=False
            )

            created_users.append({
                'id': user.id,
                'email': user.email,
                'passwordChanged': user.password_changed,
                'role': user.role,
                'lastLogin': 'Never'
            })

        return Response(
            {
                'message': f'Successfully added {len(created_users)} user(s)',
                'created_users': created_users
            },
            status=status.HTTP_201_CREATED
        )


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, user_id):
        """Delete a user"""
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response(
                {'message': 'User deleted successfully'},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        





class PhdScholarsCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        staff_list = Staff_Details.objects.all()
        result = []

        for idx, staff in enumerate(staff_list, start=1):

            phd_qs = Phd.objects.filter(email=staff.email)

            produced_count = phd_qs.filter(phd_status='Completed').count()
            registered_count = phd_qs.exclude(phd_status='Completed').count()

            if registered_count == 0 and produced_count == 0:
                continue

            result.append({
                'id': idx,   # NOW AUTO INCREMENTS ✔
                "slug": staff.email.slug,
                'staffName': f"{staff.prefix} {staff.name}",
                'department': staff.department,
                'phdScholarsRegistered': registered_count,
                'phdScholarsProduced': produced_count
            })

        return Response(result, status=status.HTTP_200_OK)




class PhdScholarsDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        phd_entries = Phd.objects.select_related('email')

        result = []

        for idx, phd in enumerate(phd_entries, start=1):

            # FIX: staff email is a FK to User
            staff_details = Staff_Details.objects.filter(
                email__email__iexact=phd.email.email  # User.email compared to User.email
            ).first()

            if staff_details:
                staff_name = f"{staff_details.prefix} {staff_details.name}"
                department = staff_details.department
                slug = phd.email.slug  
            else:
                staff_name = phd.email.email
                department = "N/A"

            result.append({
                'id': idx,
                'slug': slug,
                'staffName': staff_name,
                'department': department,
                'scholarName': phd.phd_name,
                'topic': phd.phd_topic,
                'status': phd.phd_status,
                'yearOfCompletion': 
                    phd.phd_years_of_completion 
               
            })

        return Response(result, status=status.HTTP_200_OK)




class PhdSummaryView(APIView):
    """
    Get summary statistics for PhD scholars
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        total_registered = Phd.objects.count()
        total_produced = Phd.objects.filter(phd_status='Completed').count()
        
        return Response({
            'totalRegistered': total_registered,
            'totalProduced': total_produced
        }, status=status.HTTP_200_OK)


class FundingDetailsView(APIView):
    """
    Get all funding details with staff information
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get all funding entries with related staff details
        funding_entries = Funding.objects.select_related('email').prefetch_related('email__Details').all()

        
        result = []
        for idx, funding in enumerate(funding_entries, start=1):
            try:
                staff_details = funding.email.Details.first()  # Get first related Staff_Details
                staff_name = f"{staff_details.prefix} {staff_details.name}" if staff_details else funding.email.email
            except:
                staff_name = funding.email.email
            
            result.append({
                'id': idx,
                'slug': funding.email.slug,
                'staffName': staff_name,
                'projectTitle': funding.project_title,
                'fundingAgency': funding.funding_agency,
                'fundingMonthAndYear': funding.funding_month_and_year,
                'fundingAmount': float(funding.funding_amount),
                'fundingStatus': funding.funding_status
            })
        
        return Response(result, status=status.HTTP_200_OK)

class PublicationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch all publications
        publications = Publication.objects.select_related('email').all()

        # Build response data
        data = []
        for pub in publications:
            # Try to get staff name from Staff_Details
            try:
                staff_detail = Staff_Details.objects.get(email=pub.email)
                staff_name = staff_detail.name
            except Staff_Details.DoesNotExist:
                staff_name = pub.email.email  # fallback to email if no staff detail

            data.append({
                "id": pub.id,
                "slug": pub.email.slug,
                "name": staff_name,
                "publicationTitle": pub.publication_title,
                "publicationLink": pub.publication_link,
                "publicationType": pub.publication_type,
                "publicationMonthAndYear": pub.publication_month_and_year
            })

        return Response(data)
    

class ResearchIDListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        research_ids = Research_ID.objects.select_related('email').all()

        data = []

        for idx, rid in enumerate(research_ids, start=1):
            staff = Staff_Details.objects.filter(email=rid.email).first()
            name = staff.name if staff else rid.email.email

            data.append({
                "id": idx,                           
                "slug": rid.email.slug ,        
                "name": name,
                "researchTitle": rid.research_title,
                "researchLink": rid.research_link
            })

        return Response(data, status=200)



class ResearchAreasListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Distinct user IDs used in Research table
            staff_emails = Research.objects.values_list("email", flat=True).distinct()

            response_data = []

            for idx, email_id in enumerate(staff_emails, start=1):
                entries = Research.objects.filter(email_id=email_id).select_related("email")

                if not entries.exists():
                    continue

                user = entries.first().email  # User object

                # Get staff name if exists
                staff = Staff_Details.objects.filter(email=user).first()
                name = staff.name if staff else user.email

                # Combine research areas
                combined_areas = ", ".join(e.research_areas for e in entries)

                response_data.append({
                    "id": idx,                     
                    "slug": user.slug ,       
                    "name": name,
                    "researchAreas": combined_areas
                })

            return Response(response_data, status=200)

        except Exception as e:
            print("Error:", e)
            return Response({"message": "Error fetching data"}, status=500)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    Get dashboard statistics based on department filter
    Query param: department (optional) - e.g., 'Overall', 'English - Aided', etc.
    """
    department = request.GET.get('department', 'Overall')
    
    # Filter users by department if not Overall
    if department == 'Overall':
        users = User.objects.all()
    else:
        users = User.objects.filter(Details__department=department)
    
    user_emails = users.values_list('id', flat=True)
    
    # Get counts for each category
    stats = {
        'researchAreas': Research.objects.filter(email_id__in=user_emails).count(),
        'researchIDs': Research_ID.objects.filter(email_id__in=user_emails).count(),
        'publications': Publication.objects.filter(email_id__in=user_emails).count(),
        'fundings': Funding.objects.filter(email_id__in=user_emails).count(),
        'conferences': Conferenece.objects.filter(email_id__in=user_emails).count(),
        'phdSupervisions': Phd.objects.filter(email_id__in=user_emails).count(),
        'adminPositions': Administration_Position.objects.filter(email_id__in=user_emails).count(),
        'honoraryPositions': Honary_Position.objects.filter(email_id__in=user_emails).count(),
        'resourcePerson': Resource_Person.objects.filter(email_id__in=user_emails).count(),
        'collaborations': Collaboration.objects.filter(email_id__in=user_emails).count(),
        'consultancies': Consultancy.objects.filter(email_id__in=user_emails).count(),
    }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def publications_yearly_trend(request):
    """
    Get publications trend for last 5 years
    Query param: department (optional)
    """
    department = request.GET.get('department', 'Overall')
    current_year = datetime.now().year
    start_year = current_year - 4  # Last 5 years
    
    # Filter users by department
    if department == 'Overall':
        users = User.objects.all()
    else:
        users = User.objects.filter(Details__department=department)
    
    user_emails = users.values_list('id', flat=True)
    
    # Get publications grouped by year
    yearly_data = []
    for year in range(start_year, current_year + 1):
        year_str = str(year)
        count = Publication.objects.filter(
            email_id__in=user_emails,
            publication_month_and_year__icontains=year_str
        ).count()
        yearly_data.append({'year': year_str, 'count': count})
    
    return Response(yearly_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def research_distribution(request):
    """
    Get research activities distribution
    Query param: department (optional)
    """
    department = request.GET.get('department', 'Overall')
    
    # Filter users by department
    if department == 'Overall':
        users = User.objects.all()
    else:
        users = User.objects.filter(Details__department=department)
    
    user_emails = users.values_list('id', flat=True)
    
    distribution = [
        {
            'label': 'Publications',
            'value': Publication.objects.filter(email_id__in=user_emails).count()
        },
        {
            'label': 'Conferences',
            'value': Conferenece.objects.filter(email_id__in=user_emails).count()
        },
        {
            'label': 'Collaborations',
            'value': Collaboration.objects.filter(email_id__in=user_emails).count()
        },
        {
            'label': 'Consultancies',
            'value': Consultancy.objects.filter(email_id__in=user_emails).count()
        },
    ]
    
    return Response(distribution)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def funding_yearly_trend(request):
    """
    Get funding trend for last 5 years
    Query param: department (optional)
    """
    department = request.GET.get('department', 'Overall')
    current_year = datetime.now().year
    start_year = current_year - 4  # Last 5 years
    
    # Filter users by department
    if department == 'Overall':
        users = User.objects.all()
    else:
        users = User.objects.filter(Details__department=department)
    
    user_emails = users.values_list('id', flat=True)
    
    # Get funding grouped by year
    yearly_data = []
    for year in range(start_year, current_year + 1):
        year_str = str(year)
        total_amount = Funding.objects.filter(
            email_id__in=user_emails,
            funding_month_and_year__icontains=year_str
        ).aggregate(total=Sum('funding_amount'))['total'] or 0
        
        yearly_data.append({
            'year': year_str,
            'amount': float(total_amount)
        })
    
    return Response(yearly_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def phd_supervision_status(request):
    """
    Get PhD supervision status (Ongoing vs Completed)
    Query param: department (optional)
    """
    department = request.GET.get('department', 'Overall')
    
    # Filter users by department
    if department == 'Overall':
        users = User.objects.all()
    else:
        users = User.objects.filter(Details__department=department)
    
    user_emails = users.values_list('id', flat=True)
    
    # Count by status
    ongoing_count = Phd.objects.filter(
        email_id__in=user_emails,
        phd_status__iexact='Ongoing'
    ).count()
    
    completed_count = Phd.objects.filter(
        email_id__in=user_emails,
        phd_status__iexact='Completed'
    ).count()
    
    status_data = [
        {'category': 'Ongoing', 'count': ongoing_count},
        {'category': 'Completed', 'count': completed_count},
    ]
    
    return Response(status_data)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_profile_views_analytics(request):
    """
    Get top 5 staff members with highest profile views for different time periods
    """
    now = timezone.now()
    
    # Time periods
    one_day_ago = now - timedelta(days=1)
    one_week_ago = now - timedelta(days=7)
    one_month_ago = now - timedelta(days=30)
    
    # Helper function to get top 5 users by view count
    def get_top_users(time_filter=None):
        queryset = ProfileViewLog.objects.all()
        
        if time_filter:
            queryset = queryset.filter(timestamp__gte=time_filter)
        
        # Group by user and count views
        top_users = queryset.values('user').annotate(
            view_count=Count('id')
        ).order_by('-view_count')[:5]
        
        # Get user details
        result = []
        for idx, item in enumerate(top_users, start=1):
            try:
                user = User.objects.select_related('profile_tracker').get(id=item['user'])
                
                # Get staff details
                try:
                    staff_details = Staff_Details.objects.get(email=user)
                    staff_name = f"{staff_details.prefix} {staff_details.name}".strip()
                    department = staff_details.department
                except Staff_Details.DoesNotExist:
                    staff_name = user.email
                    department = 'N/A'
                
                result.append({
                    'rank': idx,
                    'staffName': staff_name,
                    'department': department,
                    'views': item['view_count'],
                    'slug': user.slug if user.slug else ''
                })
            except User.DoesNotExist:
                continue
            except Exception as e:
                print(f"Error processing user {item['user']}: {e}")
                continue
        
        return result
    
    # Get data for different time periods
    daily_top_views = get_top_users(one_day_ago)
    weekly_top_views = get_top_users(one_week_ago)
    monthly_top_views = get_top_users(one_month_ago)
    overall_top_views = get_top_users()
    
    return JsonResponse({
        'daily': daily_top_views,
        'weekly': weekly_top_views,
        'monthly': monthly_top_views,
        'overall': overall_top_views
    })



class ResetUserPasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, user_id):
        """Reset user password to default"""
        try:
            user = User.objects.get(id=user_id)
            
            # Don't allow resetting admin password
            if user.role == 'Admin':
                return Response(
                    {'error': 'Cannot reset admin password'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Only reset if password was changed before
            if not user.password_changed:
                return Response(
                    {'error': 'Password has not been changed yet'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Reset to default password
            default_password = "Mcc@123"
            user.set_password(default_password)
            user.password_changed = False
            user.save()
            
            return Response(
                {'message': 'Password reset successfully'},
                status=status.HTTP_200_OK
            )
            
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_data(request):
    """
    Fetch all user data based on selected fields
    Expected payload: {"fields": ["Basic Details", "Education", "Funding", ...]}
    Returns JSON with all users and their related data
    Only exports users with completed profiles
    """
    try:
        selected_fields = request.data.get('fields', [])
        
        if not selected_fields:
            return Response(
                {"error": "No fields selected for export"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get only users with completed profiles
        completed_profile_trackers = ProfileTracker.objects.filter(
            profile_details_completed=True,
            educational_details_completed=True,
            research_career_completed=True,
            career_highlights_completed=True
        ).values_list('user_id', flat=True)
        
        users = User.objects.filter(id__in=completed_profile_trackers).order_by('email')
        
        export_data = []
        
        for user in users:
            user_data = {
                'email': user.email,
            }
            
            # Fetch data based on selected fields
            if 'Basic Details' in selected_fields:
                try:
                    staff_detail = Staff_Details.objects.filter(email=user).first()
                    if staff_detail:
                        user_data['basic_details'] = {
                            'prefix': staff_detail.prefix,
                            'name': staff_detail.name,
                            'department': staff_detail.department,
                            'institution': staff_detail.institution,
                            'phone': staff_detail.phone,
                            'address': staff_detail.address,
                            'website': staff_detail.website or '',
                        }
                    else:
                        user_data['basic_details'] = None
                except:
                    user_data['basic_details'] = None
            
            if 'Education' in selected_fields:
                education_list = Education.objects.filter(email=user).values(
                    'degree', 'college', 'start_year', 'end_year'
                )
                user_data['education'] = list(education_list)
            
            if 'Research Career' in selected_fields:
                research_career_list = Research_Career.objects.filter(email=user).values(
                    'research_career_details'
                )
                user_data['research_career'] = list(research_career_list)
            
            if 'Career Highlights' in selected_fields:
                career_highlights_list = Career_Highlight.objects.filter(email=user).values(
                    'career_highlight_details'
                )
                user_data['career_highlights'] = list(career_highlights_list)
            
            if 'Research Areas' in selected_fields:
                research_areas_list = Research.objects.filter(email=user).values(
                    'research_areas'
                )
                user_data['research_areas'] = list(research_areas_list)
            
            if 'Research ID' in selected_fields:
                research_id_list = Research_ID.objects.filter(email=user).values(
                    'research_title', 'research_link'
                )
                user_data['research_ids'] = list(research_id_list)
            
            if 'Funding' in selected_fields:
                funding_list = Funding.objects.filter(email=user).values(
                    'project_title', 'funding_agency', 'funding_month_and_year', 
                    'funding_amount', 'funding_status'
                )
                user_data['funding'] = list(funding_list)
            
            if 'Publications' in selected_fields:
                publications_list = Publication.objects.filter(email=user).values(
                    'publication_title', 'publication_link', 'publication_type', 
                    'publication_month_and_year'
                )
                user_data['publications'] = list(publications_list)
            
            if 'Administrative Positions' in selected_fields:
                admin_positions_list = Administration_Position.objects.filter(email=user).values(
                    'administration_position', 'administration_year_from', 'administration_year_to'
                )
                user_data['administrative_positions'] = list(admin_positions_list)
            
            if 'Honorary Positions' in selected_fields:
                honorary_positions_list = Honary_Position.objects.filter(email=user).values(
                    'honary_position', 'honary_year'
                )
                user_data['honorary_positions'] = list(honorary_positions_list)
            
            if 'Conference Details' in selected_fields:
                conference_list = Conferenece.objects.filter(email=user).values(
                    'paper_title', 'conference_details', 'conference_type', 
                    'conference_isbn', 'conference_year'
                )
                user_data['conferences'] = list(conference_list)
            
            if 'PhD Supervision' in selected_fields:
                phd_list = Phd.objects.filter(email=user).values(
                    'phd_name', 'phd_topic', 'phd_status', 'phd_years_of_completion'
                )
                user_data['phd_supervision'] = list(phd_list)
            
            if 'Resource Person Details' in selected_fields:
                resource_person_list = Resource_Person.objects.filter(email=user).values(
                    'resource_topic', 'resource_department', 'resource_date'
                )
                user_data['resource_person'] = list(resource_person_list)
            
            if 'Areas of Consultancy' in selected_fields:
                consultancy_list = Consultancy.objects.filter(email=user).values(
                    'consultancy_details'
                )
                user_data['consultancy'] = list(consultancy_list)
            
            if 'Areas of Collaboration' in selected_fields:
                collaboration_list = Collaboration.objects.filter(email=user).values(
                    'collaboration_details'
                )
                user_data['collaboration'] = list(collaboration_list)
            
            export_data.append(user_data)
        
        return Response({
            'success': True,
            'data': export_data,
            'total_users': len(export_data),
            'selected_fields': selected_fields
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )