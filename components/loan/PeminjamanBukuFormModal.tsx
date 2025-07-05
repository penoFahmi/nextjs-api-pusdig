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

interface Buku {
  id: number;
  title: string;
}

interface User {
  id: number;
  name: string;
}

interface PeminjamanBuku {
  id: number;
  book_id: string;
  user_id: string;
}

interface Props {
  peminjamanBuku?: PeminjamanBuku
  trigger: React.ReactNode
  onSubmit: (data: PeminjamanBuku) => void
  buku: Buku []
  user: User[]
}

export default function PenulisBukuFormModal({ peminjamanBuku, buku, user, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<PeminjamanBuku>({
    book_id: peminjamanBuku?.book_id || "",
    user_id: peminjamanBuku?.user_id || "",
    id: peminjamanBuku?.id || 0,
  })

  const handleChange = (name: 'book_id' | 'user_id', value: string) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = () => {
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
      });
    }
  }, [open, peminjamanBuku]);

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
              {buku.map((buku) => (
                <SelectItem 
                key={buku.id} 
                value={String(buku.id)}
                >
                  {buku.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            name="user_id"
            value={form.user_id}
            onValueChange={(value) => handleChange('user_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Nama User" />
            </SelectTrigger>
            <SelectContent>
              {user.map((user) => (
                <SelectItem key={user.id} value={String(user.id)}>
                  {user.name}
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
