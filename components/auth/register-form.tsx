"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api"; 
import { toast } from "sonner";
import Link from "next/link"; 

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      toast.error("Registrasi Gagal", {
        description: "Password dan konfirmasi password tidak cocok.",
      });
      return;
    }

    try {
      await register(name, email, password, passwordConfirmation);

      toast.success("Registrasi berhasil!", {
        description: "Akun Anda telah dibuat. Silakan login untuk melanjutkan.",
      });

      setTimeout(() => {
        router.push("/"); // Arahkan ke halaman login setelah berhasil
      }, 2000);
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      let description = "Terjadi kesalahan saat registrasi.";

      if (errors) {
        const firstErrorKey = Object.keys(errors)[0];
        description = errors[firstErrorKey][0];
      }
      
      toast.error("Registrasi Gagal", {
        description: description,
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              
              {/* --- PERUBAHAN TEKS DI SINI --- */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Daftar Akun Baru</h1>
                <p className="text-muted-foreground text-balance">
                  Selamat datang! Silakan isi data Anda untuk membuat akun.
                </p>
              </div>
              {/* --- AKHIR PERUBAHAN TEKS --- */}

              <div className="grid gap-3">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Ulangi password Anda"
                  required
                />
              </div>

              {/* --- PERUBAHAN TEKS TOMBOL --- */}
              <Button type="submit" className="w-full">
                Buat Akun
              </Button>
              {/* --- AKHIR PERUBAHAN --- */}
              
              <div className="text-center text-sm">
                Sudah punya akun?{" "}
                <Link href="/" className="underline underline-offset-4">
                  Masuk di sini
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="././pusdig.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}