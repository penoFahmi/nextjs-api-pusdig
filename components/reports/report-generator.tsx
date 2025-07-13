"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
// PERBAIKAN: Impor fungsi dari api.ts
import { getReport, getBookInventoryReport, exportFile } from "@/lib/api"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconFileTypePdf, IconFileTypeXls } from "@tabler/icons-react";

// Konfigurasi kolom tabel
const reportColumnsConfig = {
  'loans': [
    { key: 'member_name', label: 'Nama Anggota' },
    { key: 'book_title', label: 'Judul Buku' },
    { key: 'loan_date', label: 'Tanggal Pinjam' },
    { key: 'due_date', label: 'Jatuh Tempo' },
    { key: 'status', label: 'Status' },
  ],
  'overdue-returns': [
    { key: 'member_name', label: 'Nama Anggota' },
    { key: 'book_title', label: 'Judul Buku' },
    { key: 'return_date', label: 'Tanggal Kembali' },
    { key: 'days_overdue', label: 'Hari Terlambat' },
  ],
  'fines': [
    { key: 'member_name', label: 'Nama Anggota' },
    { key: 'book_title', label: 'Judul Buku' },
    { key: 'amount', label: 'Jumlah Denda' },
    { key: 'paid_at', label: 'Tanggal Bayar' },
  ],
  'member-activity': [
    { key: 'member_name', label: 'Nama Anggota' },
    { key: 'total_loans', label: 'Total Pinjaman' },
    { key: 'total_fines', label: 'Total Denda' },
  ],
  'book-inventory': [
    { key: 'title', label: 'Judul Buku' },
    { key: 'author', label: 'Penulis' }, // <-- PERBAIKAN: Kolom Author ditambahkan
    { key: 'total_stock', label: 'Total Stok' },
    { key: 'available_stock', label: 'Stok Tersedia' },
  ],
};

interface ReportGeneratorProps {
  reportType: 'loans' | 'fines' | 'overdue-returns' | 'member-activity' | 'book-inventory';
  title: string;
  description: string;
}

export function ReportGenerator({ reportType, title, description }: ReportGeneratorProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reportData, setReportData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const needsDateFilter = reportType !== 'book-inventory';

  const fetchReportData = async (currentDateRange?: DateRange) => {
    setIsLoading(true);
    setReportData(null);
    try {
      let data;
      if (needsDateFilter) {
        const params = currentDateRange?.from && currentDateRange?.to
          ? {
              start_date: format(currentDateRange.from, "yyyy-MM-dd"),
              end_date: format(currentDateRange.to, "yyyy-MM-dd"),
            }
          : {};
        data = await getReport(reportType, params);
      } else {
        data = await getBookInventoryReport();
      }

      setReportData(data);
      if (data.length === 0) {
        toast.info("Tidak ada data ditemukan untuk kriteria yang dipilih.");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal memuat laporan.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReportData();
  }, [reportType]);

  const handleFilterReport = () => {
    fetchReportData(dateRange);
  };

  // PERBAIKAN: Fungsi handleExport sekarang menggunakan fungsi 'exportFile' dari api.ts
  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    toast.info(`Memulai ekspor ${format.toUpperCase()}...`);

    try {
      const url = `/reports/${reportType}/export/${format}`;
      
      // Memanggil fungsi API terpusat yang sudah membawa token
      const response = await exportFile(url);

      const blob = response.data;
      const disposition = response.headers['content-disposition'];
      
      let filename = `laporan-${reportType}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
          }
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("File berhasil diunduh.");

    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Terjadi kesalahan saat mengekspor.");
    } finally {
      setIsExporting(false);
    }
  };

  const renderTable = () => {
    if (isLoading) {
        return <p className="text-sm text-center text-muted-foreground py-4">Memuat data laporan...</p>;
    }
    if (!reportData || reportData.length === 0) {
        return <p className="text-sm text-center text-muted-foreground py-4">Tidak ada data untuk ditampilkan.</p>;
    }

    // Gunakan konfigurasi kolom yang sudah diperbaiki
    const columns = reportColumnsConfig[reportType]; 

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => <TableHead key={col.key}>{col.label}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map(col => (
                <TableCell key={`${rowIndex}-${col.key}`}>
                  {row[col.key] ?? '-'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 p-4 border rounded-lg bg-muted">
          {needsDateFilter && <DateRangePicker date={dateRange} onDateChange={setDateRange} />}
          {needsDateFilter && (
            <Button onClick={handleFilterReport} disabled={isLoading}>
              {isLoading ? "Memfilter..." : "Filter Laporan"}
            </Button>
          )}

          <div className="flex-grow"></div>
          
          {reportData && reportData.length > 0 && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleExport('pdf')} 
                disabled={isExporting}
              >
                <IconFileTypePdf className="mr-2 h-4 w-4" /> 
                {isExporting ? 'Mengekspor...' : 'PDF'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleExport('excel')} 
                disabled={isExporting}
              >
                <IconFileTypeXls className="mr-2 h-4 w-4" /> 
                {isExporting ? 'Mengekspor...' : 'Excel'}
              </Button>
            </div>
          )}
        </div>
        <div className="mt-4 border rounded-lg">
          {renderTable()}
        </div>
      </CardContent>
    </Card>
  );
}