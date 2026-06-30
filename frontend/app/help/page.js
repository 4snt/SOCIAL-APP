import Link from 'next/link'

const topics = [
  ['Como criar uma demanda?', 'Entre na sua conta, selecione “Nova publicação”, descreva o problema com contexto e, se ajudar, anexe uma imagem.'],
  ['Como acompanhar uma demanda?', 'A situação aparece no cartão. Você receberá uma notificação quando um administrador mudar o andamento.'],
  ['Como colaborar?', 'Apoie com uma curtida e use os comentários para acrescentar informações. Comentários abertos são atualizados automaticamente.'],
  ['O que significam os selos?', 'Admin identifica a equipe de moderação. Verificado identifica um perfil institucional da universidade.'],
  ['Como denunciar conteúdo inadequado?', 'Enquanto a denúncia dedicada não está disponível, contate a administração e informe o link da publicação.'],
]

export default function HelpPage() {
  return (
    <main className="space-y-5">
      <section className="card p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#4A4466]">Central de ajuda</p>
        <h1 className="mt-1 text-2xl font-bold">Como usar a UniVoz</h1>
        <p className="mt-2 text-sm text-neutral-600">Orientações rápidas para publicar, acompanhar e colaborar com demandas da comunidade.</p>
      </section>
      <section className="card divide-y divide-neutral-100 px-6">
        {topics.map(([title, answer]) => <details key={title} className="py-4 group"><summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900">{title}<span className="float-right text-neutral-400 group-open:rotate-45">+</span></summary><p className="mt-2 text-sm leading-relaxed text-neutral-600">{answer}</p></details>)}
      </section>
      <Link href="/" className="btn-outline">Voltar ao feed</Link>
    </main>
  )
}
