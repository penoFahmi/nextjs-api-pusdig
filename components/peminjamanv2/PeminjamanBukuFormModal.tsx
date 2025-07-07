"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
} from "../ui/select"
import { toast } from "sonner";

interface Buku {
  id: number;
  title: string;
  stock: number;
}

interface User {
  id: number;
  name: string;
}

interface PeminjamanBuku {
  id: number;
  book_id: string;
  user_id: string;
  status: string;
}

interface Props {
  peminjamanBuku?: PeminjamanBuku
  trigger: React.ReactNode
  onSubmit: (data: PeminjamanBuku) => void
  buku: Buku []
  user: User[]
}

export default function PeminjamanBukuFormModal({ peminjamanBuku, buku, user, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<PeminjamanBuku>({
    book_id: peminjamanBuku?.book_id || "",
    user_id: peminjamanBuku?.user_id || "",
    status: 'Dipinjam',
    id: peminjamanBuku?.id || 0,
  });

  const availableBooks = buku.filter(
    (b) => b.stock > 0 || (peminjamanBuku && String(b.id) === peminjamanBuku.book_id)
  );

  const handleChange = (name: 'book_id' | 'user_id', value: string) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.book_id || !form.user_id) {
        toast.error("Harap pilih buku dan peminjam.");
        return;
    }
    // Kirim data tanpa ID jika itu yang diharapkan oleh fungsi create
    const { id, ...dataToSubmit } = form;
    if (peminjamanBuku) {
      // Jika edit, sertakan ID
      onSubmit({id, ...dataToSubmit});
    } else {
      // Jika create, kirim tanpa ID
      onSubmit(dataToSubmit);
    }
    setOpen(false);
  };

  // useEffect untuk mereset form saat modal ditutup atau properti berubah
  useEffect(() => {
    if (open) {
      setForm({
        id: peminjamanBuku?.id || 0,
        book_id: peminjamanBuku?.book_id || "",
        user_id: peminjamanBuku?.user_id || "",
        status: 'Dipinjam',
      });
      if (availableBooks.length === 0 && !peminjamanBuku) {
          toast.info("Tidak ada buku yang tersedia untuk dipinjam saat ini.");
      }
    }
  }, [open, peminjamanBuku, buku]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{peminjamanBuku ? "Edit Peminjaman Buku" : "Tambah Peminjaman Buku"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">

          <Select
            name="book_id"
            value={form.book_id}
            onValueChange={(value) => handleChange('book_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Judul Buku" />
            </SelectTrigger>
            <SelectContent>
              {/* UBAH: Gunakan availableBooks dan tampilkan stok */}
              {availableBooks.length > 0 ? (
                availableBooks.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.title} (Stok: {b.stock})
                  </SelectItem>
                ))
              ) : (
                <div className="p-4 text-sm text-gray-500">Tidak ada buku tersedia.</div>
              )}
            </SelectContent>
          </Select>
          <Select
            name="user_id"
            value={form.user_id}
            onValueChange={(value) => handleChange('user_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Nama Peminjam" />
            </SelectTrigger>
            <SelectContent>
              {user.map((u) => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {peminjamanBuku ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
