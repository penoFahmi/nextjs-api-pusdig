"use client";

import { useEffect, useState } from "react";
import { getOverdueLoans } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Interface untuk data peminjaman yang telat
interface OverdueLoan {
  id: string;
  user: {
    id: string;
    name: string;
  };
  hari_terlambat: number;
}

export function OverdueLoansList() {
  const [overdueLoans, setOverdueLoans] = useState<OverdueLoan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverdueLoans = async () => {
      try {
        const data = await getOverdueLoans();
        setOverdueLoans(data);
      } catch (error: any) {
        toast.error(error.message || "Gagal memuat data keterlambatan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOverdueLoans();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Peminjaman Lewat Tenggat ⏰</CardTitle>
        <CardDescription>
          Daftar peminjaman yang perlu segera ditindaklanjuti.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Memuat data...</p>
        ) : overdueLoans.length > 0 ? (
          <ul className="space-y-4">
            {overdueLoans.map((loan) => (
              <li key={loan.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{loan.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Terlambat: <Badge variant="destructive">{loan.hari_terlambat} hari</Badge>
                  </p>
                </div>
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/dashboard/peminjaman/${loan.id}`}>Lihat Detail</Link>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Tidak ada peminjaman yang lewat tenggat. Kerja bagus! ✨
          </p>
        )}
      </CardContent>
    </Card>
  );
}