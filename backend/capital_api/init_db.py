import pandas as pd
from models import Country

europe = pd.read_csv('europe.csv',sep=',')

countries = [
    Country(
        name = europe.ix[row]['Country'],
        capital = europe.ix[row]['Capital']
    )
    for row in len(europe)
]

print(countries)