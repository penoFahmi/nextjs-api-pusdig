"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { fetchBuku, deleteBuku, updateBuku, createBuku } from "@/lib/api";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import BukuFormModal from "./BukuFormModal";

interface Buku {
  id: number;
  title: string;
  isbn: number;
  publisher: string;
  year_published: number;
  stock: number;
}

export default function BukuList() {
  const [buku, setBuku] = useState<Buku[]>([]);

  useEffect(() => {
    fetchBuku().then(setBuku);
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteBuku(id, token);
      setBuku((prev) => prev.filter((u) => u.id !== id));
      toast.success("Buku berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus buku");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await updateBuku(data.id, data, token);
      const updatedBuku = await fetchBuku();
      setBuku(updatedBuku);

      toast.success("Buku berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate buku");
    }
  };

  const handleCreate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await createBuku(data, token);
      const updated = await fetchBuku();
      setBuku(updated);
      toast.success("Buku berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan buku");
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Buku</h2>
        <BukuFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nama Buku</TableHead>
            <TableHead>Isbn</TableHead>
            <TableHead>Penerbit</TableHead>
            <TableHead>Tahun Diterbitkan</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buku.map((buku, index) => (
            <TableRow key={buku.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{buku.title}</TableCell>
              <TableCell>{buku.isbn}</TableCell>
              <TableCell>{buku.publisher}</TableCell>
              <TableCell>{buku.year_published}</TableCell>
              <TableCell>{buku.stock}</TableCell>
              <TableCell className="text-right space-x-2">
                <BukuFormModal
                  buku={buku}
                  onSubmit={handleUpdate}
                  trigger={
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  }
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Hapus
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Yakin ingin menghapus buku ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang
                        permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(buku.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
