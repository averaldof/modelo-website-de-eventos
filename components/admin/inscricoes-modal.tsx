"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, XCircle, Mail, Trash2, Loader2 } from "lucide-react"
import type { Evento, Inscricao } from "@/lib/types"
import {
  getInscricoesByEvento,
  updateInscricaoStatus,
  deleteInscricao,
} from "@/lib/store"
import { toast } from "sonner"
import { enviarComprovante } from "@/lib/email"

interface InscricoesModalProps {
  evento: Evento
  onClose: () => void
}

export function InscricoesModal({ evento, onClose }: InscricoesModalProps) {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)

  useEffect(() => {
    setInscricoes(getInscricoesByEvento(evento.id))
  }, [evento.id])

  const refreshInscricoes = () => {
    setInscricoes(getInscricoesByEvento(evento.id))
  }

  const handleConfirmar = async (inscricao: Inscricao) => {
    setSendingEmail(inscricao.id)
    
    // Atualizar status
    updateInscricaoStatus(inscricao.id, "confirmada")
    
    // Enviar email
    const resultado = await enviarComprovante(inscricao, evento)
    
    setSendingEmail(null)
    
    if (resultado.success) {
      toast.success(`Inscricao confirmada! Comprovante enviado para ${inscricao.email}`)
    } else {
      toast.error("Inscricao confirmada, mas houve erro ao enviar email.")
    }
    
    refreshInscricoes()
  }

  const handleCancelar = (inscricao: Inscricao) => {
    updateInscricaoStatus(inscricao.id, "cancelada")
    toast.info("Inscricao cancelada")
    refreshInscricoes()
  }

  const handleDelete = (inscricao: Inscricao) => {
    if (confirm("Tem certeza que deseja excluir esta inscricao?")) {
      deleteInscricao(inscricao.id)
      toast.success("Inscricao excluida")
      refreshInscricoes()
    }
  }

  const handleReenviarEmail = async (inscricao: Inscricao) => {
    setSendingEmail(inscricao.id)
    const resultado = await enviarComprovante(inscricao, evento)
    setSendingEmail(null)
    
    if (resultado.success) {
      toast.success(`Comprovante reenviado para ${inscricao.email}`)
    } else {
      toast.error("Erro ao reenviar comprovante")
    }
  }

  const statusColors = {
    pendente: "bg-yellow-100 text-yellow-800",
    confirmada: "bg-green-100 text-green-800",
    cancelada: "bg-red-100 text-red-800",
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--azul-uepa-escuro)]">
              Inscricoes
            </h2>
            <p className="text-sm text-gray-500">{evento.titulo}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 transition-colors hover:text-gray-900"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {inscricoes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b text-xs uppercase text-gray-500">
                  <tr>
                    <th className="pb-3 pr-4">Participante</th>
                    <th className="pb-3 pr-4">Curso</th>
                    <th className="pb-3 pr-4">Matricula</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-center">Acoes</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {inscricoes.map((inscricao) => (
                    <tr key={inscricao.id} className="hover:bg-gray-50">
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {inscricao.nome}
                          </p>
                          <p className="text-xs text-gray-500">
                            {inscricao.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        {inscricao.curso}
                      </td>
                      <td className="py-3 pr-4 font-mono text-gray-600">
                        {inscricao.matricula}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${statusColors[inscricao.status]}`}
                        >
                          {inscricao.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-center gap-1">
                          {inscricao.status === "pendente" && (
                            <>
                              <button
                                onClick={() => handleConfirmar(inscricao)}
                                disabled={sendingEmail === inscricao.id}
                                className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-green-100 hover:text-green-600 disabled:opacity-50"
                                title="Confirmar e enviar comprovante"
                              >
                                {sendingEmail === inscricao.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleCancelar(inscricao)}
                                className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600"
                                title="Cancelar inscricao"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {inscricao.status === "confirmada" && (
                            <button
                              onClick={() => handleReenviarEmail(inscricao)}
                              disabled={sendingEmail === inscricao.id}
                              className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-blue-100 hover:text-blue-600 disabled:opacity-50"
                              title="Reenviar comprovante por email"
                            >
                              {sendingEmail === inscricao.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Mail className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(inscricao)}
                            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600"
                            title="Excluir inscricao"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500">
                Nenhuma inscricao registrada para este evento.
              </p>
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Total: {inscricoes.length} inscricao(es) •{" "}
              {inscricoes.filter((i) => i.status === "confirmada").length}{" "}
              confirmada(s)
            </p>
            <button
              onClick={onClose}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
