import json

def test_descriptive_valid(test_client):
    symbol = "TSLA"
    response = test_client.get('/stats/descriptive/' + symbol)
    assert response.status_code == 200
    data = response.get_json()
    assert 'count' in data
    assert 'mean' in data
    assert 'std' in data
    assert 'min' in data
    assert 'max' in data
    assert 'Quartile1' in data
    assert 'Quartile2' in data
    assert 'Quartile3' in data


def test_descriptive_invalid_symbol(test_client):
    symbol = "notarealsymbol"
    response = test_client.get('/stats/descriptive/' + symbol)
    assert response.status_code == 400


def test_general_stats_calc_valid(test_client):
    symbol = "^GSPC"
    response = test_client.get('/stats/general/' + symbol)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data is not None
    assert 'initialGeneralStats' in data
    assert 'initialHistogram' in data
    assert 'initialDescriptive' in data
    assert data['initialGeneralStats'] is not None
    assert data['initialHistogram'] is not None
    assert data['initialDescriptive'] is not None
    print(data['initialGeneralStats'])
    print(data['initialHistogram'])
    print(data['initialDescriptive'])


def test_general_stats_calc_invalid(test_client):
    symbol = "notavalidsymbol"
    response = test_client.get('/stats/general/' + symbol)
    assert response.status_code == 400
