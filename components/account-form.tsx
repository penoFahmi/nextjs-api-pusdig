"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

// Zod Schema for form validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nama harus terdiri dari setidaknya 2 karakter.",
  }),
  email: z.string().email({
    message: "Email tidak valid.",
  }),
  password: z.string().min(6, {
    message: "Password harus terdiri dari setidaknya 6 karakter.",
  }),
})

type FormData = z.infer<typeof formSchema>

export function ProfileForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "John Doe", // default values (you can fetch from API)
      email: "john@example.com",
      password: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    // Logic to handle form submission, like sending data to backend
    console.log("Form submitted:", data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name Field */}
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

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email Anda" {...field} />
              </FormControl>
              <FormDescription>Masukkan email yang valid.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password Baru" {...field} />
              </FormControl>
              <FormDescription>Isi jika ingin mengubah password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Simpan Perubahan</Button>
      </form>
    </Form>
  )
}
