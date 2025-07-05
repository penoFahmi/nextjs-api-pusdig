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
import { fetchPenulis, deletePenulis, updatePenulis, createPenulis } from "@/lib/api";
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
import PenulisFormModal from "./PenulisFormModal";

interface Penulis {
  id: number;
  name: string;
  nationality: string;
  birthdate: number;
}

export default function PenulisList() {
  const [penulis, setPenulis] = useState<Penulis[]>([]);

  useEffect(() => {
    fetchPenulis().then(setPenulis);
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deletePenulis(id, token);
      setPenulis((prev) => prev.filter((u) => u.id !== id));
      toast.success("Penulis berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus penulis");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await updatePenulis(data.id, data, token);
      const updatedPenulis = await fetchPenulis();
      setPenulis(updatedPenulis);

      toast.success("Penulis berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate penulis");
    }
  };

  const handleCreate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await createPenulis(data, token);
      const updated = await fetchPenulis();
      setPenulis(updated);
      toast.success("Penulis berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan penulis");
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Penulis</h2>
        <PenulisFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nama Penulis</TableHead>
            <TableHead>Negara</TableHead>
            <TableHead>Tanggal Lahir</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {penulis.map((penulis, index) => (
            <TableRow key={penulis.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{penulis.name}</TableCell>
              <TableCell>{penulis.nationality}</TableCell>
              <TableCell>{penulis.birthdate}</TableCell>
              <TableCell className="text-right space-x-2">
                <PenulisFormModal
                  penulis={penulis}
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
                        Yakin ingin menghapus penulis ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang
                        permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(penulis.id)}
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
