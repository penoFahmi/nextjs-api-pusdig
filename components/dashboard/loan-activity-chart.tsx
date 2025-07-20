"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { getLoanActivity } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Interface untuk data dari API
interface ApiChartData {
  labels: string[];
  datasets: {
    label: 'Dipinjam' | 'Dikembalikan';
    data: number[];
  }[];
}

// Konfigurasi untuk Recharts
const chartConfig = {
  Dipinjam: {
    label: "Dipinjam",
    color: "hsl(var(--primary))",
  },
  Dikembalikan: {
    label: "Dikembalikan",
    color: "hsl(var(--success))",
  },
} satisfies ChartConfig;

export function LoanActivityChart() {
  const [apiData, setApiData] = useState<ApiChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getLoanActivity();
        setApiData(data);
      } catch (error: any) {
        toast.error(error.message || "Gagal memuat aktivitas peminjaman.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, []);

  // Menggabungkan data dari API ke format yang dibutuhkan oleh grafik
  const formattedChartData = apiData?.labels.map((label, index) => ({
    date: label, // 'name' diubah menjadi 'date' agar cocok dengan tickFormatter
    Dipinjam: apiData.datasets[0].data[index],
    Dikembalikan: apiData.datasets[1].data[index],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Peminjaman</CardTitle>
        <CardDescription>
          Data peminjaman dan pengembalian buku selama 7 hari terakhir.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="h-[250px] w-full flex items-center justify-center">Memuat grafik...</div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={formattedChartData}>
              <defs>
                <linearGradient id="fillDipinjam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-Dipinjam)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-Dipinjam)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillDikembalikan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-Dikembalikan)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-Dikembalikan)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="Dikembalikan"
                type="natural"
                fill="url(#fillDikembalikan)"
                stroke="var(--color-Dikembalikan)"
                stackId="a"
              />
              <Area
                dataKey="Dipinjam"
                type="natural"
                fill="url(#fillDipinjam)"
                stroke="var(--color-Dipinjam)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}