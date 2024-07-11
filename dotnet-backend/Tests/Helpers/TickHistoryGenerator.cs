using NodaTime;
using YahooQuotesApi;
using Microsoft.VisualBasic.FileIO;

namespace Tests.Helpers;

public static class TickHistoryGenerator
{
    public static PriceTick[] GeneratePriceHistoryFromCsv() //Used to generate a PriceTick[] from a csv file for testing
    {
        List<PriceTick> priceTickList = new();
        var path = @"../../../Helpers/TREX.csv"; //CSV from YahooFinance
        using (TextFieldParser csvParser = new TextFieldParser(path))
        {
            csvParser.CommentTokens = ["#"];
            csvParser.SetDelimiters([","]);
            csvParser.HasFieldsEnclosedInQuotes = true;

            csvParser.ReadLine(); //Skip the headers
            while (!csvParser.EndOfData)
            {
                string[] fields = csvParser.ReadFields();
                LocalDate date = LocalDate.FromDateOnly(DateOnly.Parse(fields[0]));
                double open = double.Parse(fields[1]);
                double high = double.Parse(fields[2]);
                double low = double.Parse(fields[3]);
                double close = double.Parse(fields[4]);
                double adjClose = double.Parse(fields[5]);
                int volume = int.Parse(fields[6]);

                PriceTick tick = new PriceTick(date, open, high, low, close, adjClose,volume);
                priceTickList.Add(tick);
            }
        }
        PriceTick[] history = new PriceTick[priceTickList.Count];

        for (int i = 0; i < priceTickList.Count; i++)
        {
            history[i] = priceTickList[i];
        }

        return history;
    }
}