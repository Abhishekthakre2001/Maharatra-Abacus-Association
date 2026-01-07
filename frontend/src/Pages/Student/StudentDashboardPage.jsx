// src/Pages/DashboardPage.jsx
import React, { useState } from "react";
import StudentDashboard from "../../Components/Student/StudentDashboard";
import StudentSidebar from "../../Components/Student/StudentSidebar";

export default function StudentDashboardPage() {
    // ✅ Sidebar collapse state here
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            {/* ✅ Sidebar */}
            {/* <StudentSidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            /> */}

            {/* ✅ CONTENT AREA SHIFTS BASED ON COLLAPSE */}
            {/* <main
                className={`
          transition-all duration-500
          ${isCollapsed ? "md:ml-20" : "md:ml-64"}
          px-2 md:px-8 py-6 mb-12
        `}
            > */}
            <StudentDashboard />
            {/* </main> */}
        </>
    );
}
