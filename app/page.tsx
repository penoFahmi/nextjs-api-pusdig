import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Book, 
  Library, 
  Users, 
  Smartphone, 
  ArrowRight 
} from "lucide-react";

// Komponen utama untuk Homepage
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header / Navigasi */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Book className="h-6 w-6 text-primary" />
          <span>Pusdig</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/katalog" className="text-muted-foreground hover:text-foreground transition-colors">
            Katalog
          </Link>
          <Link href="/tentang" className="text-muted-foreground hover:text-foreground transition-colors">
            Tentang Kami
          </Link>
          <Link href="/bantuan" className="text-muted-foreground hover:text-foreground transition-colors">
            Bantuan
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Daftar</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          <Badge variant="outline" className="mb-4">
            Perpustakaan Digital Generasi Baru
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight max-w-3xl">
            Buka Jendela Dunia, Mulai dari Genggaman Anda
          </h1>
          <p className="max-w-2xl mx-auto my-6 text-lg text-muted-foreground">
            Akses ribuan buku, jurnal, dan koleksi digital lainnya secara gratis. Belajar, teliti, dan temukan pengetahuan baru tanpa batas.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/katalog">
                Jelajahi Katalog <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/tentang">Pelajari Lebih Lanjut</Link>
            </Button>
          </div>
        </section>

        {/* Fitur Utama */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Kenapa Memilih Pusdig?</h2>
              <p className="text-muted-foreground mt-2">Fitur unggulan yang kami tawarkan untuk pengalaman membaca terbaik.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <Library className="h-10 w-10 mx-auto text-primary mb-4" />
                  <CardTitle>Koleksi Lengkap</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Dari buku klasik hingga riset terbaru, temukan semua yang Anda butuhkan di satu tempat.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Smartphone className="h-10 w-10 mx-auto text-primary mb-4" />
                  <CardTitle>Akses Di Mana Saja</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Baca di ponsel, tablet, atau desktop. Perpustakaan kami selalu terbuka 24/7 untuk Anda.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <Users className="h-10 w-10 mx-auto text-primary mb-4" />
                  <CardTitle>Komunitas Pembaca</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Bergabung dengan forum diskusi, berikan ulasan, dan terhubung dengan sesama pecinta buku.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Buku Unggulan */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
           <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Koleksi Terbaru Kami</h2>
              <p className="text-muted-foreground mt-2">Temukan buku-buku menarik yang baru saja kami tambahkan.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {/* Ini adalah data dummy, nantinya bisa diambil dari API */}
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <img src={`https://picsum.photos/id/${i+20}/400/600`} alt={`Book Cover ${i}`} className="w-full h-auto object-cover aspect-[2/3]" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="secondary" asChild>
                <Link href="/katalog">Lihat Semua Koleksi</Link>
              </Button>
            </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-muted border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Pusdig. Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  );
}