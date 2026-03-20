"use client"

import { useState, useEffect } from "react"
import { Plus, Calendar, Users, TrendingUp, Edit, Trash2, Eye } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EventoForm } from "@/components/admin/evento-form"
import { InscricoesModal } from "@/components/admin/inscricoes-modal"
import type { Evento } from "@/lib/types"
import { getEventos, deleteEvento, getInscricoes } from "@/lib/store"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


function logout() {
  document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  window.location.href = "/"
}

export default function AdminPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null)
  const [viewingInscricoes, setViewingInscricoes] = useState<Evento | null>(null)
  const router = useRouter()

  useEffect(() => {
  const isLogged = document.cookie.includes("auth=true")

  if (!isLogged) {
    router.push("/login")
    return
  }

  setEventos(getEventos())
}, [])

  const refreshEventos = () => {
    setEventos(getEventos())
  }

  const handleEdit = (evento: Evento) => {
    setEditingEvento(evento)
    setShowForm(true)
  }

  const handleDelete = (evento: Evento) => {
    if (confirm(`Tem certeza que deseja excluir o evento "${evento.titulo}"?`)) {
      deleteEvento(evento.id)
      refreshEventos()
      toast.success("Evento excluido com sucesso!")
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingEvento(null)
    refreshEventos()
  }

  const totalInscricoes = getInscricoes().length
  const eventosAtivos = eventos.filter((e) => e.status === "ativo").length
  const vagasPreenchidas = eventos.reduce((acc, e) => acc + e.vagasOcupadas, 0)

  const centroColors = {
    CCBS: "bg-green-100 text-green-800",
    CCNT: "bg-blue-100 text-blue-800",
    CCSE: "bg-yellow-100 text-yellow-800",
  }

  const statusColors = {
    ativo: "bg-green-100 text-green-800",
    cancelado: "bg-red-100 text-red-800",
    encerrado: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Painel de Administracao
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-[var(--azul-uepa)] px-4 py-2 font-semibold text-white transition-colors hover:bg-[var(--azul-uepa-escuro)]"
          >
            
            <Plus className="h-5 w-5" />
            Novo Evento
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-lg bg-white p-5 shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-[var(--azul-uepa)]">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Eventos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{eventosAtivos}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-white p-5 shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Inscricoes</p>
              <p className="text-2xl font-bold text-gray-900">{totalInscricoes}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-white p-5 shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vagas Preenchidas</p>
              <p className="text-2xl font-bold text-gray-900">{vagasPreenchidas}</p>
            </div>
          </div>
        </div>

        {/* Lista de Eventos */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-900">Gerenciar Eventos</h2>

          <div className="overflow-x-auto rounded-lg bg-white shadow-md">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Evento</th>
                  <th className="px-4 py-3">Centro</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Vagas</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {eventos.map((evento) => (
                  <tr key={evento.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {evento.titulo}
                        </p>
                        <p className="text-xs text-gray-500">{evento.local}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${centroColors[evento.centro]}`}
                      >
                        {evento.centro}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(evento.data).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-[var(--azul-uepa)]"
                            style={{
                              width: `${(evento.vagasOcupadas / evento.vagasTotal) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {evento.vagasOcupadas}/{evento.vagasTotal}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${statusColors[evento.status]}`}
                      >
                        {evento.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewingInscricoes(evento)}
                          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[var(--azul-uepa)]"
                          title="Ver inscricoes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(evento)}
                          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[var(--azul-uepa)]"
                          title="Editar evento"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(evento)}
                          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600"
                          title="Excluir evento"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {eventos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Nenhum evento cadastrado. Clique em &quot;Novo Evento&quot;
                      para comecar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />

      {showForm && (
        <EventoForm
          evento={editingEvento}
          onClose={handleFormClose}
          onSave={handleFormClose}
        />
      )}

      {viewingInscricoes && (
        <InscricoesModal
          evento={viewingInscricoes}
          onClose={() => {
            setViewingInscricoes(null)
            refreshEventos()
          }}
        />
      )}
    </div>
  )
  
}
