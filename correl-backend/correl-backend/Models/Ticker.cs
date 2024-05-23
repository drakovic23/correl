using System;
using System.Collections.Generic;

namespace correl_backend.Models;

public partial class Ticker
{
    public int Id { get; set; }

    public string? Ticker1 { get; set; }

    public virtual ICollection<DescriptiveStat> DescriptiveStats { get; set; } = new List<DescriptiveStat>();

    public virtual ICollection<GeneralStat> GeneralStats { get; set; } = new List<GeneralStat>();

    public virtual ICollection<Histogram> Histograms { get; set; } = new List<Histogram>();
}
