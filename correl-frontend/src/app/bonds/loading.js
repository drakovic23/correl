import "@/app/bonds/spinkit.css.min.css"
export default function Loading()
{
    return (
        <>
            <div className="flex items-center justify-center h-screen">
                <div className="sk-wave">
                    <div className="sk-wave-rect"></div>
                    <div className="sk-wave-rect"></div>
                    <div className="sk-wave-rect"></div>
                    <div className="sk-wave-rect"></div>
                    <div className="sk-wave-rect"></div>
                </div>
            </div>
        </>
    )
}