using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IoT.ResourcesIoT;

internal record ResourceData(int resourceId, Status state, DateTime timestamp);
