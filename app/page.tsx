"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Users, Monitor, BookOpen } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { InscricaoModal } from "@/components/inscricao-modal"
import type { Evento, CentroFilter } from "@/lib/types"
import { getEventos } from "@/lib/store"

export default function HomePage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [filtro, setFiltro] = useState<CentroFilter>("todos")
  const [busca, setBusca] = useState("")
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null)
  const [modalAberto, setModalAberto] = useState(false)

  useEffect(() => {
    setEventos(getEventos())
  }, [])

  const eventosFiltrados = useMemo(() => {
    let lista = eventos.filter((e) => e.status === "ativo")

    if (filtro !== "todos") {
      lista = lista.filter((e) => e.centro === filtro)
    }

    if (busca) {
      lista = lista.filter((e) =>
        e.titulo.toLowerCase().includes(busca.toLowerCase())
      )
    }

    return lista
  }, [eventos, filtro, busca])

  const handleInscrever = (evento: Evento) => {
    setEventoSelecionado(evento)
    setModalAberto(true)
  }

  const handleSuccess = () => {
    setEventos(getEventos())
  }

  const handleCentroClick = (centro: CentroFilter) => {
    setFiltro(centro)
    document
      .getElementById("proximos-eventos")
      ?.scrollIntoView({ behavior: "smooth" })
  }

  const filtros: { label: string; value: CentroFilter }[] = [
    { label: "Todos", value: "todos" },
    { label: "CCBS", value: "CCBS" },
    { label: "CCNT", value: "CCNT" },
    { label: "CCSE", value: "CCSE" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-8">
        {/* Busca */}
        <section className="w-full">
          <div className="relative mx-auto max-w-xl">
            <input
              type="text"
              placeholder="Pesquise um evento aqui..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-full border-2 border-gray-200 bg-white px-5 py-3 pr-12 text-base outline-none transition-all focus:border-[var(--azul-uepa)] focus:shadow-md"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </span>
          </div>
        </section>

        {/* Proximos Eventos */}
        <section id="proximos-eventos" className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">Proximos eventos</h2>
            <div className="flex flex-wrap gap-2">
              {filtros.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFiltro(f.value)}
                  className={`rounded-full border-2 border-[var(--vermelho-uepa)] px-4 py-1.5 text-sm font-semibold transition-colors ${
                    filtro === f.value
                      ? "bg-[var(--azul-uepa)] text-white"
                      : "bg-transparent text-[var(--azul-uepa)] hover:bg-[var(--azul-uepa)] hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {eventosFiltrados.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eventosFiltrados.map((evento) => (
                <EventCard
                  key={evento.id}
                  evento={evento}
                  onInscrever={handleInscrever}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">
              Nenhum evento encontrado para esta busca.
            </p>
          )}
        </section>

        {/* Como Funciona */}
        <section id="como-funciona" className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-gray-900">Como funciona?</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                numero: 1,
                titulo: "Encontre um evento",
                descricao:
                  "Navegue pelos eventos disponiveis ou use a busca para encontrar algo do seu interesse.",
              },
              {
                numero: 2,
                titulo: "Faca sua inscricao",
                descricao:
                  'Clique em "Inscrever-se" e preencha seus dados: nome, e-mail, curso e matricula.',
              },
              {
                numero: 3,
                titulo: "Participe!",
                descricao:
                  "Compareca no local e horario indicados. Sua vaga esta garantida apos a inscricao.",
              },
            ].map((passo) => (
              <div
                key={passo.numero}
                className="flex flex-col gap-3 rounded-lg bg-white p-6 shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--azul-uepa)] text-lg font-bold text-white">
                  {passo.numero}
                </div>
                <h3 className="font-bold text-gray-900">{passo.titulo}</h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {passo.descricao}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Eventos por Area */}
        <section id="eventos-area" className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-gray-900">Eventos por area</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                centro: "CCBS" as const,
                nome: "CCBS",
                descricao: "Centro de Ciencias Biologicas e da Saude",
                icon: Users,
              },
              {
                centro: "CCNT" as const,
                nome: "CCNT",
                descricao: "Centro de Ciencias Naturais e Tecnologia",
                icon: Monitor,
              },
              {
                centro: "CCSE" as const,
                nome: "CCSE",
                descricao: "Centro de Ciencias Sociais e Educacao",
                icon: BookOpen,
              },
            ].map((item) => (
              <button
                key={item.centro}
                onClick={() => handleCentroClick(item.centro)}
                className="group flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-transparent bg-white p-6 text-center shadow-md transition-all hover:-translate-y-1 hover:border-[var(--azul-uepa-claro)] hover:shadow-lg"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--azul-uepa-claro)] text-[var(--azul-uepa)]">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold">{item.nome}</h3>
                <p className="text-sm text-gray-600">{item.descricao}</p>
                <span className="text-sm font-semibold text-[var(--azul-uepa)]">
                  Ver eventos
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <InscricaoModal
        evento={eventoSelecionado}
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
