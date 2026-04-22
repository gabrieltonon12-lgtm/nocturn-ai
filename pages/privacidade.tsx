import Head from 'next/head'
import Link from 'next/link'

const S = { bg:'#05080F', card:'#080D1A', line:'#192436', red:'#C5183A', t1:'#ECF2FA', t2:'#6E8099', t3:'#364A62' }

export default function Privacidade() {
  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div style={{ marginBottom:'32px' }}>
      <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'17px', fontWeight:700, color:S.t1, marginBottom:'12px', letterSpacing:'-0.02em' }}>{title}</h2>
      <div style={{ color:S.t2, fontSize:'14px', lineHeight:1.8 }}>{children}</div>
    </div>
  )

  return (
    <>
      <Head><title>Política de Privacidade — NOCTURN.AI</title></Head>
      <div style={{ minHeight:'100vh', background:S.bg, color:S.t1, fontFamily:"'Inter',system-ui,sans-serif", padding:'40px 20px' }}>
        <div style={{ maxWidth:'760px', margin:'0 auto' }}>
          <Link href="/" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', color:S.t3, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px', marginBottom:'32px' }}>← Voltar</Link>

          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'40px' }}>
            <div style={{ width:'32px', height:'32px', background:'linear-gradient(135deg,#C5183A,#8B0A22)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, color:'#fff', fontSize:'14px' }}>N</div>
            <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'16px', fontWeight:700, letterSpacing:'-0.03em' }}>NOCTURN.AI</span>
          </div>

          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'28px', fontWeight:800, letterSpacing:'-0.04em', marginBottom:'8px' }}>Política de Privacidade</h1>
          <p style={{ color:S.t3, fontFamily:"'JetBrains Mono',monospace", fontSize:'11px', marginBottom:'40px' }}>Última atualização: Abril de 2025</p>

          <div style={{ background:S.card, border:`1px solid ${S.line}`, borderRadius:'16px', padding:'36px' }}>
            <Section title="1. Dados Coletados">
              <p>Coletamos os seguintes dados ao usar o NOCTURN.AI:</p>
              <ul style={{ marginTop:'8px', paddingLeft:'20px' }}>
                <li><strong style={{ color:S.t1 }}>Dados de cadastro:</strong> nome, endereço de email e senha (armazenada com hash bcrypt)</li>
                <li><strong style={{ color:S.t1 }}>Dados de uso:</strong> prompts enviados, vídeos gerados, créditos consumidos</li>
                <li><strong style={{ color:S.t1 }}>Dados de pagamento:</strong> processados pela Cakto — não armazenamos dados de cartão</li>
                <li><strong style={{ color:S.t1 }}>Dados técnicos:</strong> endereço IP, navegador, para fins de segurança e rate limiting</li>
              </ul>
            </Section>

            <Section title="2. Como Usamos seus Dados">
              <ul style={{ paddingLeft:'20px' }}>
                <li>Fornecer e melhorar o serviço</li>
                <li>Enviar emails transacionais (confirmação, redefinição de senha)</li>
                <li>Enviar comunicações sobre o produto (com opção de cancelamento)</li>
                <li>Detectar e prevenir fraudes e abusos</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </Section>

            <Section title="3. Compartilhamento de Dados">
              <p>Seus dados são compartilhados apenas com:</p>
              <ul style={{ marginTop:'8px', paddingLeft:'20px' }}>
                <li><strong style={{ color:S.t1 }}>OpenAI:</strong> os prompts são enviados para geração de roteiros e áudio</li>
                <li><strong style={{ color:S.t1 }}>Pexels:</strong> consultas de imagens baseadas no seu tema</li>
                <li><strong style={{ color:S.t1 }}>Resend:</strong> para envio de emails transacionais</li>
                <li><strong style={{ color:S.t1 }}>Cakto:</strong> para processamento de pagamentos</li>
                <li><strong style={{ color:S.t1 }}>Upstash Redis:</strong> armazenamento seguro dos dados</li>
              </ul>
              <p style={{ marginTop:'12px' }}>Não vendemos seus dados a terceiros.</p>
            </Section>

            <Section title="4. Retenção de Dados">
              <p>Mantemos seus dados enquanto sua conta estiver ativa. Após cancelamento, os dados são mantidos por 90 dias e então excluídos. Você pode solicitar a exclusão antecipada pelo email de suporte.</p>
            </Section>

            <Section title="5. Segurança">
              <p>Adotamos medidas técnicas para proteger seus dados: senhas com hash bcrypt, comunicação via HTTPS, tokens JWT com expiração, rate limiting contra ataques de força bruta.</p>
            </Section>

            <Section title="6. Seus Direitos (LGPD)">
              <p>Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:</p>
              <ul style={{ marginTop:'8px', paddingLeft:'20px' }}>
                <li>Acessar os dados que temos sobre você</li>
                <li>Corrigir dados incorretos</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar consentimento para comunicações de marketing</li>
                <li>Portabilidade dos seus dados</li>
              </ul>
              <p style={{ marginTop:'12px' }}>Para exercer estes direitos: <strong style={{ color:S.t1 }}>suporte@nocturn-ai.vercel.app</strong></p>
            </Section>

            <Section title="7. Cookies">
              <p>Utilizamos apenas cookies técnicos essenciais (autenticação via JWT em localStorage). Não utilizamos cookies de rastreamento ou publicidade.</p>
            </Section>

            <Section title="8. Contato">
              <p>Dúvidas sobre privacidade: <strong style={{ color:S.t1 }}>suporte@nocturn-ai.vercel.app</strong></p>
            </Section>
          </div>

          <div style={{ textAlign:'center', marginTop:'32px', display:'flex', gap:'24px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/termos" style={{ color:S.t3, fontSize:'13px', fontFamily:"'JetBrains Mono',monospace" }}>Termos de Uso</Link>
            <Link href="/" style={{ color:S.t3, fontSize:'13px', fontFamily:"'JetBrains Mono',monospace" }}>Página inicial</Link>
          </div>
        </div>
      </div>
    </>
  )
}
