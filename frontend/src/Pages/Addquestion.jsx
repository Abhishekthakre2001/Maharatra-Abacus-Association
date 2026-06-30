import React, { useState } from 'react'
import AddUpdateQuestion from '../Components/AddUpdateQuestion';
import Sidebar from "../Components/Sidebar";
import AppBar from '../UI/AppBar';

export default function Addquestion() {
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
                   <AppBar
                    title="Question Management"
                    subtitle="Configure and manage system-wide master data"
                />
                <AddUpdateQuestion />
            </main>
        </>
    )
}
