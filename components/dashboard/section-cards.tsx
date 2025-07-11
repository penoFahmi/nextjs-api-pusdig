"use client";

import { useEffect, useState } from "react";
// UBAH: Impor fungsi API yang baru dan ikon yang relevan
import { getDashboardStats } from "@/lib/api"; 
import { IconBook, IconClockExclamation, IconUsers, IconReceiptOff } from "@tabler/icons-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Interface untuk data statistik
interface DashboardStats {
  active_loans: number;
  overdue_loans: number;
  unpaid_fines: number;
  total_members: number;
}

export function SectionCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error: any) {
        toast.error(error.message || "Gagal memuat statistik.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Menampilkan skeleton loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-[126px] animate-pulse bg-muted/50"></Card>
        ))}
      </div>
    );
  }

  // Menampilkan data setelah berhasil dimuat
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      {/* Kartu Peminjaman Aktif */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Peminjaman Aktif</CardDescription>
            <IconBook className="text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.active_loans} Buku
          </CardTitle>
        </CardHeader>
      </Card>
      
      {/* Kartu Buku Lewat Tenggat */}
      <Card className="@container/card data-[slot=card]:from-destructive/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription className="text-destructive">Buku Lewat Tenggat</CardDescription>
            <IconClockExclamation className="text-destructive" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-destructive">
            {stats?.overdue_loans} Peminjaman
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Kartu Denda Belum Lunas */}
      <Card className="@container/card data-[slot=card]:from-amber-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription className="text-amber-600">Denda Belum Lunas</CardDescription>
            <IconReceiptOff className="text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-amber-600">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats?.unpaid_fines || 0)}
          </CardTitle>
        </CardHeader>
      </Card>
      
      {/* Kartu Total Anggota */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Total Anggota</CardDescription>
            <IconUsers className="text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.total_members} Orang
          </CardTitle>
        </CardHeader>
      </Card>

    </div>
  );
}