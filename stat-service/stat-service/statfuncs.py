import numpy as np
import pyodbc
import yfinance as yf
import pandas as pd
import os
import generalStatModel
import json


# pd.set_option('display.max_columns', None)
# pd.set_option('display.max_rows', None)


def get_connection():
    server = os.environ.get('correl_server')
    database = 'correl'
    username = os.environ.get('correl_un')
    password = os.environ.get('correl_pw')
    driver = '{ODBC Driver 17 for SQL Server}'

    connectionString = ('DRIVER=' + driver + ';PORT=1433;SERVER=' + server + ';PORT=1443;DATABASE=' + database +
                        ';UID=' + username + ';PWD=' + password)
    return pyodbc.connect(connectionString)


def get_indicator_data(indicator_id: int = 53):
    cnxn = get_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT Actual,ReleaseDate FROM INDICATOR_VALUES WHERE IndicatorId = ?", indicator_id)
    rows = cursor.fetchall()
    cnxn.close()
    actual_values = [float(row[0].replace('%', '')) / 100 if '%' in row[0] else float(row[0]) for row in rows]
    release_dates = [row[1] for row in rows]  # Adjust later so both lists are returned instead of an object

    data = {
        'Date': release_dates,
        'Actual': actual_values
    }
    df = pd.DataFrame(data)
    return df


def get_all_ticker_data(ticker: str, frequency: str = "1d"):
    dash = yf.Ticker(ticker)
    data = dash.history(period="max", interval=frequency)
    data.drop(data[data.Close <= 0].index, inplace=True)
    if len(data) > 0:
        return data
    else:
        raise Exception("Symbol not found")


def calc_chg(data: pd.DataFrame):
    data['Chg'] = data['Close'].diff()
    return data


# Expects monthly data
def calc_quarterly_returns(data: pd.DataFrame):
    data['Quarterly Chg'] = data['Close'].pct_change(periods=3)  # Quarterly return (assuming monthly data)
    return data


def calc_daily_returns(data: pd.DataFrame):
    data['Chg'] = data['Close'].pct_change()  # Daily return
    return data


# Experimental quad analysis, not used
def quad_ism_vs_sp500(month_lag: int = 6):
    sp500 = get_all_ticker_data('^GSPC', "1mo")
    sp500 = calc_quarterly_returns(sp500)

    pmi_df = get_indicator_data(53)

    # Reset index and set the index as a column
    sp500.reset_index(inplace=True)
    sp500.rename(columns={'index': 'Date'}, inplace=True)

    pmi_df['Date'] = pd.to_datetime(pmi_df['Date']).dt.tz_localize(None)
    sp500['Date'] = pd.to_datetime(sp500['Date']).dt.tz_localize(None)

    # lag
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

    total_conditions = conditions_met_count + conditions_not_met_count
    if total_conditions > 0:
        percentage_met = (conditions_met_count / total_conditions) * 100
    else:
        percentage_met = 0

    print(f"Conditions met: {conditions_met_count} times")
    print(f"Conditions not met: {conditions_not_met_count} times")
    print(f"Percentage of times conditions are met: {percentage_met:.2f}%")
    return percentage_met
    # merged_df.to_csv('merged_df_analysis.csv')


# This is experimental, not used
def calc_var_sp_correlation(var: pd.DataFrame, month_lag: int = 6, lag_var: bool = False, var_y: pd.DataFrame =
get_all_ticker_data("^GSPC", "1mo")):
    # Get all ticker data
    var_y_cp = var_y.copy()
    var_y_cp = calc_quarterly_returns(var_y_cp)
    var_x = var.copy()
    # Reset index and set the index as a column
    var_y_cp.reset_index(inplace=True)
    var_y_cp.rename(columns={'index': 'Date'}, inplace=True)

    # Convert the date columns to datetime format
    var_x['Date'] = pd.to_datetime(var_x['Date']).dt.tz_localize(None)
    var_y_cp['Date'] = pd.to_datetime(var_y_cp['Date']).dt.tz_localize(None)

    # Lag either our var_x or our var_y
    if not lag_var:
        var_y_cp['Date'] = var_y_cp['Date'] - pd.DateOffset(months=month_lag)
    else:
        var_x['Date'] = var_x['Date'] - pd.DateOffset(months=month_lag)
    # print(sp500['Date'])

    # Handle the date differences in case one set has more historical data than the other
    min_date = var_x['Date'].min()
    max_date = var_x['Date'].max()
    var_y_cp = var_y_cp[(var_y_cp['Date'] >= min_date) & (var_y_cp['Date'] <= max_date)]

    var_y_cp.sort_values(by='Date', inplace=True)
    var_x.sort_values(by='Date', inplace=True)

    merged_df = pd.merge_asof(var_y_cp, var_x, on='Date', tolerance=pd.Timedelta(days=5), direction='nearest')
    merged_df.dropna(subset=['Quarterly Chg'], inplace=True)

    corr = merged_df['Actual'].corr(merged_df['Quarterly Chg'])

    # Save and print the result
    # merged_df.to_csv('merged_df.csv')
    # print(f'Correlation between given var_x and var_y returns: {corr} with total month lag of: {month_lag})
    return corr


