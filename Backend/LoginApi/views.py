from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class MyTokenView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_password(request):
    new_password = request.data.get('password')
    if not new_password:
        return Response({'error': 'Password required'}, status=400)
    user = request.user
    user.set_password(new_password)
    user.password_changed = True
    user.save()
    return Response({'message': 'Password updated successfully'})
