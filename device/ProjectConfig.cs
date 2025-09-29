using SharpYaml.Serialization;


namespace IoT
{
    internal class ProjectConfig
    {
        public static Dictionary<string,string> projectConfig = new();
        public static string? GetValue(string key)
        {
            if (projectConfig.TryGetValue(key, out var value))
            {
                return value;
            }
            return null;
        }

        public static void Init(string file)
        {
            using var fileStream = new FileStream(file, FileMode.Open);

            var serializer = new Serializer();
            projectConfig = serializer.Deserialize<Dictionary<string, string>>(fileStream);
            
        }

    }
}
