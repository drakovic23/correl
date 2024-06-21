# This grabs data from the fed, specifically bonds right now
import datetime
from fredapi import Fred
import pyodbc
import os

fred = Fred(api_key='')

# Holds corresponding ID to series name as defined on the FRED
bond_id_to_series = {
    1: 'DGS30',
    2: 'DGS20',
    3: 'DGS10',
    4: 'DGS5',
    5: 'DGS3',
    6: 'DGS2',
    7: 'DGS1',
    8: 'DGS6MO',
    9: 'DGS3MO'
}


def get_connection():
    server = os.environ.get('correl_server')
    database = 'correl'
    username = os.environ.get('correl_un')
    password = os.environ.get('correl_pw')
    driver = '{ODBC Driver 17 for SQL Server}'

    connectionString = ('DRIVER=' + driver + ';PORT=1433;SERVER=' + server + ';PORT=1443;DATABASE=' + database +
                        ';UID=' + username + ';PWD=' + password)
    return pyodbc.connect(connectionString)


# Inserts ALL bond data for specified series and specified bond id in bond_types table
def insert_bond_data(series, bond_id):
    data = fred.get_series(series)
    cnxn = get_connection()
    cursor = cnxn.cursor()

    for index, value in data.items():
        value = str(value)
        if value != "nan":
            value = float(value)
            cursor.execute("INSERT INTO BOND_RATES(TypeId, BondYield, ConstantDate) values (?,?,?)", bond_id, value,
                           index)
            cnxn.commit()

    cnxn.close()


def insert_initial_data():  # For our initial inserts incase we need to rebuild the db/bond tables
    insert_bond_data("DGS3MO", 9)
    insert_bond_data("DGS6MO", 8)
    insert_bond_data("DGS1", 7)
    insert_bond_data("DGS2", 6)
    insert_bond_data("DGS3", 5)
    insert_bond_data("DGS5", 4)
    insert_bond_data("DGS10", 3)
    insert_bond_data("DGS20", 2)
    insert_bond_data("DGS30", 1)


def insert_ice_corporate_bonds(bond_id):  # Not used yet
    data = fred.get_series("BAMLC0A0CMEY")
    cnxn = get_connection()
    cursor = cnxn.cursor()

    for index, value in data.items():
        value = str(value)
        if value != "nan":
            value = float(value)
            cursor.execute("INSERT INTO BOND_RATES(TypeId, BondYield, ConstantDate) values (?,?,?)", bond_id, value,
                           index)
            cnxn.commit()

    cnxn.close()


# Gets the most recent date of the 10-year in our db, used to insert latest bond dates
# Since the rates are released at the same day for each series we can just get the most recent date of any bond
def get_most_recent_bond_date():
    cnxn = get_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT MAX(ConstantDate) FROM BOND_RATES WHERE TypeId = 1")
    rows = cursor.fetchone()
    cnxn.close()
    if rows != None:
        return rows[0]
    else:
        return -1


def insert_latest_bond_data(date_since: datetime = get_most_recent_bond_date()):  # TODO: Needs to be scheduled
    date_day_added = date_since + datetime.timedelta(days=1)  # Add one day since get_series returns data where >= date

    for i in bond_id_to_series:
        data = fred.get_series(bond_id_to_series[i], observation_start=date_day_added)
        cnxn = get_connection()
        cursor = cnxn.cursor()
        for index, value in data.items():
            value = str(value)
            if value != "nan":
                value = float(value)
                cursor.execute("INSERT INTO BOND_RATES(TypeId, BondYield, ConstantDate) values (?,?,?)", i, value,
                               index)
                cnxn.commit()
        cnxn.close()
