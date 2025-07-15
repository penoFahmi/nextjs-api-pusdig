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
import { fetchPenulis, deletePenulis, updatePenulis, createPenulis, importAuthor } from "@/lib/api";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { useRef } from "react";

interface Penulis {
  id: number;
  name: string;
  nationality: string;
  birthdate: number;
}

export default function PenulisList() {
  const [penulis, setPenulis] = useState<Penulis[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null); 

  const filteredPenulis = penulis.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const totalPages = Math.ceil(filteredPenulis.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredPenulis.slice(indexOfFirstRow, indexOfLastRow);

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

  // Fungsi untuk menangani upload file
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file); // 'file' harus cocok dengan yang di Laravel

    try {
      await importAuthor(formData, token);
      toast.success("File berhasil diimpor! Memuat ulang data...");
      
      // Muat ulang data untuk menampilkan buku baru
      const updated = await fetchPenulis();
      setPenulis(updated);

    } catch (err: any) {
    toast.error(err.message);
  }

    // Reset input file agar bisa memilih file yang sama lagi
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // BARU: Fungsi untuk memicu klik pada input file
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
        <h2 className="text-xl font-semibold">Daftar Penulis</h2>
        <div className="flex items-center py-4">
          <Input
            placeholder="Cari berdasarkan Nama Penulis..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="max-w-sm"
           />
        <div className="ml-auto flex items-center space-x-2">
                  <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".xlsx, .csv"
                 />
                  <Button variant="outline" onClick={handleImportClick}>
                    Impor Excel
                  </Button>
        <PenulisFormModal
          onSubmit={handleCreate}
          trigger={<Button className="ml-auto">+ Tambah</Button>}
        />
        </div>
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
          {currentRows.length > 0 ? (
          currentRows.map((penulis, index) => (
            <TableRow key={penulis.id}>
              <TableCell>{indexOfFirstRow + index + 1}</TableCell>
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
