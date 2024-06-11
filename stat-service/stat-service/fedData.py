# This grabs data from the fed, specifically bonds right now
from fredapi import Fred
import pyodbc
import os

# https://www.forexfactory.com/calendar?month=Jan1.2023

server = os.environ.get('correl_server')
database = 'correl'
username = os.environ.get('correl_un')
password = os.environ.get('correl_pw')
driver = '{ODBC Driver 17 for SQL Server}'
connectionString = ('DRIVER=' + driver + ';PORT=1433;SERVER=' + server + ';PORT=1443;DATABASE=' + database +
                    ';UID=' + username + ';PWD=' + password)

fred = Fred(api_key='')


# Inserts ALL bond data for specified series and specified bond id in bond_types table
def insertBondData(series,bond_id):
    # Get 10 Yr Bond data
    data = fred.get_series(series)
    cnxn = pyodbc.connect(connectionString)
    cursor = cnxn.cursor()
    # print(ten_year.index)
    for index, value in data.items():
        value = str(value)
        if value != "nan":
            value = float(value)
            # print(value)
            # # Do the insert
            cursor.execute("INSERT INTO BOND_RATES(TypeId, BondYield, ConstantDate) values (?,?,?)", bond_id, value, index)
            # # commit the transaction
            cnxn.commit()

    cnxn.close()


def insertIceCorporateBonds():
    # Get 10 Yr Bond data
    data = fred.get_series("BAMLC0A0CMEY")
    cnxn = pyodbc.connect(
        'DRIVER=' + driver + ';PORT=1433;SERVER=' + server + ';PORT=1443;DATABASE=' + database + ';UID=' + username + ';PWD=' + password)
    cursor = cnxn.cursor()
    # print(ten_year.index)
    for index, value in data.items():
        value = str(value)
        if value != "nan":
            value = float(value)
            # print(value)
            # # Do the insert
            cursor.execute("INSERT INTO BOND_RATES(TypeId, BondYield, ConstantDate) values (?,?,?)", bond_id, value, index)
            # # commit the transaction
            cnxn.commit()

    cnxn.close()


# insertBondData("DGS3MO", 9)
# insertBondData("DGS6MO", 8)
# insertBondData("DGS1", 7)
# insertBondData("DGS2", 6)
# insertBondData("DGS3", 5)
# insertBondData("DGS5", 4)
# insertBondData("DGS10", 3)
# insertBondData("DGS20", 2)
# insertBondData("DGS30", 1)

# ID     Maturity
# 1      30-year
# 2      20-year
# 3      10-year
# 4      5-year
# 5      3-year
# 6      2-year
# 7      1-year
# 8      6-month
# 9      3-month
# 2023-11-22
