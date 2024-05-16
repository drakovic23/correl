using System;
using System.Collections.Generic;

namespace correl_backend.Models;

public partial class BondRate
{
    public int Id { get; set; }

    public int? TypeId { get; set; }
    
    public decimal? BondYield { get; set; }

    public DateOnly ConstantDate { get; set; }

    public virtual BondType? Type { get; set; }
}
