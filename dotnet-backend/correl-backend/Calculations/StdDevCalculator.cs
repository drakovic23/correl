using System.Runtime.InteropServices;

namespace correl_backend.Calculations;
public static class StdDevCalculator
{
    //Returns the standard deviation for the given returns
    public static double CalcStdDev(PctReturns pctReturns)
    {
        double sum = 0;
        foreach (var gain in CollectionsMarshal.AsSpan(pctReturns.ReturnsList))
        {
            sum += Math.Pow(gain - pctReturns.MeanReturn, 2);
        }

        sum /= pctReturns.ReturnsList.Count;

        return Math.Round(Math.Sqrt(sum),4,MidpointRounding.AwayFromZero);
    }
}