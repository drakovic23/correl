namespace correl_backend.API;

public class ExternalApiService
{
    private readonly HttpClient _httpClient;

    public ExternalApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.Timeout = TimeSpan.FromSeconds(120);
    }

    public async Task<HttpResponseMessage> GetExternalApiStatusAsync(string url)
    {
        var response = await _httpClient.GetAsync(url);
        return response;
    }
}