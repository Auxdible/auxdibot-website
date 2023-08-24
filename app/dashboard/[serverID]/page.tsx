"use client";
import DashboardLanding from "@/components/dashboard/DashboardLanding";
import DashboardSidebarContext from "@/context/DashboardSidebarContext";
import { useContext } from 'react';

export default function ServerDashboardContainer()  {
    const page = useContext(DashboardSidebarContext);
    page?.setCurrentPage("home");
    return (<>
            <DashboardLanding />
        </>)
}