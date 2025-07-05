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

interface Penulis {
  id: number;
  name: string;
}

interface PenulisBuku {
  id: number
  book_id: string
  author_id: string
}

interface Props {
  penulisBuku?: PenulisBuku
  trigger: React.ReactNode
  onSubmit: (data: PenulisBuku) => void
  buku: Buku []
  penulis: Penulis[]
}

export default function PenulisBukuFormModal({ penulisBuku, buku, penulis, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<PenulisBuku>({
    book_id: penulisBuku?.book_id || "",
    author_id: penulisBuku?.author_id || "",
    id: penulisBuku?.id || 0,
  })

  const handleChange = (name: 'book_id' | 'author_id', value: string) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = () => {
    // Kirim data tanpa ID jika itu yang diharapkan oleh fungsi create
    const { id, ...dataToSubmit } = form;
    if (penulisBuku) {
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
        id: penulisBuku?.id || 0,
        book_id: penulisBuku?.book_id || "",
        author_id: penulisBuku?.author_id || "",
      });
    }
  }, [open, penulisBuku]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{penulisBuku ? "Edit Penulis Buku" : "Tambah Penulis Buku"}</DialogTitle>
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
                <SelectItem key={buku.id} value={String(buku.id)}>
                  {buku.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            name="author_id"
            value={form.author_id}
            onValueChange={(value) => handleChange('author_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Nama Penulis" />
            </SelectTrigger>
            <SelectContent>
              {penulis.map((penulis) => (
                <SelectItem key={penulis.id} value={String(penulis.id)}>
                  {penulis.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {penulisBuku ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
