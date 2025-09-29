using IoT.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IoT.ResourcesIoT;

internal class SensorCarro : IResource
{
    internal record SensorData(bool isAlive, bool isReserved);
    public string ResourceId { get; set; }
    object IResource.Value
    {
        get => Value;
        set
        {
            var value_ = (ResponseSuccess)value;
            Value = Value with { isReserved = (bool)value_.value };
        }
    }
    SensorData Value { get; set; }
    public ResourceData GetData()
    {
        
        return new(ResourceId, Value, DateTime.UtcNow);
    }

    
}
