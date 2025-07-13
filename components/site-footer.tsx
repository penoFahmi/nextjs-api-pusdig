// components/site-footer.tsx

export function SiteFooter() {
  return (
    <footer className="border-t py-4">
      <div className="container mx-auto flex items-center justify-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Pusdig. Hak Cipta Tidak Dilindungi.</p>
      </div>
    </footer>
  )
}