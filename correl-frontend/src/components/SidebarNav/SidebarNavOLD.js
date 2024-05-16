"use client"

import {AiOutlineMenu, AiOutlineDollar, AiOutlineLineChart, AiOutlineBarChart, AiFillHome} from 'react-icons/ai'
import React, { useState } from 'react';
import Image from 'next/image'
import Footer from "@/components/Footer/Footer";

export default function SidebarNavOLD({children}) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    return (
        <div className="drawer">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" defaultChecked="true"/>
            <div className="drawer-content flex flex-col bg-base-200">
                {/* Page content here */}
                <div className="bg-base-100 text-base-content
                        ">
                    <div className="navbar shadow-sm">

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
                </div>

                {/*Main content here*/}
                <div className="">
                    {children}
                    <Footer/>
                </div>


                {/*<label htmlFor="my-drawer-4" className="drawer-button btn btn-primary">Open Menu</label>*/}
            </div>
            <div className={`drawer-side relative shadow-sm border-r-2 ${isSidebarOpen ? "" : "hidden"}`}>

                {/*<label htmlFor="my-drawer-4" aria-label="close sidebar"></label>*/}

                <ul className="menu p-2 lg:w-48 md:w-48 min-h-full rounded-r-lg sm:w-32 bg-base-100 text-base-content lg:text-sm md:text-sm sm:text-xs font-semibold">
                    {/* Sidebar content here */}

                    <li><a className=""><AiFillHome/>Dashboard</a></li>
                    <li><a className="" href="/"><AiOutlineDollar/>Bonds</a></li>
                    <hr/>
                    <li><a className=""><AiOutlineBarChart/>Indicators</a></li>
                    <li><a className=""><AiOutlineLineChart/>Correlations</a></li>
                </ul>
            </div>

        </div>
    );
}
