"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
// UBAH: Impor fungsi API yang benar
import { createLoan } from "@/lib/api"; 

// Interface bisa diimpor dari file utama jika Anda memisahkannya
interface Book { id: string; title: string; stock: number; }
interface User { id: string; name: string; }

interface Props {
  trigger: React.ReactNode;
  onFinished: () => void;
  books: Book[];
  users: User[];
}

export default function PeminjamanFormModal({ trigger, onFinished, books, users }: Props) {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [tanggalKembali, setTanggalKembali] = useState<Date | undefined>();
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [bookToAddId, setBookToAddId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const availableBooks = books.filter(b => b.stock > 0 && !selectedBooks.find(sb => sb.id === b.id));

  const resetForm = () => {
    setUserId("");
    setTanggalKembali(undefined);
    setSelectedBooks([]);
    setBookToAddId("");
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const handleAddBook = () => {
    const book = books.find(b => b.id === bookToAddId);
    if (book) {
      setSelectedBooks(prev => [...prev, book]);
      setBookToAddId("");
    }
  };

  const handleRemoveBook = (bookId: string) => {
    setSelectedBooks(prev => prev.filter(b => b.id !== bookId));
  };

  const handleSubmit = async () => {
    if (!userId || !tanggalKembali || selectedBooks.length === 0) {
      toast.error("Harap lengkapi semua field: peminjam, tanggal kembali, dan minimal satu buku.");
      return;
    }
    
    setIsLoading(true);
    try {
      const dataToSubmit = {
        user_id: userId,
        tanggal_kembali: format(tanggalKembali, "yyyy-MM-dd"),
        book_ids: selectedBooks.map(b => b.id),
      };
      await createLoan(dataToSubmit);
      toast.success("Peminjaman berhasil dibuat!");
      onFinished(); // Panggil fungsi untuk muat ulang data di halaman utama
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat peminjaman.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Tambah Peminjaman Baru</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <Select name="user_id" value={userId} onValueChange={setUserId}>
            <SelectTrigger><SelectValue placeholder="Pilih Nama Peminjam" /></SelectTrigger>
            <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {tanggalKembali ? format(tanggalKembali, "PPP") : <span>Pilih tanggal kembali</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={tanggalKembali} onSelect={setTanggalKembali} initialFocus /></PopoverContent>
          </Popover>

          <div className="flex gap-2">
            <Select value={bookToAddId} onValueChange={setBookToAddId}>
              <SelectTrigger><SelectValue placeholder="Pilih Judul Buku..." /></SelectTrigger>
              <SelectContent>{availableBooks.map(b => <SelectItem key={b.id} value={b.id}>{b.title} (Stok: {b.stock})</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={handleAddBook} disabled={!bookToAddId}>Tambah</Button>
          </div>

          <div className="space-y-2 rounded-md border p-2 min-h-[80px]">
            <h4 className="font-medium text-sm">Buku yang akan dipinjam:</h4>
            {selectedBooks.length > 0 ? (
              <ul className="space-y-1">{selectedBooks.map(b => (
                <li key={b.id} className="flex justify-between items-center text-sm">
                  <span>{b.title}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveBook(b.id)}><X className="h-4 w-4" /></Button>
                </li>
              ))}</ul>
            ) : <p className="text-sm text-gray-500 text-center pt-2">Belum ada buku ditambahkan.</p>}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? "Menyimpan..." : "Simpan Peminjaman"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}