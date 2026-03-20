export interface Evento {
  id: string
  titulo: string
  centro: "CCBS" | "CCNT" | "CCSE"
  data: string
  horario: string
  local: string
  imagem: string
  descricao: string
  vagasTotal: number
  vagasOcupadas: number
  status: "ativo" | "cancelado" | "encerrado"
  createdAt: string
}

export interface Inscricao {
  id: string
  eventoId: string
  eventoTitulo: string
  nome: string
  email: string
  curso: string
  matricula: string
  status: "pendente" | "confirmada" | "cancelada"
  createdAt: string
}

export type CentroFilter = "todos" | "CCBS" | "CCNT" | "CCSE"
