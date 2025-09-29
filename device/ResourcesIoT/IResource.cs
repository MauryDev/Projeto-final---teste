using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IoT.ResourcesIoT;

internal interface IResource
{
    object Value { get; set; }
    string ResourceId { get; }

}
