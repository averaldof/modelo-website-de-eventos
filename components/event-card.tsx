"use client"

import Image from "next/image"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import type { Evento } from "@/lib/types"

interface EventCardProps {
  evento: Evento
  onInscrever: (evento: Evento) => void
}

const centroColors = {
  CCBS: "bg-green-100 text-green-800",
  CCNT: "bg-blue-100 text-blue-800",
  CCSE: "bg-yellow-100 text-yellow-800",
}

export function EventCard({ evento, onInscrever }: EventCardProps) {
  const vagasDisponiveis = evento.vagasTotal - evento.vagasOcupadas
  const esgotado = vagasDisponiveis <= 0
  const dataFormatada = new Date(evento.data).toLocaleDateString("pt-BR")

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
        <Image
          src={evento.imagem}
          alt={evento.titulo}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <span
          className={`self-start rounded-full px-2.5 py-0.5 text-xs font-bold ${centroColors[evento.centro]}`}
        >
          {evento.centro}
        </span>
        <h3 className="text-base font-bold text-gray-900">{evento.titulo}</h3>
        <p className="flex-1 text-sm leading-relaxed text-gray-600">
          {evento.descricao}
        </p>
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {dataFormatada}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {evento.horario}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {evento.local}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {vagasDisponiveis} vagas disponiveis
          </span>
        </div>
        <button
          onClick={() => onInscrever(evento)}
          disabled={esgotado || evento.status !== "ativo"}
          className="mt-2 rounded-md bg-[var(--vermelho-uepa)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--vermelho-hover)] disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {esgotado ? "Esgotado" : evento.status !== "ativo" ? "Indisponivel" : "Inscrever-se"}
        </button>
      </div>
    </div>
  )
}
