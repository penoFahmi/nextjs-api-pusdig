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
import { 
  fetchPenulisBuku, 
  deletePenulisBuku, 
  updatePenulisBuku, 
  createPenulisBuku,
  fetchBuku,
  fetchPenulis,
} from "@/lib/api";
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
import PenulisBukuFormModal from "./PenulisBukuFormModal";

interface Buku {
  id: number;
  title: string;
}

interface Penulis {
  id: number;
  name: string;
}
interface PenulisBuku {
  id: number;
  book_id: string;
  author_id: string;
  book: { title: string };
  author: { name: string };
}

export default function PenulisBukuList() {
  const [penulisBuku, setPenulisBuku] = useState<PenulisBuku[]>([]);
  const [buku, setBuku] = useState<Buku[]>([]);
  const [penulis, setPenulis] = useState<Penulis[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    fetchPenulisBuku().then(setPenulisBuku);
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");
      // Ambil semua data secara paralel untuk efisiensi
      const [penulisBukuData, bukuData, penulisData] = await Promise.all([
        fetchPenulisBuku(token),
        fetchBuku(token),
        fetchPenulis(token),
      ]);
      setPenulisBuku(penulisBukuData);
      setBuku(bukuData);
      setPenulis(penulisData);
    } catch (error) {
      toast.error("Gagal memuat data dari server.");
      console.error(error);
    } 
    // finally {
    //   setIsLoading(false);
    // }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deletePenulisBuku(id, token);
      setPenulisBuku((prev) => prev.filter((u) => u.id !== id));
      toast.success("Penulis buku berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus penulis buku");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await updatePenulisBuku(data.id, data, token);
      const updatedPenulisBuku = await fetchPenulisBuku();
      setPenulisBuku(updatedPenulisBuku);

      toast.success("Penulis buku berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate penulis buku");
    }
  };

  const handleCreate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await createPenulisBuku(data, token);
      const updated = await fetchPenulisBuku();
      setPenulisBuku(updated);
      toast.success("Penulis buku berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan penulis buku");
    }
  };

  // if (isLoading) {
  //   return <div>Memuat data...</div>;
  // }

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Penulis Buku</h2>
        <PenulisBukuFormModal
          onSubmit={handleCreate}
          buku={buku}
          penulis={penulis}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Judul Buku</TableHead>
            <TableHead>Nama Penulis</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {penulisBuku.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.book?.title || "Data Buku Tidak Ditemukan"}</TableCell>
              <TableCell>{item.author?.name || "Data Penulis Tidak Ditemukan"}</TableCell>
              <TableCell className="text-right space-x-2">
                <PenulisBukuFormModal
                  penulisBuku={item}
                  onSubmit={handleUpdate}
                  buku={buku}
                  penulis={penulis}
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
                        onClick={() => handleDelete(item.id)}
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
