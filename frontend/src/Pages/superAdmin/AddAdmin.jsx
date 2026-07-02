import React, { useState } from "react";
import AddAdmin from "../../Components/Superadmin/AddAdmin";
import Sidebar from "../../Components/Sidebar";

export default function AddAdminPage() {
  // ✅ Sidebar collapse state here
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* ✅ Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* ✅ CONTENT AREA SHIFTS BASED ON COLLAPSE */}
      <main
        className={`
          transition-all duration-500
          ${isCollapsed ? "md:ml-20" : "md:ml-64"}
          px-2 md:px-8 py-6 mb-12
        `}
      >
        <AddAdmin />
      </main>
    </>
  );
}
