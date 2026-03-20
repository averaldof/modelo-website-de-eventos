"use client"

import { useState } from "react"
import { X, Loader2, Upload } from "lucide-react"
import type { Evento } from "@/lib/types"
import { saveEvento } from "@/lib/store"
import { toast } from "sonner"

interface EventoFormProps {
  evento: Evento | null
  onClose: () => void
  onSave: () => void
}

export function EventoForm({ evento, onClose, onSave }: EventoFormProps) {
  const [formData, setFormData] = useState<Omit<Evento, "id" | "createdAt">>({
    titulo: evento?.titulo || "",
    centro: evento?.centro || "CCNT",
    data: evento?.data || "",
    horario: evento?.horario || "",
    local: evento?.local || "",
    imagem: evento?.imagem || "/images/evento-default.jpg",
    descricao: evento?.descricao || "",
    vagasTotal: evento?.vagasTotal || 50,
    vagasOcupadas: evento?.vagasOcupadas || 0,
    status: evento?.status || "ativo",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.titulo.trim()) newErrors.titulo = "Titulo obrigatorio"
    if (!formData.data) newErrors.data = "Data obrigatoria"
    if (!formData.horario) newErrors.horario = "Horario obrigatorio"
    if (!formData.local.trim()) newErrors.local = "Local obrigatorio"
    if (!formData.descricao.trim()) newErrors.descricao = "Descricao obrigatoria"
    if (formData.vagasTotal < 1) newErrors.vagasTotal = "Minimo 1 vaga"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const eventoToSave: Evento = {
      ...formData,
      id: evento?.id || crypto.randomUUID(),
      createdAt: evento?.createdAt || new Date().toISOString(),
    }

    saveEvento(eventoToSave)
    setIsSubmitting(false)
    toast.success(evento ? "Evento atualizado!" : "Evento criado!")
    onSave()
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 transition-colors hover:text-gray-900"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-6 text-xl font-bold text-[var(--azul-uepa-escuro)]">
          {evento ? "Editar Evento" : "Novo Evento"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-900">
              Titulo do evento
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
              placeholder="Ex: Workshop de Programacao"
              className={`rounded-md border-2 px-3 py-2 text-sm outline-none focus:border-[var(--azul-uepa)] ${
                errors.titulo ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.titulo && (
              <span className="text-xs text-red-600">{errors.titulo}</span>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-900">Centro</label>
              <select
                value={formData.centro}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    centro: e.target.value as Evento["centro"],
                  })
                }
                className="rounded-md border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--azul-uepa)]"
              >
                <option value="CCBS">CCBS</option>
                <option value="CCNT">CCNT</option>
                <option value="CCSE">CCSE</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-900">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Evento["status"],
                  })
                }
                className="rounded-md border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--azul-uepa)]"
              >
                <option value="ativo">Ativo</option>
                <option value="cancelado">Cancelado</option>
                <option value="encerrado">Encerrado</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-900">Data</label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) =>
                  setFormData({ ...formData, data: e.target.value })
                }
                className={`rounded-md border-2 px-3 py-2 text-sm outline-none focus:border-[var(--azul-uepa)] ${
                  errors.data ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.data && (
                <span className="text-xs text-red-600">{errors.data}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-900">
                Horario
              </label>
              <input
                type="time"
                value={formData.horario}
                onChange={(e) =>
                  setFormData({ ...formData, horario: e.target.value })
                }
                className={`rounded-md border-2 px-3 py-2 text-sm outline-none focus:border-[var(--azul-uepa)] ${
                  errors.horario ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.horario && (
                <span className="text-xs text-red-600">{errors.horario}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-900">Local</label>
            <input
              type="text"
              value={formData.local}
              onChange={(e) =>
                setFormData({ ...formData, local: e.target.value })
              }
              placeholder="Ex: Auditorio CCNT"
              className={`rounded-md border-2 px-3 py-2 text-sm outline-none focus:border-[var(--azul-uepa)] ${
                errors.local ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.local && (
              <span className="text-xs text-red-600">{errors.local}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-900">
              URL da imagem
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.imagem}
                onChange={(e) =>
                  setFormData({ ...formData, imagem: e.target.value })
                }
                placeholder="/images/evento.jpg"
                className="flex-1 rounded-md border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--azul-uepa)]"
              />
              <button
                type="button"
                className="flex items-center gap-1 rounded-md border-2 border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
              >
                <Upload className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-900">
              Descricao
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              placeholder="Descreva o evento..."
              rows={3}
              className={`resize-none rounded-md border-2 px-3 py-2 text-sm outline-none focus:border-[var(--azul-uepa)] ${
                errors.descricao ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.descricao && (
              <span className="text-xs text-red-600">{errors.descricao}</span>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-900">
                Total de vagas
              </label>
              <input
                type="number"
                min={1}
                value={formData.vagasTotal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vagasTotal: parseInt(e.target.value) || 1,
                  })
                }
                className={`rounded-md border-2 px-3 py-2 text-sm outline-none focus:border-[var(--azul-uepa)] ${
                  errors.vagasTotal ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.vagasTotal && (
                <span className="text-xs text-red-600">{errors.vagasTotal}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-900">
                Vagas ocupadas
              </label>
              <input
                type="number"
                min={0}
                max={formData.vagasTotal}
                value={formData.vagasOcupadas}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vagasOcupadas: parseInt(e.target.value) || 0,
                  })
                }
                className="rounded-md border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--azul-uepa)]"
              />
            </div>
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border-2 border-gray-200 py-2.5 font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[var(--azul-uepa)] py-2.5 font-semibold text-white transition-colors hover:bg-[var(--azul-uepa-escuro)] disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : evento ? (
                "Atualizar"
              ) : (
                "Criar Evento"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
