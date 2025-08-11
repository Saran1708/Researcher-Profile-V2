from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(username=email, password=password)

        if user is None:
            raise serializers.ValidationError({"detail": "Invalid credentials"})

        # Call parent to get token
        data = super().validate(attrs)
        data['user'] = {
            "email": user.email,
            "role": user.role,
            'password_changed': self.user.password_changed,
        }
        return data