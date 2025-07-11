"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
// UBAH: Impor fungsi API yang baru dan benar untuk admin
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
import PeminjamanFormModal from "./PeminjamanFormModal"; // Modal untuk membuat peminjaman
import PengembalianModal from "./PengembalianModal"; // BARU: Modal khusus untuk pengembalian

// UBAH: Interface disesuaikan dengan struktur data backend BARU
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
  book: Book[];
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
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk memuat semua data yang dibutuhkan oleh admin
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

  // Handler untuk menghapus data peminjaman
  const handleDelete = async (id: string) => {
    try {
      await deleteLoan(id);
      toast.success("Data peminjaman berhasil dihapus");
      loadData(); // Muat ulang data setelah sukses
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus data.");
    }
  };

    const handlePayFine = async (id: string) => {
    try {
      await payFine(id);
      toast.success("Denda berhasil dibayar!");
      loadData(); // Muat ulang data untuk update status
    } catch (error: any) {
      toast.error(error.message || "Gagal memproses pembayaran.");
    }
  };
  
  // Filter data berdasarkan pencarian
  const filteredLoans = loanList.filter(item =>
    item.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.books.some(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return <div className="p-4">Memuat data peminjaman...</div>;
  }

  return (
    <div className="rounded-md border p-4 space-y-4">
      <h2 className="text-xl font-semibold">Manajemen Peminjaman Buku</h2>
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari berdasarkan nama atau judul buku..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <PeminjamanFormModal
          users={users}
          books={books}
          onFinished={loadData} // Panggil loadData setelah modal selesai
          trigger={<Button className="ml-auto">+ Tambah Peminjaman</Button>}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
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
          {filteredLoans.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.user?.name || "N/A"}</TableCell>
              <TableCell className="max-w-[300px]">{item.books.map(book => book.title).join(", ")}</TableCell>
              <TableCell>{new Date(item.tanggal_kembali).toLocaleDateString("id-ID")}</TableCell>
              <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.denda)}</TableCell>
              <TableCell>
                <Badge variant={item.status_peminjaman === 'Dipinjam' ? 'destructive' : 'default'}>
                  {item.status_peminjaman}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={item.status_denda === 'Belum Lunas' ? 'outline' : 'secondary'}>
                  {item.status_denda}
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
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Hapus</Button></AlertDialogTrigger>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}