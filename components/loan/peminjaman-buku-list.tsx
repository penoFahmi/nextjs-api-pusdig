"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useMemo } from "react";
import { 
  fetchAllLoans, 
  deleteLoan, 
  fetchBuku, 
  fetchUser,
  payFine
} from "@/lib/api"; 
import { Button } from "../ui/button";
import { toast } from "sonner";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "../ui/input";
import PeminjamanFormModal from "./PeminjamanFormModal";
import PengembalianModal from "./PengembalianModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  name: string;
}

interface Book {
  id: string;
  title: string;
  stock: number;
  pivot?: {
    status_buku: 'Baik' | 'Rusak';
  };
}

interface Peminjaman {
  id: string;
  book_id: string;
  user_id: string;
  user: User;
  books: Book[];
  status_peminjaman: 'Dipinjam' | 'Dikembalikan';
  status_denda: 'Lunas' | 'Belum Lunas';
  tanggal_kembali: string;
  denda: number;
}

export default function PeminjamanList() {
  const [loanList, setLoanList] = useState<Peminjaman[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  // BARU: Gunakan useMemo untuk menandai pengguna yang punya tanggungan
  const usersWithStatus = useMemo(() => {
    // 1. Buat Set (kumpulan) ID user yang punya tanggungan untuk pencarian cepat
    const usersWithActiveLoans = new Set();
    loanList.forEach(loan => {
      if (loan.status_peminjaman === 'Dipinjam' || loan.status_denda === 'Belum Lunas') {
        usersWithActiveLoans.add(loan.user_id);
      }
    });

    // 2. Map (ubah) daftar user asli dan tambahkan properti 'can_borrow'
    return users.map(user => ({
      ...user,
      can_borrow: !usersWithActiveLoans.has(user.id) // bisa pinjam jika ID-nya TIDAK ADA di Set
    }));
  }, [loanList, users]); // Kalkulasi ulang hanya jika loanList atau users berubah


  const loadData = async () => {
    setIsLoading(true);
    try {
      const [loanData, booksData, usersData] = await Promise.all([
        fetchAllLoans(),
        fetchBuku(),
        fetchUser(),
      ]);
      setLoanList(loanData);
      setBooks(booksData);
      setUsers(usersData);
    } catch (error: any) {
      toast.error(error.message || "Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteLoan(id);
      toast.success("Data peminjaman berhasil dihapus");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus data.");
    }
  };

  const handlePayFine = async (id: string) => {
    try {
      await payFine(id);
      toast.success("Denda berhasil dibayar!");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Gagal memproses pembayaran.");
    }
  };
  
  const filteredLoans = loanList.filter(item =>
    item.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.books.some(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredLoans.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredLoans.slice(indexOfFirstRow, indexOfLastRow);

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };
  
  // if (isLoading) {
  //   return <div className="p-4 text-center">Memuat data peminjaman...</div>;
  // }

  return (
    <div className="rounded-md border p-4 space-y-4">
      <h2 className="text-xl font-semibold">Manajemen Peminjaman Buku</h2>
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari berdasarkan nama atau judul buku..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
        <PeminjamanFormModal
          users={usersWithStatus}
          books={books}
          onFinished={loadData}
          trigger={<Button className="ml-auto">+ Tambah Peminjaman</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nama Peminjam</TableHead>
            <TableHead>Judul Buku</TableHead>
            <TableHead>Tgl. Kembali</TableHead>
            <TableHead>Denda</TableHead>
            <TableHead>Status Denda</TableHead> 
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRows.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{indexOfFirstRow + index + 1}</TableCell>
              <TableCell>{item.user?.name || "N/A"}</TableCell>
              <TableCell className="max-w-[300px]">{item.books.map(book => book.title).join(", ")}</TableCell>
              <TableCell>{new Date(item.tanggal_kembali).toLocaleDateString("id-ID")}</TableCell>
              <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.denda)}</TableCell>
              <TableCell>
                <Badge variant={item.status_denda === 'Belum Lunas' ? 'destructive' : 'default'}>
                  {item.status_denda}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={item.status_peminjaman === 'Dipinjam' ? 'outline' : 'secondary'}>
                  {item.status_peminjaman}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                {item.status_peminjaman === 'Dipinjam' && (
                  <PengembalianModal
                    peminjaman={item}
                    onFinished={loadData}
                    trigger={<Button className="bg-yellow-500 hover:bg-yellow-600" size="sm">Kembalikan</Button>}
                  />
                )}
                {item.status_peminjaman === 'Dikembalikan' && item.status_denda === 'Belum Lunas' && (
                  <Button onClick={() => handlePayFine(item.id)} className="bg-green-600 hover:bg-green-700" size="sm">
                    Bayar Denda
                  </Button>
                )}
                {item.status_peminjaman === 'Dikembalikan' && item.status_denda === 'Lunas' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">Hapus</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Yakin ingin menghapus data?</AlertDialogTitle>
                        <AlertDialogDescription>Tindakan ini akan menghapus data peminjaman secara permanen.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id)}>Ya, Hapus</AlertDialogAction>
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
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}