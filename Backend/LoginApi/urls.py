from django.urls import path
from .views import MyTokenView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import reset_password

urlpatterns = [
    path('api/token/', MyTokenView.as_view(), name='custom_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/reset-password/', reset_password, name='reset_password'),

]
