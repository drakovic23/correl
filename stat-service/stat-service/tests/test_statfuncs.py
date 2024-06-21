import statfuncs
import pandas


def test_calc_chg():
    spx_data = statfuncs.get_all_ticker_data("^GSPC")
    assert spx_data is not None
    data = statfuncs.calc_chg(spx_data)
    assert data.loc['2022-02-14'].any()
    assert float(round(data.loc['2022-03-14']['Chg'], 2)) == -31.20
