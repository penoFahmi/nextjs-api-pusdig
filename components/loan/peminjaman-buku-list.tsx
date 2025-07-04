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
  fetchUser,
  fetchBuku,
  fetchPeminjamanBuku,
  deletePeminjamanBuku,
  updatePeminjamanBuku,
  createPeminjamanBuku,
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
import PeminjamanBukuFormModal from "./PeminjamanBukuFormModal";

interface User {
    id: number;
    name: string;
}

interface Buku {
  id: number;
  title: string;
}

interface PeminjamanBuku {
  id: number;
  book_id: string;
  user_id: string;
  book: { title: string };
  user: { name: string };
}

export default function PeminjamanBukuList() {
  const [peminjamanBuku, setPeminjamanBuku] = useState<PeminjamanBuku[]>([]);
  const [buku, setBuku] = useState<Buku[]>([]);
  const [user, setUser] = useState<User[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    fetchPeminjamanBuku().then(setPeminjamanBuku);
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");
      // Ambil semua data secara paralel untuk efisiensi
      const [peminjamanBukuData, bukuData, userData] = await Promise.all([
        fetchPeminjamanBuku(token),
        fetchBuku(token),
        fetchUser(token),
      ]);
      setPeminjamanBuku(peminjamanBukuData);
      setBuku(bukuData);
      setUser(userData);
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
      await deletePeminjamanBuku(id, token);
      setPeminjamanBuku((prev) => prev.filter((u) => u.id !== id));
      toast.success("Peminjaman buku berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus peminjaman buku");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await updatePeminjamanBuku(data.id, data, token);
      const updatedPeminjamanBuku = await fetchPeminjamanBuku();
      setPeminjamanBuku(updatedPeminjamanBuku);

      toast.success("Peminjaman buku berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate peminjaman buku");
    }
  };

  const handleCreate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await createPeminjamanBuku(data, token);
      const updated = await fetchPeminjamanBuku();
      setPeminjamanBuku(updated);
      toast.success("Peminjaman buku berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan peminjaman buku");
    }
  };

  // if (isLoading) {
  //   return <div>Memuat data...</div>;
  // }

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Penulis Buku</h2>
        <PeminjamanBukuFormModal
          peminjamanBuku={peminjamanBuku}
          onSubmit={handleCreate}
          buku={buku}
          user={user}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Judul Buku</TableHead>
            <TableHead>Nama Peminjam Buku</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {peminjamanBuku.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.book?.title || "Data Buku Tidak Ditemukan"}</TableCell>
              <TableCell>{item.user?.name || "Data User Tidak Ditemukan"}</TableCell>
              <TableCell className="text-right space-x-2">
                <PeminjamanBukuFormModal
                  peminjamanBuku={item}
                  onSubmit={handleUpdate}
                  buku={buku}
                  user={user}
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
                        Yakin ingin menghapus data peminjaman ini?
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
