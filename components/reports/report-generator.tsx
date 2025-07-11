"use client";

import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { getReport, getBookInventoryReport } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconFileTypePdf, IconFileTypeXls } from "@tabler/icons-react";
interface ReportGeneratorProps {
  reportType: 'loans' | 'fines' | 'overdue-returns' | 'member-activity' | 'book-inventory';
  title: string;
  description: string;
}

export function ReportGenerator({ reportType, title, description }: ReportGeneratorProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reportData, setReportData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Laporan stok buku tidak memerlukan filter tanggal
  const needsDateFilter = reportType !== 'book-inventory';

  const handleGenerateReport = async () => {
    if (needsDateFilter && (!dateRange?.from || !dateRange?.to)) {
      toast.error("Harap pilih rentang tanggal terlebih dahulu.");
      return;
    }
    
    setIsLoading(true);
    setReportData(null);
    try {
      let data;
      if (needsDateFilter) {
        data = await getReport(reportType, {
          start_date: format(dateRange!.from!, "yyyy-MM-dd"),
          end_date: format(dateRange!.to!, "yyyy-MM-dd"),
        });
      } else {
        data = await getBookInventoryReport();
      }

      setReportData(data);
      if (data.length === 0) {
        toast.info("Tidak ada data ditemukan untuk kriteria yang dipilih.");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat laporan.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTable = () => {
    if (!reportData || reportData.length === 0) return <p className="text-sm text-center text-muted-foreground py-4">Silakan buat laporan untuk melihat data.</p>;

    const headers = Object.keys(reportData[0]);

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map(header => <TableHead key={header}>{header.replace(/_/g, ' ').toUpperCase()}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map(header => <TableCell key={`${rowIndex}-${header}`}>{JSON.stringify(row[header])}</TableCell>)}
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
          <Button onClick={handleGenerateReport} disabled={isLoading}>
            {isLoading ? "Memuat..." : "Tampilkan Laporan"}
          </Button>
          <div className="flex-grow"></div>
          {reportData && reportData.length > 0 && (
             <div className="flex gap-2">
              <Button variant="outline" size="sm"><IconFileTypePdf className="mr-2 h-4 w-4" /> PDF</Button>
              <Button variant="outline" size="sm"><IconFileTypeXls className="mr-2 h-4 w-4" /> Excel</Button>
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