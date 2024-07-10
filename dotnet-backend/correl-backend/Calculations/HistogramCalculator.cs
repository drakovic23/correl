using System.Runtime.InteropServices;
namespace correl_backend.Calculations;

public sealed record HistogramPoint //Represents a single element within a HistogramTable
{
    public string? BinName { get; set; }
    public int Frequency { get; set; }
    public double Probability { get; set; }
    public double CumulativeProbability { get; set; }
}
/*public record HistogramTable
{
    public List<string> BinNames { get; } =
    [
        "<= -2.0%", "-2.0% to -1.5%", "-1.5% to -1.0%", "-1.0% to -0.5%", "-0.5% to 0.0%", "0.0% to 0.5%",
        "0.5% to 1.0%", "1.0% to 1.5%", "1.5% to 2.0%", ">= 2.0%"
    ];
    public List<int> Frequencies { get; } = new();
    public List<double> Probabilities { get;} = new();
    public List<double> CumulativeProbability { get; } = new();
}*/
public class HistogramCalculator
{
    private static readonly Dictionary<double, string> BinValNames = new() 
    {
        {0,"<= -2.0%"}, //index of _binVals -> string representation
        {1,"-2.0% to -1.5%"},
        {2,"-1.5% to -1.0%"},
        {3,"-1.0% to -0.5%"},
        {4,"-0.5% to 0.0%"},
        {5,"0.0% to 0.5%"},
        {6,"0.5% to 1.0%"},
        {7,"1.0% to 1.5%"},
        {8,"1.5% to 2.0%"},
        {9,">= 2.0%"}
    };

    private readonly double[] _binValues = [-0.02,-0.015,-0.01,-0.005,0,0.005,0.01,0.015,0.02];
    
    public List<HistogramPoint> CalculateHistTable(PctReturns pctReturns)
    {
        if (pctReturns.Returns.Count < 1)
            throw new ArgumentException("No data in PctReturns object");
        
        int[] counts = new int[10];
        
        //Since we're not mutating PctReturns we can use AsSpan for faster iteration
        foreach (var gain in CollectionsMarshal.AsSpan(pctReturns.Returns))
        {
            for (int i = 0; i < _binValues.Length; i++)
            {
                if (gain < _binValues[i])
                {
                    counts[i]++;
                    break;
                }
            }
            if (gain >= _binValues[_binValues.Length - 1]) //Since our binValues are exclusive of the upper bound
                counts[_binValues.Length]++;
        }

        List<HistogramPoint> histogram = new();
        //HistogramTable histTable = new();
        for (int i = 0; i < counts.Length; i++)
        {
            HistogramPoint histogramPoint = new();
            histogramPoint.Frequency = (counts[i]); //Build our list of frequencies
            double currentProbability = Math.Round((double)counts[i] / pctReturns.Returns.Count,4,MidpointRounding.AwayFromZero);
            histogramPoint.Probability = currentProbability; //Add probability for each bin
            
            double cumulative = 0;
            if (i > 0)
            {
                cumulative += currentProbability;
                for (int p = i - 1; p >= 0 && p < counts.Length; p--) //Add previous probabilities to current for cumulative
                {
                    cumulative = Math.Round(cumulative + histogram[p].Probability,4,MidpointRounding.AwayFromZero);
                }
            }
            else
            {
                cumulative += currentProbability;
            }
            
            histogramPoint.CumulativeProbability = cumulative;

            histogramPoint.BinName = BinValNames[i];
            histogram.Add(histogramPoint);
        }
        
        return histogram;
    }
}