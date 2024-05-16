from datetime import datetime
import numpy as np
import pyodbc
import yfinance as yf
import pandas as pd
import matplotlib.pyplot as plt
import os

server = os.environ.get('correl_server')
database = 'correl'
username = os.environ.get('correl_un')
password = os.environ.get('correl_pw')
driver = '{ODBC Driver 17 for SQL Server}'

connectionString = ('DRIVER=' + driver + ';PORT=1433;SERVER=' + server + ';PORT=1443;DATABASE=' + database +
                    ';UID=' + username + ';PWD=' + password)

pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', None)


def get_indicator_data(indicator_id: int = 53):
    cnxn = pyodbc.connect(connectionString)
    cursor = cnxn.cursor()
    cursor.execute("SELECT Actual,ReleaseDate FROM INDICATOR_VALUES WHERE IndicatorId = ?", indicator_id)
    rows = cursor.fetchall()
    cnxn.close()
    actual_values = [float(row[0].replace('%', '')) / 100 if '%' in row[0] else float(row[0]) for row in rows]
    release_dates = [row[1] for row in rows]

    data = {
        'Date': release_dates,
        'Actual': actual_values
    }
    df = pd.DataFrame(data)
    return df


def get_all_ticker_data(ticker: str, frequency: str = "1d"):
    dash = yf.Ticker(ticker)
    return dash.history(period="max", interval=frequency)


def calc_chg(data: pd.DataFrame):
    data['Chg'] = data['Close'].diff()
    return data


# Expects monthly data
def calc_quarterly_returns(data: pd.DataFrame):
    data['Quarterly Chg'] = data['Close'].pct_change(periods=3)  # Quarterly return (assuming monthly data)
    return data


def calc_daily_returns(data: pd.DataFrame):
    data['Chg'] = data['Close'].pct_change()  # Quarterly return (assuming monthly data)
    return data


def analyze_ism_vs_sp500(month_lag: int = 6):
    # Get all ticker data
    sp500 = get_all_ticker_data('^GSPC', "1mo")
    sp500 = calc_quarterly_returns(sp500)

    # Get PMI data
    pmi_df = get_indicator_data(53)

    # Reset index and set the index as a column
    sp500.reset_index(inplace=True)
    sp500.rename(columns={'index': 'Date'}, inplace=True)

    # Convert the date columns to datetime format
    pmi_df['Date'] = pd.to_datetime(pmi_df['Date']).dt.tz_localize(None)
    sp500['Date'] = pd.to_datetime(sp500['Date']).dt.tz_localize(None)

    # Lag the sp500 Date column by 6 months
    sp500['Date'] = sp500['Date'] - pd.DateOffset(months=month_lag)

    # Handle the date differences in case one set has more historical data than the other
    min_date = pmi_df['Date'].min()
    max_date = pmi_df['Date'].max()
    sp500 = sp500[(sp500['Date'] >= min_date) & (sp500['Date'] <= max_date)]

    # Can probably remove this
    sp500.sort_values(by='Date', inplace=True)
    pmi_df.sort_values(by='Date', inplace=True)

    # align on dates within the specified interval
    merged_df = pd.merge_asof(sp500, pmi_df, on='Date', tolerance=pd.Timedelta(days=5), direction='nearest')
    merged_df.dropna(subset=['Quarterly Chg'], inplace=True)

    conditions_met = merged_df[((merged_df['Actual'] >= 50) & (merged_df['Quarterly Chg'] > 0)) |
                               ((merged_df['Actual'] < 50) & (merged_df['Quarterly Chg'] < 0))]

    conditions_not_met = merged_df[((merged_df['Actual'] >= 50) & (merged_df['Quarterly Chg'] <= 0)) |
                                   ((merged_df['Actual'] < 50) & (merged_df['Quarterly Chg'] >= 0))]

    # Calculate the number of times conditions are met
    conditions_met_count = len(conditions_met)
    conditions_not_met_count = len(conditions_not_met)

    # Calculate the percentage of times conditions are met
    total_conditions = conditions_met_count + conditions_not_met_count
    if total_conditions > 0:
        percentage_met = (conditions_met_count / total_conditions) * 100
    else:
        percentage_met = 0

    # Print results
    print(f"Conditions met: {conditions_met_count} times")
    print(f"Conditions not met: {conditions_not_met_count} times")
    print(f"Percentage of times conditions are met: {percentage_met:.2f}%")
    return percentage_met
    # merged_df.to_csv('merged_df_analysis.csv')


