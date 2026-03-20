import type { Inscricao, Evento } from "./types"

export interface EmailResult {
  success: boolean
  message: string
}

/**
 * Envia o comprovante de inscricao por email
 * 
 * Nota: Esta e uma implementacao simulada para demonstracao.
 * Em producao, voce deveria integrar com um servico de email como:
 * - Resend (resend.com)
 * - SendGrid
 * - Amazon SES
 * - Nodemailer
 */
export async function enviarComprovante(
  inscricao: Inscricao,
  evento: Evento
): Promise<EmailResult> {
  // Simular delay de envio de email
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Gerar conteudo do comprovante
  const comprovante = gerarConteudoComprovante(inscricao, evento)

  // Em producao, aqui voce faria a chamada para API de email
  // Exemplo com Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'eventos@uepa.br',
  //   to: inscricao.email,
  //   subject: `Comprovante de Inscricao - ${evento.titulo}`,
  //   html: comprovante.html,
  // })

  console.log("=== COMPROVANTE DE INSCRICAO ===")
  console.log(`Para: ${inscricao.email}`)
  console.log(`Assunto: Comprovante de Inscricao - ${evento.titulo}`)
  console.log("--- Conteudo ---")
  console.log(comprovante.text)
  console.log("================================")

  // Simular sucesso (em producao, verificar resposta da API)
  return {
    success: true,
    message: `Comprovante enviado para ${inscricao.email}`,
  }
}

function gerarConteudoComprovante(inscricao: Inscricao, evento: Evento) {
  const dataFormatada = new Date(evento.data).toLocaleDateString("pt-BR")

  const text = `
COMPROVANTE DE INSCRICAO
========================

Evento: ${evento.titulo}
Data: ${dataFormatada}
Horario: ${evento.horario}
Local: ${evento.local}
Centro: ${evento.centro}

DADOS DO PARTICIPANTE
---------------------
Nome: ${inscricao.nome}
Email: ${inscricao.email}
Curso: ${inscricao.curso}
Matricula: ${inscricao.matricula}

Status: CONFIRMADA
Codigo de Inscricao: ${inscricao.id.slice(0, 8).toUpperCase()}

========================
Universidade do Estado do Para
Portal de Eventos UEPA
eventos@uepa.br
`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8f9fa; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .header { background: #003a8f; color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .content { padding: 30px; }
    .evento-info { background: #e6eefc; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .evento-info h2 { margin: 0 0 15px; color: #003a8f; font-size: 18px; }
    .evento-info p { margin: 5px 0; color: #333; }
    .participante-info { margin-bottom: 20px; }
    .participante-info h3 { color: #003a8f; font-size: 16px; margin: 0 0 15px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px; }
    .participante-info p { margin: 8px 0; color: #555; }
    .participante-info strong { color: #333; }
    .status { background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; text-align: center; font-weight: bold; margin-bottom: 20px; }
    .codigo { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
    .codigo span { font-family: monospace; font-size: 20px; letter-spacing: 2px; color: #003a8f; }
    .footer { background: #002b6b; color: rgba(255,255,255,0.8); padding: 20px; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Eventos UEPA</h1>
      <p>Comprovante de Inscricao</p>
    </div>
    <div class="content">
      <div class="evento-info">
        <h2>${evento.titulo}</h2>
        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Horario:</strong> ${evento.horario}</p>
        <p><strong>Local:</strong> ${evento.local}</p>
        <p><strong>Centro:</strong> ${evento.centro}</p>
      </div>
      
      <div class="participante-info">
        <h3>Dados do Participante</h3>
        <p><strong>Nome:</strong> ${inscricao.nome}</p>
        <p><strong>Email:</strong> ${inscricao.email}</p>
        <p><strong>Curso:</strong> ${inscricao.curso}</p>
        <p><strong>Matricula:</strong> ${inscricao.matricula}</p>
      </div>
      
      <div class="status">
        INSCRICAO CONFIRMADA
      </div>
      
      <div class="codigo">
        <p style="margin: 0 0 5px; color: #666; font-size: 12px;">Codigo de Inscricao</p>
        <span>${inscricao.id.slice(0, 8).toUpperCase()}</span>
      </div>
      
      <p style="text-align: center; color: #666; font-size: 14px;">
        Apresente este comprovante no dia do evento.
      </p>
    </div>
    <div class="footer">
      <p>Universidade do Estado do Para</p>
      <p>Portal de Eventos UEPA</p>
    </div>
  </div>
</body>
</html>
`

  return { text, html }
}
