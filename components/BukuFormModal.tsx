"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Buku {
  id: number
  title: string
  isbn: number
  publisher: string
  year_published: number
  stock: number
}

interface Props {
  buku?: Buku
  trigger: React.ReactNode
  onSubmit: (data: Buku) => void
}

export default function BukuFormModal({ buku, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Buku>({
    title: buku?.title || "",
    isbn: buku?.isbn || "",
    publisher: buku?.publisher || "",
    year_published: buku?.year_published || "",
    stock: buku?.stock || "",
    id: buku?.id || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSubmit(form)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{buku ? "Edit Buku" : "Tambah Buku"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">

          <Input
            name="title"
            placeholder="Judul"
            value={form.title}
            onChange={handleChange}
          />
          <Input
            name="isbn"
            placeholder="ISBN"
            value={form.isbn}
            onChange={handleChange}
          />
          <Input
            name="publisher"
            placeholder="Penerbit"
            value={form.publisher}
            onChange={handleChange}
          />
          <Input
            name="year_published"
            placeholder="Tahun Terbit"
            value={form.year_published}
            onChange={handleChange}
          />
          <Input
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {buku ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
