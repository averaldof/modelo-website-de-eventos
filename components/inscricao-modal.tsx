"use client"

import { useState } from "react"
import { X, CheckCircle, Loader2 } from "lucide-react"
import type { Evento, Inscricao } from "@/lib/types"
import { saveInscricao } from "@/lib/store"
import { toast } from "sonner"

interface InscricaoModalProps {
  evento: Evento | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function InscricaoModal({
  evento,
  isOpen,
  onClose,
  onSuccess,
}: InscricaoModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    curso: "",
    matricula: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  if (!isOpen || !evento) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.nome.trim()) newErrors.nome = "Informe seu nome"
    if (!formData.email.trim()) {
      newErrors.email = "Informe seu email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalido"
    }
    if (!formData.curso.trim()) newErrors.curso = "Informe seu curso"
    if (!formData.matricula.trim()) newErrors.matricula = "Informe sua matricula"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const inscricao: Inscricao = {
      id: crypto.randomUUID(),
      eventoId: evento.id,
      eventoTitulo: evento.titulo,
      nome: formData.nome,
      email: formData.email,
      curso: formData.curso,
      matricula: formData.matricula,
      status: "pendente",
      createdAt: new Date().toISOString(),
    }

    const result = saveInscricao(inscricao)

    setIsSubmitting(false)

    if (result.success) {
      setShowSuccess(true)
      onSuccess()
    } else {
      toast.error(result.message)
    }
  }

  const handleClose = () => {
    setFormData({ nome: "", email: "", curso: "", matricula: "" })
    setErrors({})
    setShowSuccess(false)
    onClose()
  }

  const dataFormatada = new Date(evento.data).toLocaleDateString("pt-BR")

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-2xl text-gray-500 transition-colors hover:text-gray-900"
          aria-label="Fechar modal"
        >
          <X className="h-6 w-6" />
        </button>

        {showSuccess ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h2 className="text-xl font-bold text-green-800">
              Inscricao realizada!
            </h2>
            <p className="text-sm text-gray-600">
              Sua vaga no evento &quot;{evento.titulo}&quot; foi confirmada.
              Um comprovante foi enviado para seu email.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 rounded-md bg-green-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-700"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <h2 className="pr-8 text-lg font-bold text-[var(--azul-uepa-escuro)]">
              {evento.titulo}
            </h2>
            <p className="mb-5 text-sm text-gray-500">
              {dataFormatada} • {evento.local}
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4 flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-900">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Seu nome completo"
                  className={`rounded-md border-2 px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--azul-uepa)] ${
                    errors.nome ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.nome && (
                  <span className="text-xs text-red-600">{errors.nome}</span>
                )}
              </div>

              <div className="mb-4 flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-900">
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="seu@email.com"
                  className={`rounded-md border-2 px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--azul-uepa)] ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-red-600">{errors.email}</span>
                )}
              </div>

              <div className="mb-4 flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-900">
                  Curso
                </label>
                <input
                  type="text"
                  value={formData.curso}
                  onChange={(e) =>
                    setFormData({ ...formData, curso: e.target.value })
                  }
                  placeholder="Ex: Engenharia de Software"
                  className={`rounded-md border-2 px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--azul-uepa)] ${
                    errors.curso ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.curso && (
                  <span className="text-xs text-red-600">{errors.curso}</span>
                )}
              </div>

              <div className="mb-4 flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-900">
                  Numero de matricula
                </label>
                <input
                  type="text"
                  value={formData.matricula}
                  onChange={(e) =>
                    setFormData({ ...formData, matricula: e.target.value })
                  }
                  placeholder="Ex: 2023001234"
                  className={`rounded-md border-2 px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--azul-uepa)] ${
                    errors.matricula ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.matricula && (
                  <span className="text-xs text-red-600">
                    {errors.matricula}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-md bg-[var(--azul-uepa)] py-3 font-bold text-white transition-colors hover:bg-[var(--azul-uepa-escuro)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processando...
                  </span>
                ) : (
                  "Confirmar inscricao"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
