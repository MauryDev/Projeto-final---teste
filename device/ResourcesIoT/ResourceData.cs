using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IoT.ResourcesIoT;

internal record ResourceData(string resourceId, object state, DateTime timestamp);
