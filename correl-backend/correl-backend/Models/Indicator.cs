using System;
using System.Collections.Generic;

namespace correl_backend.Models;

public partial class Indicator
{
    public int Id { get; set; }

    public string EventName { get; set; } = null!;

    public int? Country { get; set; }

    public virtual Country? CountryNavigation { get; set; }

    public virtual ICollection<IndicatorValue> IndicatorValues { get; set; } = new List<IndicatorValue>();
}
