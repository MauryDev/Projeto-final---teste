using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IoT.ResourcesIoT;

internal interface ISensor
{
    ResourceData GetData();
    void OnCommand(Commands command);
    string resourceId { get; }
    void UpdateTimeOut();
}
