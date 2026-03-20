export function Footer() {
  return (
    <footer className="bg-[var(--azul-uepa-escuro)] text-white/80">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 border-b border-white/10 px-4 py-10 md:grid-cols-3">
        <div>
          <h4 className="mb-3 text-sm font-bold text-white">Eventos UEPA</h4>
          <p className="text-sm leading-relaxed">
            Portal de divulgacao e inscricao nos eventos da Universidade do
            Estado do Para.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold text-white">Centros</h4>
          <ul className="space-y-1 text-sm">
            <li>CCBS — Ciencias Biologicas e da Saude</li>
            <li>CCNT — Ciencias Naturais e Tecnologia</li>
            <li>CCSE — Ciencias Sociais e Educacao</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold text-white">Contato</h4>
          <p className="text-sm leading-relaxed">
            Universidade do Estado do Para
            <br />
            Belem — PA
            <br />
            eventos@uepa.br
          </p>
        </div>
      </div>
      <div className="py-4 text-center text-xs text-white/50">
        <p>
          &copy; 2025 UEPA — Universidade do Estado do Para. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  )
}
