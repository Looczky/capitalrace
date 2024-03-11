import pandas as pd
import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from capital_api.models import Country

europe = pd.read_csv('europe.csv',sep=',')

countries = [
    Country(
        name = europe['Country'][row],
        capital = europe['Capital'][row]
    )
    for row in range(len(europe))
]

Country.objects.bulk_create(countries)

print(Country.objects.all())