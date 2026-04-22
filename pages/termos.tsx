import Head from 'next/head'
import Link from 'next/link'

const S = { bg:'#05080F', card:'#080D1A', line:'#192436', red:'#C5183A', t1:'#ECF2FA', t2:'#6E8099', t3:'#364A62' }

export default function Termos() {
  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div style={{ marginBottom:'32px' }}>
      <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'17px', fontWeight:700, color:S.t1, marginBottom:'12px', letterSpacing:'-0.02em' }}>{title}</h2>
      <div style={{ color:S.t2, fontSize:'14px', lineHeight:1.8 }}>{children}</div>
    </div>
  )

  return (
    <>
      <Head><title>Termos de Uso — NOCTURN.AI</title></Head>
      <div style={{ minHeight:'100vh', background:S.bg, color:S.t1, fontFamily:"'Inter',system-ui,sans-serif", padding:'40px 20px' }}>
        <div style={{ maxWidth:'760px', margin:'0 auto' }}>
          <Link href="/" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:S.t3, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px', marginBottom:'32px' }}>← Voltar</Link>

          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'40px' }}>
            <div style={{ width:'32px', height:'32px', background:'linear-gradient(135deg,#C5183A,#8B0A22)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, color:'#fff', fontSize:'14px' }}>N</div>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'16px', fontWeight:700, letterSpacing:'-0.03em' }}>NOCTURN.AI</span>
          </div>

          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'28px', fontWeight:800, letterSpacing:'-0.04em', marginBottom:'8px' }}>Termos de Uso</h1>
          <p style={{ color:S.t3, fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', marginBottom:'40px' }}>Última atualização: Abril de 2025</p>

          <div style={{ background:S.card, border:`1px solid ${S.line}`, borderRadius:'16px', padding:'36px' }}>
            <Section title="1. Aceitação dos Termos">
              <p>Ao criar uma conta e utilizar o NOCTURN.AI, você concorda com estes Termos de Uso. Se não concordar, não utilize o serviço.</p>
            </Section>

            <Section title="2. Descrição do Serviço">
              <p>O NOCTURN.AI é uma plataforma SaaS que utiliza inteligência artificial (OpenAI GPT-4o e TTS) para geração automatizada de roteiros e narração de vídeos. O serviço é fornecido "como está" e pode sofrer alterações a qualquer momento.</p>
            </Section>

            <Section title="3. Uso Permitido">
              <p>Você pode usar o NOCTURN.AI para:</p>
              <ul style={{ marginTop:'8px', paddingLeft:'20px' }}>
                <li>Criar conteúdo original para canais do YouTube, TikTok e outras plataformas</li>
                <li>Gerar roteiros e narrações para fins comerciais e não comerciais</li>
                <li>Monetizar o conteúdo criado nas plataformas de vídeo</li>
              </ul>
            </Section>

            <Section title="4. Uso Proibido">
              <p>É expressamente proibido:</p>
              <ul style={{ marginTop:'8px', paddingLeft:'20px' }}>
                <li>Criar conteúdo falso ou enganoso sobre pessoas reais</li>
                <li>Gerar material de ódio, discriminatório ou ilegal</li>
                <li>Violar direitos autorais de terceiros</li>
                <li>Compartilhar credenciais de acesso</li>
                <li>Fazer engenharia reversa ou scraping da plataforma</li>
              </ul>
            </Section>

            <Section title="5. Créditos e Pagamentos">
              <p>O serviço funciona por sistema de créditos mensais. Cada vídeo gerado consome 1 crédito. Créditos não utilizados não são transferidos para o mês seguinte. O pagamento é processado pela Cakto.com.br. Oferecemos garantia de reembolso de 7 dias para novos assinantes.</p>
            </Section>

            <Section title="6. Propriedade Intelectual">
              <p>O conteúdo gerado por você através da plataforma é de sua propriedade. A NOCTURN.AI retém direitos sobre a plataforma, interface e tecnologia subjacente. As imagens utilizadas são provenientes do Pexels com licença comercial.</p>
            </Section>

            <Section title="7. Limitação de Responsabilidade">
              <p>O NOCTURN.AI não se responsabiliza por: (a) danos indiretos ou consequentes; (b) perda de receita ou lucros cessantes; (c) conteúdo gerado pela IA que possa violar diretrizes de plataformas terceiras; (d) indisponibilidade temporária do serviço.</p>
            </Section>

            <Section title="8. Cancelamento">
              <p>Você pode cancelar sua assinatura a qualquer momento. O acesso permanece ativo até o fim do período pago. Não há reembolso proporcional após os primeiros 7 dias.</p>
            </Section>

            <Section title="9. Modificações">
              <p>Podemos alterar estes termos com aviso prévio de 15 dias por email. O uso continuado após a data de vigência constitui aceitação das mudanças.</p>
            </Section>

            <Section title="10. Contato">
              <p>Para dúvidas sobre estes termos: <strong style={{ color:S.t1 }}>suporte@nocturn-ai.vercel.app</strong></p>
            </Section>
          </div>

          <div style={{ textAlign:'center', marginTop:'32px', display:'flex', gap:'24px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/privacidade" style={{ color:S.t3, fontSize:'13px', fontFamily:"'JetBrains Mono',monospace" }}>Política de Privacidade</Link>
            <Link href="/" style={{ color:S.t3, fontSize:'13px', fontFamily:"'JetBrains Mono',monospace" }}>Página inicial</Link>
          </div>
        </div>
      </div>
    </>
  )
}
