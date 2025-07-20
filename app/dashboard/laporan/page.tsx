import { AppSidebar } from "@/components/app-sidebar";
import { ReportGenerator } from "@/components/reports/report-generator";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <h1 className="text-2xl font-semibold tracking-tight">Laporan Perpustakaan</h1>
            <p className="text-muted-foreground">
              Pilih jenis laporan untuk melihat dan mengekspor data.
            </p>
          
          <div className="border rounded-lg p-4 bg-muted">
          <Tabs defaultValue="loans" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="loans">Peminjaman</TabsTrigger>
              <TabsTrigger value="overdue-returns">Keterlambatan</TabsTrigger>
              <TabsTrigger value="fines">Denda</TabsTrigger>
              <TabsTrigger value="member-activity">Aktivitas Anggota</TabsTrigger>
              <TabsTrigger value="book-inventory">Stok Buku</TabsTrigger>
            </TabsList>
            
            <TabsContent value="loans" className="mt-4">
              <ReportGenerator 
                reportType="loans"
                title="Laporan Peminjaman per Periode"
                description="Tampilkan semua transaksi peminjaman dalam rentang tanggal yang dipilih."
              />
            </TabsContent>
            
            <TabsContent value="overdue-returns" className="mt-4">
              <ReportGenerator 
                reportType="overdue-returns"
                title="Laporan Keterlambatan"
                description="Tampilkan semua peminjaman yang dikembalikan terlambat."
              />
            </TabsContent>

            <TabsContent value="fines" className="mt-4">
              <ReportGenerator 
                reportType="fines"
                title="Laporan Denda"
                description="Tampilkan semua denda yang tercatat dalam rentang tanggal pengembalian."
              />
            </TabsContent>

            <TabsContent value="member-activity" className="mt-4">
              <ReportGenerator 
                reportType="member-activity"
                title="Laporan Aktivitas Anggota"
                description="Tampilkan jumlah pinjaman dan denda per anggota."
              />
            </TabsContent>

            <TabsContent value="book-inventory" className="mt-4">
              <ReportGenerator 
                reportType="book-inventory"
                title="Laporan Stok Buku"
                description="Tampilkan daftar semua buku beserta stok total dan yang tersedia."
              />
            </TabsContent>
          </Tabs>
          </div>
          </div>
        </div>
        </div>
        <SiteFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}