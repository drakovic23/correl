"use client"

import {startTransition, useEffect, useState, useTransition} from "react";
import {useRouter, useSearchParams } from "next/navigation";
import Loading from "@/app/loading";

export default function TickerSearch({initialSymbol})
{
    const [symbol, setSymbol] = useState(initialSymbol);
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Listen for changes in the search parameters to set loading to false
        setIsLoading(false);
    }, [searchParams]);

    const handleSubmit = async (e) =>
    {
        e.preventDefault()
        startTransition(() =>{
            setIsLoading(true);
            router.push(`/stats?symbol=${symbol}`)
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <label className="input input-bordered flex items-center gap-2 w-1/4 my-2">
                <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="grow"
                    placeholder="Enter a Yahoo Finance Ticker"
                />
                <button className="btn btn-xs bg-gray-200" type="submit" disabled={isPending || isLoading}>Search</button>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                     className="w-4 h-4 opacity-70">
                    <path fillRule="evenodd"
                          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                          clipRule="evenodd"/>
                </svg>
                {(isPending || isLoading) && <Loading/>}
            </label>
        </form>

)


}