"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateUser, deleteUser } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

export function AccountSettingsForm() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Anda belum login!");
      router.push("/");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // FIX 1: Mengisi state formData dengan data user yang ada
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        password: "",
        confirmPassword: "",
      });
    } else {
      toast.error("Gagal memuat data pengguna.");
    }
    setIsLoading(false);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Password baru dan konfirmasi tidak cocok.");
      return;
    }

    const dataToUpdate: { name: string; email: string; password?: string } = {
      name: formData.name,
      email: formData.email,
    };
    if (formData.password) {
      dataToUpdate.password = formData.password;
    }

    toast.info("Memperbarui profil...");
    const token = localStorage.getItem("token");
    try {
      // FIX 3: Menggunakan user.id dan dataToUpdate yang benar
      const updatedUserData = await updateUser(user.id, dataToUpdate, token);

      // Update state dan localStorage dengan data baru
      setUser(updatedUserData);
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      toast.success("Profil berhasil diperbarui!");
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      toast.error("Gagal memperbarui profil.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return; // Guard clause
    const token = localStorage.getItem("token");
    toast.info("Menghapus akun...");
    try {
      // FIX 2: Mengirim user.id ke fungsi deleteUser
      await deleteUser(user.id, token);

      toast.success("Akun berhasil dihapus.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/");
    } catch (err) {
      toast.error("Gagal menghapus akun.");
    }
  };

  if (isLoading) {
    return <p>Memuat...</p>;
  }

  if (!user) {
    return <p>Gagal memuat data pengguna.</p>;
  }

  return (
    <Card className="w-full max-w-2xl">
      <form onSubmit={handleUpdateSubmit}>
        <CardHeader>
          <CardTitle>Profil Pengguna</CardTitle>
          <CardDescription>
            Perbarui informasi profil dan password Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password Baru (opsional)</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Kosongkan jika tidak ingin ganti"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <div className="space-y-4">
        <CardFooter>
          <Button type="submit">Simpan Perubahan</Button>
        </CardFooter>
        </div>
      </form>

      <Separator className="my-4" />

      <CardHeader>
        <CardTitle className="text-destructive">Hapus Akun</CardTitle>
        <CardDescription>Tindakan ini tidak dapat diurungkan.</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Hapus Akun Saya</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Ini akan menghapus akun Anda secara permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Ya, Hapus Akun
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}