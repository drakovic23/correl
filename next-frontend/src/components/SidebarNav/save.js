"use client"

import {AiOutlineMenu, AiOutlineDollar, AiOutlineLineChart, AiOutlineBarChart, AiFillHome} from 'react-icons/ai'
import {useState} from 'react'
import React from 'react'
import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'

export default function SidebarNav({children}) {
    const [menuOpen, setMenuOpen] = useState(true);
    if (typeof Highcharts === 'object') {
        HighchartsExporting(Highcharts)
    }
    const options = {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Yield Curve'
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 1080
                },
                chartOptions: {
                    chart: {
                        className: 'small-chart'
                    }
                }
            }]
        },
        series: [{
            data: [0.05 * 100, 0.06* 100, 0.07* 100], name: '3M',
        },
            {
                data:[0.06 * 100, 0.063 * 100, 0.043 * 100,0.043 * 100,0.043 * 100,0.01*100,0.02*100,0.025*100,0.032*100,0.05*100], name: '6M'
            }],
        xAxis: {
            categories: ['3M', '6M', '1YR', '2YR', '3YR', '5YR','10YR','20YR','30YR'],
            accessibility: {
                description: 'Maturity Date'
            },
        },
        yAxis: {
            title: {
                text: 'Yield'
            },
            labels: {
                format: '{value}%'
            }
        },
        tooltip:{
            valueSuffix: '%'
        }
    }

    return (
        <div className="drawer drawer-start h-screen">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle"/>
            <div className="drawer-content">
                {/* Page content here */}
                <div className="bg-base-100 text-base-content top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)]
                        shadow-sm">
                    <div className="navbar w-full ">

                        <span className="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]">
                            <label className="btn btn-square btn-ghost drawer-button " aria-label="Open menu"
                                   htmlFor="my-drawer-4">
                            <svg className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6" width={20}
                                 height={20} xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                            </label>
                        </span>
                        <div className="flex-1">
                            <a className="ml-16 btn btn-ghost text-xl">Lar</a>
                        </div>
                    </div>
                </div>

                {/*Main content here*/}
                {children}

                {/*<label htmlFor="my-drawer-4" className="drawer-button btn btn-primary">Open Menu</label>*/}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-2 w-80 min-h-full bg-base-100 text-base-content text-lg font-semibold">
                    {/* Sidebar content here */}
                    <label className="btn btn-square btn-ghost drawer-button " aria-label="Close menu"
                           htmlFor="my-drawer-4">
                        <svg className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6" width={20}
                             height={20} xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </label>
                    <li><a className=""><AiFillHome/>Dashboard</a></li>
                    <li><a className=""><AiOutlineDollar/>Bonds</a></li>
                    <hr/>
                    <li><a className=""><AiOutlineBarChart/>Indicators</a></li>
                    <li><a className=""><AiOutlineLineChart/>Correlations</a></li>
                </ul>
            </div>
        </div>
    );
}
