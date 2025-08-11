from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


# User Table

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        # No superuser logic needed — just staff
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    password_changed = models.BooleanField(default=False)
    role = models.CharField(max_length=1000)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # For admin access

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email
    

# Staff Details Table

class Staff_Details(models.Model):
    email =  models.ForeignKey(User,on_delete=models.CASCADE,related_name="Details")
    prefix = models.CharField(max_length=50)
    name = models.CharField(max_length=1000)
    department = models.CharField(max_length=1000)
    department_order = models.IntegerField()
    institution = models.CharField(max_length=1000,default="Madras Christian College")
    phone = models.CharField(max_length=1000)
    address = models.CharField(max_length=1000)
    website = models.URLField(max_length=1000,null=True)
    profile_picture = models.ImageField(upload_to="profile_pics/")

    def __str__(self):
        return self.name
    

# Education Table

class Education(models.Model):
    email = models.ForeignKey(User,on_delete=models.CASCADE,related_name="Education")
    degree = models.CharField(max_length=1000)
    college = models.CharField(max_length=1000)
    start_year = models.CharField(max_length=1000)
    end_year = models.CharField(max_length=1000)


# Research Table

class Research(models.Model):
    email = models.ForeignKey(User,on_delete=models.CASCADE,related_name="Research")
    research_areas = models.CharField(max_length=1000)


# Research_ID Table

class Research_ID(models.Model):
    email = models.ForeignKey(User,on_delete=models.CASCADE,related_name="Research_ID")
    research_title = models.CharField(max_length=1000)
    research_link = models.URLField(max_length=1000,null=True)


# Funding Table

class Funding(models.Model):
    email = models.ForeignKey(User,on_delete=models.CASCADE,related_name="Funding")
    project_title = models.CharField(max_length=1000)
    funding_agency = models.CharField(max_length=1000)
    funding_month_and_year = models.CharField(max_length=1000)
    funding_amount = models.DecimalField(max_digits=10,decimal_places=2)
    funding_status = models.CharField(max_length=1000)


# Publication Table

class Publication(models.Model):
    email = models.ForeignKey(User,on_delete=models.CASCADE,related_name="Publication")
    publication_title = models.CharField(max_length=1000)
    publication_link = models.URLField(max_length=1000)
    publication_type = models.CharField(max_length=1000)
    publication_month_and_year = models.CharField(max_length=1000)


# Administration_Position Table

class Administration_Position(models.Model):
    email = models.ForeignKey(User,on_delete=models.CASCADE,related_name="Administration_Position")
    administration_position = models.CharField(max_length=1000)
    administration_year_from = models.CharField(max_length=1000)
    administration_year_to = models.CharField(max_length=1000)
    

# Honary_Position Table

class Honary_Position(models.Model):
    email = models.ForeignKey(User,on_delete=models.CASCADE,related_name="Honary_Position")
    honary_position = models.CharField(max_length=1000)
    honary_year = models.CharField(max_length=1000)


# Conferenece Table

class Conferenece(models.Model):
    email = models.ForeignKey(User,on_delete=models.CASCADE,related_name="Conferenece")
    paper_title = models.CharField(max_length=1000)
    conference_details = models.CharField(max_length=1000)
    conference_type = models.CharField(max_length=1000)
    conference_isbn = models.CharField(max_length=1000)
    conference_year =  models.CharField(max_length=1000)


# Phd Table

class Phd(models.Model):
    email = models.ForeignKey(User,on_delete=models.CASCADE,related_name="Phd")
    phd_name = models.CharField(max_length=1000)
    phd_topic = models.CharField(max_length=1000)
    phd_status = models.CharField(max_length=1000)
    phd_years_of_completion = models.CharField(max_length=1000)


# Resource_Person Table

class Resource_Person(models.Model):
    email=models.ForeignKey(User,on_delete=models.CASCADE,related_name="Resource_Person")
    resource_topic = models.CharField(max_length=1000)
    resource_department = models.CharField(max_length=1000)
    resource_date = models.CharField(max_length=1000)


# Collaboration Table

class Collaboration (models.Model):
    email=models.ForeignKey(User,on_delete=models.CASCADE,related_name="Collaboration")
    collaboration_details = models.CharField(max_length=1000)


# Consultancy Table

class Consultancy (models.Model):
    email=models.ForeignKey(User,on_delete=models.CASCADE,related_name="Consultancy")
    consultancy_details = models.CharField(max_length=1000)


# Career_Highlight Table

class Career_Highlight (models.Model):
    email=models.ForeignKey(User,on_delete=models.CASCADE,related_name="Career_Highlight")
    career_highlight_details = models.CharField(max_length=1000)


# Research_Career Table

class Research_Career (models.Model):
    email=models.ForeignKey(User,on_delete=models.CASCADE,related_name="Research_Career")
    research_career_details = models.CharField(max_length=1000)