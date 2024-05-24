using System;
using System.Collections.Generic;

namespace correl_backend.Models;

public partial class BondType
{
    public int Id { get; set; }

    public int? Country { get; set; }

    public string BondName { get; set; } = null!;

    public virtual ICollection<BondRate> BondRates { get; set; } = new List<BondRate>();

    public virtual Country? CountryNavigation { get; set; }
}
