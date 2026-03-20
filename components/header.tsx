"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  return (
    <header className="sticky top-0 z-50 bg-[var(--azul-uepa)] text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Eventos UEPA
        </Link>
        <nav className="flex items-center gap-6">
          {!isAdmin && (
            <>
              <a
                href="#proximos-eventos"
                className="text-sm font-medium text-white/85 transition-colors hover:text-white"
              >
                Destaques
              </a>
              <a
                href="#como-funciona"
                className="text-sm font-medium text-white/85 transition-colors hover:text-white"
              >
                Como funciona?
              </a>
              <a
                href="#eventos-area"
                className="text-sm font-medium text-white/85 transition-colors hover:text-white"
              >
                Por area
              </a>
            </>
          )}
        {isAdmin ? (
  <div className="flex items-center gap-3">

    <Link
      href="/"
      className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/20"
    >
      <Settings className="h-4 w-4" />
      Voltar ao Site
    </Link>

    <button
      onClick={() => {
        document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        window.location.href = "/"
      }}
      className="rounded-full bg-[var(--vermelho-uepa)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--vermelho-hover)] transition"
    >
      Sair
    </button>

  </div>
) : (
  <Link
    href="/admin"
    className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/20"
  >
    <Settings className="h-4 w-4" />
    Admin
  </Link>
)}
        </nav>
      </div>
    </header>
  )
}
