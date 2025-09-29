// See https://aka.ms/new-console-template for more information
using IoT;
using IoT.Http;
using IoT.ResourcesIoT;

ProjectConfig.Init("config.yml");
var resources = new List<IResource>();
var client = new Client();

var timer = new PeriodicTimer(TimeSpan.FromSeconds(1));
while (await timer.WaitForNextTickAsync())
{
    foreach (var item in resources)
    {
        await client.SendIot(item);
    }
}
