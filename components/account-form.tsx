"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
// import { update } from "@/lib/api";

type FormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function ProfileForm() {
  const router = useRouter()
  const [user, setUser] = useState<{
    name: string
    email: string
    id: string
    avatar?: string
  } | null>(null)

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Isi default form ketika user terload
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Anda belum login!")
      router.push("/")
      return
    }

    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      form.reset({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        password: "",
        confirmPassword: "",
      })
    }
  }, [router, form])

  const onSubmit = async (data: FormValues) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok.")
      return
    }

    // Kirim data ke server untuk memperbarui profil
    try {
      const response = await fetch("/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Profil berhasil diperbarui.")
      } else {
        toast.error(result.message || "Terjadi kesalahan saat memperbarui profil.")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui profil.")
    }
  }

  if (!user) return null

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Nama Anda" {...field} />
              </FormControl>
              <FormDescription>Masukkan nama lengkap Anda.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email Anda" {...field} />
              </FormControl>
              <FormDescription>Email aktif Anda.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password baru (opsional)" {...field} />
              </FormControl>
              <FormDescription>Isi jika ingin mengganti password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Konfirmasi Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Konfirmasi password" {...field} />
              </FormControl>
              <FormDescription>Pastikan password Anda cocok dengan yang di atas.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Simpan Perubahan</Button>
      </form>
    </Form>
  )
}
