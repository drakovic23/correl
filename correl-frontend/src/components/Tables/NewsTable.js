export default function NewsTable({newsData})
{
    const maxHeadlineLength = 70;
    return(
        <>
        <div className="overflow-x-auto mt-2 max-h-96">
            <table className="table table-xs table-zebra table-pin-rows max-h-96">
                <tbody className="max-h-96">
                {newsData.length > 0 ?
                    newsData.map((newsEntry,i) => {
                   return <tr key={i}>
                    <td>
                        <li>
                        <a href={newsEntry.url} target="_blank" className="hover:border-accent-content/75">
                        {newsEntry.headline.length > maxHeadlineLength ? `${newsEntry.headline.substring(0,maxHeadlineLength)}...` : newsEntry.headline}
                        </a>
                        </li>
                    </td>

                       <td>{new Date(newsEntry.datetime * 1000).toDateString()}</td>
                    </tr>
                }) : <td>
                        No news found
                    </td>
                }
                </tbody>
            </table>
        </div>
</>
)
}