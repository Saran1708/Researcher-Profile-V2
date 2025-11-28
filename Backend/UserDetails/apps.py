from django.apps import AppConfig
from django.db.utils import OperationalError, ProgrammingError, IntegrityError


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'UserDetails'

    def ready(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()

        try:
            user, created = User.objects.get_or_create(
                email="admin@mcc.edu.in",
                defaults={
                    "role": "Admin",
                    "is_staff": True,
                    "is_active": True,
                }
            )

            if created:
                user.set_password("Mcc@admin@321")
                user.save()
                print("✔ Default MCC Admin created")
            else:
                print("Default MCC Admin already exists")

        except (OperationalError, ProgrammingError, IntegrityError):
            pass
