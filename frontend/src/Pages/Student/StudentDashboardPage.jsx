// src/Pages/DashboardPage.jsx
import React, { useState } from "react";
import StudentDashboard from "../../Components/Student/StudentDashboard";
import StudentSidebar from "../../Components/Student/StudentSidebar";

export default function StudentDashboardPage() {
    // ✅ Sidebar collapse state here
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            <div className="bg-blue-50">
  <StudentDashboard />
            </div>
          
            {/* </main> */}
        </>
    );
}