# Calculates histogram points/counts for common bins used for daily returns
def calc_histogram_values(data, is_daily: bool = True):
    if is_daily:
        data = calc_daily_returns(data)
        data.dropna(subset=['Chg'], inplace=True)
    else:
        data = calc_quarterly_returns(data)
        data.dropna(subset=['Quarterly Chg'], inplace=True)

    bin_vals = [-float('inf'), -0.02, -0.015, -0.01, -0.005, 0, 0.005, 0.01, 0.015, 0.02, float('inf')]
    histogram_count, histogram_bins = np.histogram(data['Chg'] if is_daily else data['Quarterly Chg'], bins=bin_vals)

    # data.reset_index(inplace=True)
    # data.rename(columns={'index': 'Date'}, inplace=True)
    # min_date = data['Date'].min()
    hist_values = np.array([histogram_count, histogram_bins[:-1]]).T
    return hist_values


# For basic descriptive stats
def calc_descriptive_stats(data: pd.DataFrame, is_daily: bool = True):
    if is_daily:
        data = calc_daily_returns(data)
        data.dropna(subset=['Chg'], inplace=True)
    else:
        data = calc_quarterly_returns(data)
        data.dropna(subset=['Quarterly Chg'], inplace=True)

    return data['Chg'].describe() if is_daily else data['Quarterly Chg'].describe()


# Returns -1 if the ticker is not found/does not exist
def get_ticker_id(ticker: str) -> int:
    cnxn = get_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT ID,TICKER FROM TICKERS WHERE Ticker = ?", ticker)
    rows = cursor.fetchone()
    cnxn.close()
    if rows != None:
        return rows[0]
    else:
        return -1


# Can adjust the deletes to updates for performance later
def insert_general_stats():
    cnxn = get_connection()
    cursor = cnxn.cursor()

    sp500_daily = get_all_ticker_data('^GSPC')
    sp500_descriptive = calc_descriptive_stats(sp500_daily)
    sp500_daily_hist = calc_histogram_values(sp500_daily)
    ticker_id = get_ticker_id("^GSPC")
    if ticker_id == -1:  # If the ticker doesn't exist we need to insert
        cursor.execute("INSERT INTO TICKERS VALUES(?)", "^GSPC")
        ticker_id = get_ticker_id("^GSPC")

    # Insert descriptive stats
    cursor.execute("DELETE FROM DESCRIPTIVE_STATS WHERE TickerId = ?", ticker_id)
    cursor.execute("INSERT INTO DESCRIPTIVE_STATS VALUES(?,?,?,?,?,?,?,?,?)", ticker_id,
                   sp500_descriptive['count'], sp500_descriptive['mean'], sp500_descriptive['std'],
                   sp500_descriptive['min'], sp500_descriptive['max'], sp500_descriptive['25%'],
                   sp500_descriptive['50%'], sp500_descriptive['75%'])
    # Insert histogram data
    cursor.execute("DELETE FROM HISTOGRAM WHERE TickerId = ?", ticker_id)
    # cursor.commit()
    for i in sp500_daily_hist:
        cursor.execute("INSERT INTO HISTOGRAM VALUES(?,?,?)", ticker_id, i[0],
                       None if i[1] == float('inf') or i[1] == -float('inf') else i[1])

    pmi = get_indicator_data(53)
    sp500_monthly = get_all_ticker_data("^GSPC", "1mo")

    # Insert the correlation data
    cursor.execute("DELETE FROM GENERAL_STATS WHERE TickerId = ? AND IndicatorId = ?", ticker_id, 53)
    for i in range(0, 13, 3):
        pmi_sp500_corr = calc_var_sp_correlation(var=pmi, month_lag=i, var_y=sp500_monthly)
        cursor.execute("INSERT INTO GENERAL_STATS VALUES(?,?,?,?,?)", ticker_id, 53,
                       "ISM PMI SPX Correlation", pmi_sp500_corr, i)

    cursor.execute("DELETE FROM GENERAL_STATS WHERE TickerId = ? AND IndicatorId = ?", ticker_id, 61)
    gdp = get_indicator_data(61)

    # Final q/q GDP is lagged here instead of the var_y(the spx)
    for i in range(0, 13, 3):
        gdp_sp500_corr = calc_var_sp_correlation(gdp, i, True, var_y=sp500_monthly)
        cursor.execute("INSERT INTO GENERAL_STATS VALUES(?,?,?,?,?)", ticker_id, 61,
                       "GDP SPX Correlation", gdp_sp500_corr, i)

    # Insert ATR data
    cursor.commit()
    cnxn.close()


