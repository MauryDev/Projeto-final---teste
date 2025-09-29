using IoT.ResourcesIoT;
using System.Net.Http.Json;

namespace IoT.Http;

internal class Client
{
    private readonly HttpClient _httpClient;
    public Client()
    {
        _httpClient = new();
        _httpClient.BaseAddress = new Uri(ProjectConfig.GetValue("uri-server")!);
        _httpClient.DefaultRequestHeaders.Authorization = new("Bearer", ProjectConfig.GetValue("auth-value"));

    }
    public async Task SendIot(IResource sensor)
    {
        ResourceData resourceData = new(sensor.ResourceId, sensor.Value, DateTime.UtcNow);
        var jsonResource = JsonContent.Create(resourceData);
        var data = await _httpClient.PutAsJsonAsync("api/sensor", jsonResource);
        if (data.IsSuccessStatusCode)
        {
            var dataJson = await data.Content.ReadFromJsonAsync<ResponseSuccess>();
            sensor.Value = dataJson;
        }
    }
   
}
