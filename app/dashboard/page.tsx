import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/dashboard/section-cards"
import { OverdueLoansList } from "@/components/dashboard/overdue-loans-list"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { LoanActivityChart } from "@/components/dashboard/loan-activity-chart"
import { PopularBooksList } from "@/components/dashboard/popular-books-list"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <LoanActivityChart />
              </div>
              <div className="px-4 lg:px-6">
                <OverdueLoansList />
              </div>
              <div className="px-4 lg:px-6">
                <PopularBooksList />
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </SidebarInset>
    </SidebarProvider>
  )
}
