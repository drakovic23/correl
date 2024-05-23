using System;
using System.Collections.Generic;

namespace correl_backend.Models;

public partial class DescriptiveStat
{
    public int Id { get; set; }

    public int? TickerId { get; set; }

    public int? Count { get; set; }

    public decimal? Mean { get; set; }

    public decimal? Std { get; set; }

    public decimal? Min { get; set; }

    public decimal? Max { get; set; }

    public decimal? Quartile1 { get; set; }

    public decimal? Quartile2 { get; set; }

    public decimal? Quartile3 { get; set; }

    public virtual Ticker? Ticker { get; set; }
}
