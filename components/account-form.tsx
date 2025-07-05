"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { updateUser, deleteAccount } from "@/lib/api";

const accountFormSchema = z
  .object({
    name: z.string().min(3, {
      message: "Nama harus memiliki minimal 3 karakter.",
    }),
    email: z.string().email({
      message: "Silakan masukkan alamat email yang valid.",
    }),
    password: z
      .string()
      .min(6, { message: "Password baru minimal 6 karakter." })
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
  });

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface User {
  id: string;
  name: string;
  email: string;
}

export function AccountSettingsForm() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      toast.error("Anda belum login!");
      router.push("/");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData: User = JSON.parse(storedUser);
      setUser(userData);
      form.reset({
        name: userData.name || "",
        email: userData.email || "",
        password: "",
        confirmPassword: "",
      });
    } else {
      toast.error("Gagal memuat data pengguna.");
    }
    setIsLoading(false);
  }, [router, form]);

  async function onSubmit(data: AccountFormValues) {
    if (!user) return;

    const dataToUpdate: { name: string; email: string; password?: string } = {
      name: data.name,
      email: data.email,
    };

    if (data.password) {
      dataToUpdate.password = data.password;
    }

    toast.info("Memperbarui profil...");
    const token = localStorage.getItem("token");
    try {
      const updatedUserData = await updateUser(user.id, dataToUpdate, token);
      setUser(updatedUserData);
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      toast.success("Profil berhasil diperbarui!");
      form.reset({ ...data, password: "", confirmPassword: "" });
    } catch (err) {
      toast.error("Gagal memperbarui profil.");
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return;

    // Tidak perlu lagi mengirim token dari sini
    toast.info("Menghapus akun...");
    try {
      // Panggil fungsi dengan nama yang sudah benar
      await deleteAccount(user.id);
      toast.success("Akun berhasil dihapus.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/");
    } catch (err) {
      // Menampilkan pesan error dari API
      toast.error(err instanceof Error ? err.message : "Gagal menghapus akun.");
    }
  };

  if (isLoading) {
    return <p>Memuat...</p>;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input placeholder="Nama lengkap Anda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@anda.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Baru (opsional)</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Kosongkan jika tidak ingin ganti"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Konfirmasi Password Baru</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Simpan Perubahan</Button>
        </form>
      </Form>

      <Separator className="my-8" />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-destructive">Hapus Akun</h3>
        <p className="text-sm text-muted-foreground">
          Setelah akun Anda dihapus, semua data akan hilang secara permanen.
          Tindakan ini tidak dapat diurungkan.
        </p>
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
      </div>
    </div>
  );
}