# Calculates the average true range of a OHLC dataset
def calc_atr(data: pd.DataFrame, n: int = 5):
    previous_close = data['Close'].shift(1)
    tr1 = data['High'] - data['Low']
    tr2 = (data['High'] - previous_close).abs()
    tr3 = (data['Low'] - previous_close).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    atr = tr.rolling(window=n, min_periods=1).mean()
    atr_pct = (atr / data['Close']) * 100
    data['ATR'] = atr
    data['ATR Pct'] = atr_pct
    return data


# Calculates the true range of a OHLC dataset
def calc_tr(data: pd.DataFrame):
    previous_close = data['Close'].shift(1)
    tr1 = data['High'] - data['Low']
    tr2 = (data['High'] - previous_close).abs()
    tr3 = (data['Low'] - previous_close).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    return tr


def calc_atr_specified(data: pd.DataFrame, n: int = 20):
    if len(data) < n:
        raise ValueError("Not enough rows to calculate ATR for the last {} days.".format(n))
    # slice to include only the last n days
    recent_data = data.copy()
    recent_data = recent_data.iloc[-n:]
    # Get TR
    recent_data['TR'] = calc_tr(recent_data)

    recent_data['ATR'] = recent_data['TR'].rolling(window=n, min_periods=1).mean()
    recent_data['ATR Pct'] = (recent_data['ATR'] / recent_data['Close']) * 100

    last_atr_pct = recent_data['ATR Pct'].iloc[-1]
    return last_atr_pct


# To calculate the ATR for our general rolling values
def calc_general_atr(data: pd.DataFrame):
    rolling_20d = calc_atr_specified(data, 20)
    rolling_60d = calc_atr_specified(data, 60)
    rolling_120d = calc_atr_specified(data, 120)
    rolling_240d = calc_atr_specified(data, 240)
    ret_obj = [
        [20, rolling_20d],
        [60, rolling_60d],
        [120, rolling_120d],
        [240, rolling_240d],
    ]

    return ret_obj

def get_general_stats(ticker):
    try:
        ticker_daily = get_all_ticker_data(ticker)
    except Exception as e:
        raise e

    ticker_daily_descriptive = calc_descriptive_stats(ticker_daily)
    descriptive = generalStatModel.DescriptiveStats(ticker_daily_descriptive['count'], ticker_daily_descriptive['mean'],
                                                    ticker_daily_descriptive['std'], ticker_daily_descriptive['min'],
                                                    ticker_daily_descriptive['max'], ticker_daily_descriptive['25%'],
                                                    ticker_daily_descriptive['50%'], ticker_daily_descriptive['75%'])

    ticker_daily_histo = calc_histogram_values(ticker_daily)
    histogram = list()
    for i in ticker_daily_histo:
        histogram.append(generalStatModel.HistogramPoint(
            i[0], None if i[1] == float('inf') or i[1] == -float('inf') else i[1]))

    ticker_atr = calc_general_atr(ticker_daily)
    atr_vals = list()
    for i in ticker_atr:
        atr_vals.append(generalStatModel.GeneralStat(str(i[0]) + " Day Rolling ATR", round(i[1], 2), i[0]))

    ret = generalStatModel.GeneralStats(atr_vals, histogram, descriptive)

    return json.dumps(ret, default=lambda o: o.encode())
