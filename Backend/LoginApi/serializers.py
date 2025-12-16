from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        # Check if email exists
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError("EMAIL_NOT_FOUND")

        # Try to authenticate
        user = authenticate(username=email, password=password)

        if user is None:
            raise serializers.ValidationError("INVALID_PASSWORD")

        # Call parent to get token
        data = super().validate(attrs)
        data['user'] = {
            "email": user.email,
            "role": user.role,
            'password_changed': self.user.password_changed,
        }
        return data