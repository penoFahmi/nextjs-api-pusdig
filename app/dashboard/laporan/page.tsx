import { AppSidebar } from "@/components/app-sidebar";
import { ReportGenerator } from "@/components/reports/report-generator"; // Impor komponen baru
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Impor komponen Tabs

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold tracking-tight">Laporan Perpustakaan</h1>
            <p className="text-muted-foreground">
              Pilih jenis laporan untuk melihat dan mengekspor data.
            </p>
          </div>
          
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
        <SiteFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}