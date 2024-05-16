using System;
using System.Collections.Generic;

namespace correl_backend.Models;

public partial class Country
{
    public int Id { get; set; }

    public string? Currency { get; set; }

    public string? CountryCode { get; set; }

    public string? CountryString { get; set; }

    public virtual ICollection<BondType> BondTypes { get; set; } = new List<BondType>();

    public virtual ICollection<Indicator> Indicators { get; set; } = new List<Indicator>();
}
