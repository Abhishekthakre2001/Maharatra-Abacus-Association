import React, { useState } from 'react'
import Sidebar from "../Components/Sidebar";
import Calender from '../Components/Calender';

export default function Examschedule() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    return (
        <>
            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            {/* ✅ CONTENT AREA SHIFTS BASED ON COLLAPSE */}
            <main
                className={`
               transition-all duration-500
               ${isCollapsed ? "md:ml-20" : "md:ml-64"}
               px-2 md:px-8 py-6 mb-12
             `}
            >
                <Calender />
            </main>
        </>
    )
}
