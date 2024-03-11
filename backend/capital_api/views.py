from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from capital_api.models import Country
from capital_api.serializers import CountrySerializer

@api_view(['GET'])
def hello_world(request):
    countries = Country.objects.all()
    countries_serializer = CountrySerializer(countries,many=True)
    return Response({'message': 'Hello, world!','countries':countries_serializer.data})