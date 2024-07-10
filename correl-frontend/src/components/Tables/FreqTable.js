export default function FreqTable({histogramData})
{

    return(
        <div className="overflow-x-auto mt-2 max-h-96 self-center">
        <div className="table table-xs table-zebra text-center table-pin-cols table-pin-rows">
            <table>
                <thead>
                <tr>
                    <th>Bin Val</th>
                    <th>Freq</th>
                    <th>Probability</th>
                    <th>Cumulative Prob</th>
                </tr>
                </thead>
                <tbody>
                {histogramData?.map((point, i) => (
                    <tr key={i}>
                        <td>{point.binName}</td>
                        <td>{point.frequency}</td>
                        <td>{( point.probability * 100 ).toFixed(2) + '%'}</td>
                        <td>{i === histogramData.length - 1 ? "100.00%" : ( point.cumulativeProbability * 100).toFixed(2) + '%'}</td>
                    </tr>
                ))
                }
                </tbody>
            </table>
        </div>
        </div>
    )
}