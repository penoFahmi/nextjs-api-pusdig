"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { toast } from "sonner";
// UBAH: Impor fungsi API yang benar
import { returnLoan } from "@/lib/api";

// Interface bisa diimpor dari file utama
interface Book { id: string; title: string; stock: number; }
interface Peminjaman { id: string; books: Book[]; }

interface Props {
  trigger: React.ReactNode;
  peminjaman: Peminjaman;
  onFinished: () => void;
}

type BookStatusState = Record<string, 'Baik' | 'Rusak'>;

export default function PengembalianModal({ trigger, peminjaman, onFinished }: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookStatuses, setBookStatuses] = useState<BookStatusState>(
    peminjaman.books.reduce((acc, book) => ({ ...acc, [book.id]: 'Baik' }), {})
  );

  const handleStatusChange = (bookId: string, status: 'Baik' | 'Rusak') => {
    setBookStatuses(prev => ({ ...prev, [bookId]: status }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const dataToSubmit = {
        books_status: Object.entries(bookStatuses).map(([id, status]) => ({ id, status })),
      };
      await returnLoan(peminjaman.id, dataToSubmit);
      toast.success("Buku berhasil dikembalikan!");
      onFinished(); // Panggil fungsi untuk muat ulang data di halaman utama
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengembalikan buku.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Konfirmasi Pengembalian</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <p>Pilih kondisi setiap buku yang dikembalikan.</p>
          {peminjaman.books.map(book => (
            <div key={book.id} className="rounded-md border p-3">
              <Label className="font-semibold">{book.title}</Label>
              <RadioGroup
                value={bookStatuses[book.id]}
                onValueChange={(value: 'Baik' | 'Rusak') => handleStatusChange(book.id, value)}
                className="flex items-center space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Baik" id={`baik-${book.id}`} />
                  <Label htmlFor={`baik-${book.id}`}>Baik</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Rusak" id={`rusak-${book.id}`} />
                  <Label htmlFor={`rusak-${book.id}`}>Rusak</Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Memproses..." : "Konfirmasi Pengembalian"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}