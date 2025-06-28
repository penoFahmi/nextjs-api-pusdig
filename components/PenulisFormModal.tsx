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

interface Penulis {
  id: number
  name: string
  nationality: string
  birthdate: number
}

interface Props {
  penulis?: Penulis
  trigger: React.ReactNode
  onSubmit: (data: Penulis) => void
}

export default function PenulisFormModal({ penulis, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Penulis>({
    name: penulis?.name || "",
    nationality: penulis?.nationality || "",
    birthdate: penulis?.birthdate || "",
    id: penulis?.id || "",
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
          <DialogTitle>{penulis ? "Edit Penulis" : "Tambah Penulis"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">

          <Input
            name="name"
            placeholder="Nama"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            name="nationality"
            placeholder="Kebangsaan"
            value={form.nationality}
            onChange={handleChange}
          />
          <Input
            name="birthdate"
            placeholder="Tanggal Lahir"
            value={form.birthdate}
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {penulis ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
