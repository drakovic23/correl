using System;
using System.Collections.Generic;

namespace correl_backend.Models;

public partial class GeneralStat
{
    public int Id { get; set; }

    public int? TickerId { get; set; }

    public int? IndicatorId { get; set; }

    public string Name { get; set; } = null!;

    public decimal Value { get; set; }

    public string? RollingDuration { get; set; }

    public virtual Indicator? Indicator { get; set; }

    public virtual Ticker? Ticker { get; set; }
}
