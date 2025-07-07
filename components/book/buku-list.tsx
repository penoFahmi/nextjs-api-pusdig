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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBuku().then(setBuku);
  }, []);

  const filteredBuku = buku.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const totalPages = Math.ceil(filteredBuku.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredBuku.slice(indexOfFirstRow, indexOfLastRow);

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
    setCurrentPage(1);
  };
  
  // BARU: Fungsi untuk menangani perubahan pada input search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Kembali ke halaman pertama setiap kali user mencari
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <h2 className="text-xl font-semibold">Daftar Buku</h2>
      <div className="flex items-center py-4">
         <Input
            placeholder="Cari berdasarkan judul..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
        <BukuFormModal
          onSubmit={handleCreate}
          trigger={<Button
          className="ml-auto"
          >+ Tambah</Button>}
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
          {currentRows.length > 0 ? (
          currentRows.map((buku, index) => (
            <TableRow key={buku.id}>
              <TableCell>{indexOfFirstRow + index + 1}</TableCell>
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
          ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Buku tidak ditemukan.
              </TableCell>
            </TableRow>
          )}
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
          Page {currentPage} of {totalPages > 0 ? totalPages : 1}
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
