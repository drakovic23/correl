using System;
using System.Collections.Generic;

namespace correl_backend.Models;

public partial class Histogram
{
    public int Id { get; set; }

    public int? TickerId { get; set; }

    public int? Counts { get; set; }

    public decimal? Bins { get; set; }

    public virtual Ticker? Ticker { get; set; }
}
