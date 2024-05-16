# Pulls data from ForexFactory
# 23Drcset -- sql
import datetime
import time
import cloudscraper
from bs4 import BeautifulSoup
import pyodbc
import os
# https://www.forexfactory.com/calendar?month=Jan1.2023
server = os.environ.get('correl_server')
database = 'correl'
username = os.environ.get('correl_un')
password = os.environ.get('correl_pw')
driver = '{ODBC Driver 17 for SQL Server}'

monthDict = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
}

event_array = []


class Indicator:
    def __init__(self, date, actual, name, currency):
        self.date = date
        self.actual = actual
        self.name = name
        self.currency = currency

    def print(self):
        print(self.date + " " + self.actual + " " + self.name + " " + self.currency)


def convertDate(date):
    # Year,month,day
    # d = datetime.datetime(2020, 12, 17)
    ret = str(monthDict[date.month] + str(date.day) + "." + str(date.year))
    return ret


def getAllData():
    year = 2024
    ret = []
    while year >= 2007:
        ret.append(getYearlyData(year))
        year -= 1

    return ret


def getYearlyData(year):
    month = 12
    yearly_data = []
    # If current year = year then set month to current month
    current_date = datetime.date.today()
    if year == current_date.year:
        month = current_date.month

    while month > 0:
        date = datetime.datetime(year, month, 1)
        str = convertDate(date)
        time.sleep(1)  # To prevent potentially getting blocked
        yearly_data.append(getMonthlyData(str))
        month -= 1

    return yearly_data


def getMonthlyData(d):
    unique_event_names = set()
    scraper = cloudscraper.create_scraper(delay=10, browser="chrome")
    url = "https://www.forexfactory.com/calendar?month=" + d
    html = scraper.get(url).text

    soup = BeautifulSoup(html, 'html.parser')
    year = d.split(".", 1)

    # date = soup.find_all("span", {"class": "date"})

    date = None
    rows = soup.find_all("tr", {"class": "calendar__row--grey"})
    ret_array = []
    for row in rows:

        if row.find("span", {"class": "date"}) is not None:
            # date = row.find("span", {"class" : "date"}).text
            date = row.find_next("span", {"class": "date"}).findNext().text  # Need to add year here
            date += " " + year[1]
            print(date)
        actual_num = row.find("td", {"class": "calendar__actual"}).text.strip()
        event_title = row.find("span", {"class": "calendar__event-title"}).text.strip()
        currency_code = row.find("td", {"class": "calendar__currency"}).text.strip()
        # event = Indicator()
        if event_title != "Bank Holiday" and currency_code == "USD" and actual_num != "" and actual_num != " ":
            event = Indicator(date, actual_num, event_title, currency_code)
            # event.print() # We push to DB here
            ret_array.append(event)

    return ret_array


# This gets unique event names using a single year
def getUniqueEventNames():
    data = getAllData()  # Should use a complete but recent year
    unique_names = set()
    ret = set()
    for yearly_data in data:
        for monthly_data in yearly_data:
            for indicator in monthly_data:
                if indicator.name not in unique_names:
                    unique_names.add(indicator.name)
                    new_event = Indicator(None, None, indicator.name, indicator.currency)
                    ret.add(new_event)
    return ret
    # We add unique names to DB here


# Uses getUniqueEventNames to insert unique names
def insertUniqueNames(unique_names):
    cnxn = pyodbc.connect(
        'DRIVER=' + driver + ';PORT=1433;SERVER=' + server + ';PORT=1443;DATABASE=' + database + ';UID=' + username + ';PWD=' + password)
    cursor = cnxn.cursor()
    for i in unique_names:
        # Do the insert
        cursor.execute("INSERT INTO INDICATORS(EventName, Country) values (?,1)", i.name)
        # commit the transaction
        cnxn.commit()

def insertValues(data): #Call with GetAllData() as the data
    cnxn = pyodbc.connect(
        'DRIVER=' + driver + ';PORT=1433;SERVER=' + server + ';PORT=1443;DATABASE=' + database + ';UID=' + username + ';PWD=' + password)
    cursor = cnxn.cursor()
    for yearly_data in data:
        for monthly_data in yearly_data:
            for indicator in monthly_data:
                cursor.execute("SELECT ID FROM INDICATORS WHERE EventName =" + "\'" + indicator.name + "\'")
                id = cursor.fetchone()
                if not id:
                    print("Error: no id for event name: " + indicator.name)
                cursor.execute("INSERT INTO INDICATOR_VALUES(IndicatorID,Actual,ReleaseDate) values(?,?,?)", id[0], indicator.actual,
                               indicator.date)
                cnxn.commit()

# insertUniqueNames(getUniqueEventNames())
insertValues(getAllData())

