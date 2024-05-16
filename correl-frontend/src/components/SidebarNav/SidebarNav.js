"use client"

import {AiOutlineDollar, AiOutlineLineChart, AiOutlineBarChart, AiFillHome} from 'react-icons/ai'
import React, { useState } from 'react';
import "@/components/SidebarNav/sidebar.css"
import Footer from "@/components/Footer/Footer";
export default function SidebarNav({children}) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    return (
        <div className="size-full">
        <div className="flex overflow-hidden">
            <div className="block lg:hidden">
                <input className="drawer-toggle" aria-label="Drawer handler" readOnly="" type="checkbox"/>
                <div className="drawer-content"></div>
                <div className="drawer-side">
                    <label className="drawer-overlay"></label>
                    <div className="will-change-transform transition sticky bottom-0 top-o h-full min-w-16 border-1"></div>
                </div>
            </div>
            <div className="hidden lg:block md:block border-b border-r">

                <div className={`shadow-sm border-r-1 bottom-0 top-0 sticky h-full transition-all ${isSidebarOpen ? "" : "hide"}`}>
                    <ul className="menu p-2 lg:w-48 md:w-48 min-h-full sm:w-32 bg-base-100 text-base-content lg:text-lg md:text-sm sm:text-xs font-semibold">
                        {/* Sidebar content here */}
                        <li><a className="" href="/bonds"><AiFillHome/>Dashboard</a></li>
                        <li><a className="" href="/bonds"><AiOutlineDollar/>Bonds</a></li>
                        <li><a className="" href="/indicators"><AiOutlineBarChart/>Indicators</a></li>
                        <li><a className="" href="/correlations"><AiOutlineLineChart/>Stats</a></li>
                    </ul>
                </div>
            </div>

            <div className="overflow-auto w-full h-full max-w-full ">
                <div className="flex h-full flex-col">
                    <div className="navbar z-10 border-b border-base-200 px-3 shadow-md" role="navigation" aria-label="Navbar">

                        <span className="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]">
                            <label className="btn btn-square btn-ghost drawer-button" aria-label="Open menu"
                                   htmlFor="my-drawer-4" onClick={toggleSidebar}>
                            <svg className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6" width={20}
                                 height={20} xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                            </label>
                        </span>

                        <div className="flex-1">
                            <a className="btn btn-ghost text-xl">Lar</a>
                        </div>

                        <hr/>
                    </div>
                    <hr className=""/>
                </div>
                {/*Main Content Here*/}
                <div className="flex flex-col bg-[#f2f5f8] min-h-screen">
                    {children}

                </div>
            </div>
        </div>
        </div>
    );
}
