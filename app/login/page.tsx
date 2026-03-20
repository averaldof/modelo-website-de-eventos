"use client"

import { useState } from "react"

export default function Login() {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")

  function handleLogin() {
    if (user === "admin" && pass === "123") {
      document.cookie = "auth=true; path=/"
      window.location.href = "/admin"
    } else {
      alert("Acesso negado")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-background">
      
      {/* fundo com efeito suave */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,58,143,0.15),transparent)] backdrop-blur-sm"></div>

      {/* card */}
      <div className="relative bg-card/80 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-sm border border-border">
        
        <h1 className="text-2xl font-bold text-primary text-center mb-6">
          Painel Admin
        </h1>

        <div className="space-y-4">
          
          <input
            type="text"
            placeholder="Usuário"
            onChange={(e) => setUser(e.target.value)}
            className="w-full p-3 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            placeholder="Senha"
            onChange={(e) => setPass(e.target.value)}
            className="w-full p-3 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-destructive"
          />

          <button
            onClick={handleLogin}
            className="w-full p-3 rounded-md bg-destructive text-primary-foreground font-semibold hover:opacity-90 transition"
          >
            Entrar
          </button>

        </div>

        <p className="text-muted-foreground text-sm text-center mt-4">
          Acesso restrito
        </p>

      </div>
    </div>
  )
}