"use client"

import type { Evento, Inscricao } from "./types"

const EVENTOS_KEY = "eventos_uepa"
const INSCRICOES_KEY = "inscricoes_uepa"

// Eventos iniciais de demonstração
const eventosIniciais: Evento[] = [
  {
    id: "1",
    titulo: "Workshop de Programacao Web",
    centro: "CCNT",
    data: "2024-04-10",
    horario: "14:00",
    local: "Auditorio CCNT",
    imagem: "/images/evento1.jpg",
    descricao: "Aprenda fundamentos de HTML, CSS e JavaScript com professores especializados.",
    vagasTotal: 50,
    vagasOcupadas: 12,
    status: "ativo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    titulo: "Seminario de Saude Coletiva",
    centro: "CCBS",
    data: "2026-05-15",
    horario: "09:00",
    local: "Sala 12 - CCBS",
    imagem: "/images/evento2.jpg",
    descricao: "Discussao sobre politicas publicas e saude no contexto atual.",
    vagasTotal: 30,
    vagasOcupadas: 8,
    status: "ativo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    titulo: "Palestra Educacao e Tecnologia",
    centro: "CCSE",
    data: "2026-05-20",
    horario: "16:00",
    local: "Auditorio CCSE",
    imagem: "/images/evento3.jpg",
    descricao: "Impacto da tecnologia nos metodos de ensino contemporaneos.",
    vagasTotal: 80,
    vagasOcupadas: 25,
    status: "ativo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    titulo: "Mostra Cientifica UEPA",
    centro: "CCNT",
    data: "2026-06-25",
    horario: "10:00",
    local: "Hall Central",
    imagem: "/images/evento4.jpg",
    descricao: "Apresentacao de projetos cientificos dos alunos de graduacao e pos-graduacao.",
    vagasTotal: 100,
    vagasOcupadas: 45,
    status: "ativo",
    createdAt: new Date().toISOString(),
  },
]

export function getEventos(): Evento[] {
  if (typeof window === "undefined") return eventosIniciais
  const stored = localStorage.getItem(EVENTOS_KEY)
  if (!stored) {
    localStorage.setItem(EVENTOS_KEY, JSON.stringify(eventosIniciais))
    return eventosIniciais
  }
  return JSON.parse(stored)
}

export function getEvento(id: string): Evento | undefined {
  const eventos = getEventos()
  return eventos.find((e) => e.id === id)
}

export function saveEvento(evento: Evento): void {
  const eventos = getEventos()
  const index = eventos.findIndex((e) => e.id === evento.id)
  if (index >= 0) {
    eventos[index] = evento
  } else {
    eventos.push(evento)
  }
  localStorage.setItem(EVENTOS_KEY, JSON.stringify(eventos))
}

export function deleteEvento(id: string): void {
  const eventos = getEventos().filter((e) => e.id !== id)
  localStorage.setItem(EVENTOS_KEY, JSON.stringify(eventos))
}

export function getInscricoes(): Inscricao[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(INSCRICOES_KEY)
  if (!stored) return []
  return JSON.parse(stored)
}

export function getInscricoesByEvento(eventoId: string): Inscricao[] {
  return getInscricoes().filter((i) => i.eventoId === eventoId)
}

export function verificarMatriculaInscrita(eventoId: string, matricula: string): boolean {
  const inscricoes = getInscricoesByEvento(eventoId)
  return inscricoes.some((i) => i.matricula === matricula && i.status !== "cancelada")
}

export function saveInscricao(inscricao: Inscricao): { success: boolean; message: string } {
  // Verificar se a matrícula já está inscrita neste evento
  if (verificarMatriculaInscrita(inscricao.eventoId, inscricao.matricula)) {
    return {
      success: false,
      message: "Esta matrícula já possui uma inscrição para este evento.",
    }
  }

  // Verificar se há vagas disponíveis
  const evento = getEvento(inscricao.eventoId)
  if (!evento) {
    return { success: false, message: "Evento não encontrado." }
  }

  if (evento.vagasOcupadas >= evento.vagasTotal) {
    return { success: false, message: "Não há mais vagas disponíveis para este evento." }
  }

  // Salvar inscrição
  const inscricoes = getInscricoes()
  inscricoes.push(inscricao)
  localStorage.setItem(INSCRICOES_KEY, JSON.stringify(inscricoes))

  // Atualizar vagas do evento
  evento.vagasOcupadas++
  saveEvento(evento)

  return { success: true, message: "Inscrição realizada com sucesso!" }
}

export function updateInscricaoStatus(
  inscricaoId: string,
  status: Inscricao["status"]
): void {
  const inscricoes = getInscricoes()
  const index = inscricoes.findIndex((i) => i.id === inscricaoId)
  if (index >= 0) {
    inscricoes[index].status = status
    localStorage.setItem(INSCRICOES_KEY, JSON.stringify(inscricoes))
  }
}

export function deleteInscricao(id: string): void {
  const inscricao = getInscricoes().find((i) => i.id === id)
  if (inscricao) {
    // Decrementar vagas ocupadas se a inscrição não estava cancelada
    if (inscricao.status !== "cancelada") {
      const evento = getEvento(inscricao.eventoId)
      if (evento && evento.vagasOcupadas > 0) {
        evento.vagasOcupadas--
        saveEvento(evento)
      }
    }
  }
  const inscricoes = getInscricoes().filter((i) => i.id !== id)
  localStorage.setItem(INSCRICOES_KEY, JSON.stringify(inscricoes))
}
