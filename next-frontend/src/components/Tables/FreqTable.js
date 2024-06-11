export default function FreqTable({freqData})
{

    return(
        <div className="table table-xs mt-4 w-full text-center">
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
                {freqData.map((point, i) => (
                    <tr key={i}>
                        <td>{point.binName}</td>
                        <td>{point.freq}</td>
                        <td>{point.probability.toFixed(2) + '%'}</td>
                        <td>{point.cumulativeProb + '%'}</td>
                    </tr>
                ))
                }
                </tbody>
            </table>
        </div>
    )
}