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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "../ui/input";

interface User {
    id: number;
    name: string;
}

interface Buku {
  id: number;
  title: string;
  stock: number;
}

interface PeminjamanBuku {
  id: number;
  book_id: string;
  user_id: string;
  status: 'Dipinjam' | 'Dikembalikan';
  book: { title: string };
  user: { name: string };
}

export default function PeminjamanBukuList() {
  const [peminjamanBuku, setPeminjamanBuku] = useState<PeminjamanBuku[]>([]);
  const [buku, setBuku] = useState<Buku[]>([]);
  const [user, setUser] = useState<User[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPeminjamanBuku = peminjamanBuku.filter((item) =>
    item.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.book?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      loadData();
    } catch (err) {
      toast.error("Gagal menghapus peminjaman buku");
    }
  };

  const handleKembalikan = async (peminjaman: PeminjamanBuku) => {
    const token = localStorage.getItem("token");
    try {
      // Cukup kirim status, tidak perlu seluruh objek
      await updatePeminjamanBuku(peminjaman.id, {
        status: "Dikembalikan",
      }, token);
      
      toast.success("Buku berhasil dikembalikan!");
      loadData(); // Muat ulang semua data untuk sinkronisasi
    } catch (err) {
      toast.error("Gagal mengembalikan buku.");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await updatePeminjamanBuku(data.id, data, token);
      const updatedPeminjamanBuku = await fetchPeminjamanBuku();
      setPeminjamanBuku(updatedPeminjamanBuku);

      toast.success("Peminjaman buku berhasil diupdate");
      loadData();
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
      loadData();
    } catch (err) {
      toast.error("Gagal menambahkan peminjaman buku");
    }
  };

  // if (isLoading) {
  //   return <div>Memuat data...</div>;
  // }

  const totalPages = Math.ceil(peminjamanBuku.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredPeminjamanBuku.slice(indexOfFirstRow, indexOfLastRow);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // Kembali ke halaman pertama setiap kali jumlah baris diubah
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Kembali ke halaman pertama setiap kali user mencari
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
        <h2 className="text-xl font-semibold">Daftar Penulis Buku</h2>
        <div className="flex items-center py-4">
          <Input
                    placeholder="Cari berdasarkan Judul Buku..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="max-w-sm"
          />
        <PeminjamanBukuFormModal
          onSubmit={handleCreate}
          buku={buku}
          user={user}
          trigger={<Button
            className="ml-auto"
          >+ Tambah</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Judul Buku</TableHead>
            <TableHead>Nama Peminjam Buku</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRows.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{indexOfFirstRow + index + 1}</TableCell>
              <TableCell>{item.book?.title || "Data Buku Tidak Ditemukan"}</TableCell>
              <TableCell>{item.user?.name || "Data User Tidak Ditemukan"}</TableCell>
              <TableCell>
                <Badge variant={item.status === 'Dipinjam' ? 'destructive' : 'default'}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <PeminjamanBukuFormModal
                  peminjamanBuku={item}
                  onSubmit={handleUpdate}
                  buku={buku}
                  user={user}
                  trigger={
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled={item.status === 'Dikembalikan'}
                      >
                      Edit
                    </Button>
                  }
                />
                {item.status === 'Dipinjam' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-yellow-300" variant="destructive" size="sm">
                      Kembalikan
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Konfirmasi Pengembalian Buku
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Anda yakin ingin mengembalikan buku ini? Stok buku akan bertambah kembali.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleKembalikan(item)}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        Ya, Kembalikan
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                )}
                {item.status === 'Dikembalikan' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Hapus
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Yakin Ingin Menghapus Data?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini akan menghapus data peminjaman secara permanen. Gunakan ini hanya untuk memperbaiki kesalahan input.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700">
                          Ya, Hapus Permanen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-4 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${rowsPerPage}`}
            onValueChange={handleRowsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={rowsPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
