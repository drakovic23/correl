using System;
using System.Collections.Generic;

namespace correl_backend.Models;

public partial class IndicatorValue
{
    public int Id { get; set; }

    public int IndicatorId { get; set; }

    public string? Actual { get; set; }

    public DateOnly ReleaseDate { get; set; }

    public virtual Indicator Indicator { get; set; } = null!;
}
