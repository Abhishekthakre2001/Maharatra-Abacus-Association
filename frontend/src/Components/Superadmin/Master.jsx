import React, { useState } from "react";
import Tabs from '../../UI/Tabs';
import AppBar from '../../UI/AppBar';
import Sidebar from "../../Components/Sidebar";
import State from "../../Components/State";
import District from "../../Components/District";

export default function Dashboard() {
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
                <AppBar />
                <Tabs
                    tabs={[
                        { label: 'States', content: <State /> },
                        { label: 'District', content: <District /> },
                    ]}
                />
            </main>

        </>
    )
}
