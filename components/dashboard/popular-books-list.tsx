"use client";

import { useEffect, useState } from "react";
import { getPopularBooks } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconTrophy } from "@tabler/icons-react";

// Interface untuk data buku populer
interface PopularBook {
  title: string;
  total_loans: number;
}

export function PopularBooksList() {
  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const data = await getPopularBooks();
        setPopularBooks(data);
      } catch (error: any) {
        toast.error(error.message || "Gagal memuat buku terpopuler.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPopularBooks();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buku Terpopuler Bulan Ini</CardTitle>
        <CardDescription>5 buku yang paling sering dipinjam oleh anggota.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Memuat data...</p>
        ) : popularBooks.length > 0 ? (
          <ol className="space-y-3 list-decimal list-inside">
            {popularBooks.map((book, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{book.title}</span>
                <span className="font-bold text-muted-foreground">{book.total_loans}x dipinjam</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Belum ada data peminjaman bulan ini.
          </p>
        )}
      </CardContent>
    </Card>
  );
}