#lag_var is used to indicate whether or not to lag the given var or sp500
def calc_var_sp_correlation(var: pd.DataFrame, month_lag: int = 6, lag_var: bool = False):
    # Get all ticker data
    sp500 = get_all_ticker_data('^GSPC', "1mo")
    sp500 = calc_quarterly_returns(sp500)

    # Reset index and set the index as a column
    sp500.reset_index(inplace=True)
    sp500.rename(columns={'index': 'Date'}, inplace=True)

    # Convert the date columns to datetime format
    var['Date'] = pd.to_datetime(var['Date']).dt.tz_localize(None)
    sp500['Date'] = pd.to_datetime(sp500['Date']).dt.tz_localize(None)

    # Lag
    if lag_var == False:
        sp500['Date'] = sp500['Date'] - pd.DateOffset(months=month_lag)
    else:
        var['Date'] = var['Date'] - pd.DateOffset(months=month_lag)
    # print(sp500['Date'])

    # Handle the date differences in case one set has more historical data than the other
    min_date = var['Date'].min()
    max_date = var['Date'].max()
    sp500 = sp500[(sp500['Date'] >= min_date) & (sp500['Date'] <= max_date)]

    # Probably remove
    sp500.sort_values(by='Date', inplace=True)
    var.sort_values(by='Date', inplace=True)

    merged_df = pd.merge_asof(sp500, var, on='Date', tolerance=pd.Timedelta(days=5), direction='nearest')
    merged_df.dropna(subset=['Quarterly Chg'], inplace=True)

    corr = merged_df['Actual'].corr(merged_df['Quarterly Chg'])

    # Save and print the result
    # merged_df.to_csv('merged_df.csv')
    print(f'Correlation between given var and SP500 returns: {corr} with total month lag of: {month_lag}')
    return corr


def calc_histogram_values(data, is_daily: bool = True):
    if is_daily:
        data = calc_daily_returns(data)
        data.dropna(subset=['Chg'], inplace=True)
    else:
        data = calc_quarterly_returns(data)
        data.dropna(subset=['Quarterly Chg'], inplace=True)

    bin_vals = [-0.025, -0.02, -0.015, -0.01, -0.005, 0, 0.005, 0.01, 0.015, 0.02, 0.025]
    histogram_count, histogram_bins = np.histogram(data['Chg'] if is_daily else data['Quarterly Chg'], bins=bin_vals)

    data.reset_index(inplace=True)
    data.rename(columns={'index': 'Date'}, inplace=True)
    min_date = data['Date'].min()
    ret_obj = {
        'Counts': histogram_count,
        'Bins': histogram_bins,
        'MinDate': min_date
    }

    return ret_obj


def calc_descriptive_stats(data: pd.DataFrame, is_daily: bool = True):
    if is_daily:
        data = calc_daily_returns(data)
        data.dropna(subset=['Chg'], inplace=True)
    else:
        data = calc_quarterly_returns(data)
        data.dropna(subset=['Quarterly Chg'], inplace=True)

    return data['Chg'].describe() if is_daily else data['Quarterly Chg'].describe()


# We need to create the necessary tables
def insert_general_stats():
    sp500 = get_all_ticker_data('^GSPC')
    sp500_descriptive = calc_descriptive_stats(sp500)
    sp500_daily_hist = calc_histogram_values(sp500)
    pmi_sp500_rolling0 = calc_var_sp_correlation(get_indicator_data(53), 0)  # 0 Month sp500 lag
    pmi_sp500_rolling3 = calc_var_sp_correlation(get_indicator_data(53), 3)  # 3m
    pmi_sp500_rolling6 = calc_var_sp_correlation(get_indicator_data(53), 6)  # 6m..
    pmi_sp500_rolling9 = calc_var_sp_correlation(get_indicator_data(53), 9)
    pmi_sp500_rolling12 = calc_var_sp_correlation(get_indicator_data(53), 12)
    # Do the same for gdp->sp500 correlation
    gdp_sp500_rolling0 = calc_var_sp_correlation(get_indicator_data(61), 0, True)
    gdp_sp500_rolling3 = calc_var_sp_correlation(get_indicator_data(61), 3, True)
    gdp_sp500_rolling6 = calc_var_sp_correlation(get_indicator_data(61), 6, True)
    gdp_sp500_rolling9 = calc_var_sp_correlation(get_indicator_data(61), 9, True)
    gdp_sp500_rolling12 = calc_var_sp_correlation(get_indicator_data(61), 12, True)
    print(sp500_descriptive) # How do we access this
    # Insert the data
    # Calculate the histogram values for common indicies or shares
    # Get and insert PMI -> S&P corr
    # Get and insert S&P -> GDP corr


