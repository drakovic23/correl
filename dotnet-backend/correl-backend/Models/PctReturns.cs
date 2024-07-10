namespace correl_backend.Models;

public class PctReturns
{
    public double MeanGain { get; set; }

    public List<double> PctChgs = new();
}