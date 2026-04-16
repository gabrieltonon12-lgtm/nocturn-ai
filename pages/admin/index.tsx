import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const C = {
  bg: '#02040A', base: '#05080F', layer: '#080D1A', card: '#0C1222',
  raised: '#101828', line: '#192436', lineHi: '#203050',
  red: '#C5183A', redDim: 'rgba(197,24,58,.09)', redGlow: 'rgba(197,24,58,.18)',
  green: '#059669', gDim: 'rgba(5,150,105,.1)',
  violet: '#7C3AED', vDim: 'rgba(124,58,237,.1)',
  amber: '#D97706', aDim: 'rgba(217,119,6,.1)',
  t1: '#ECF2FA', t2: '#6E8099', t3: '#364A62',
}
const F = { body: "'Inter',system-ui,sans-serif", head: "'Space Grotesk',system-ui,sans-serif", mono: "'JetBrains Mono',monospace" }

function MiniBarChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data)
  const max = Math.max(...entries.map(([,v]) => v), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '60px', padding: '0 4px' }}>
      {entries.map(([label, val], i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '100%', background: C.redDim, borderRadius: '3px', position: 'relative', height: '48px', display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ width: '100%', background: `linear-gradient(to top,${C.red},rgba(197,24,58,.4))`, borderRadius: '3px', height: `${(val / max) * 100}%`, minHeight: val > 0 ? '4px' : '0', transition: 'height .5s ease' }}/>
          </div>
          <span style={{ fontFamily: F.mono, fontSize: '8px', color: C.t3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

export default function Admin() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState<any>({ mrr: 0, totalUsers: 0, activeUsers: 0, videosToday: 0, totalVideos: 0, churn: 2.1, newUsers7d: 0, byPlan: {}, videosByDay: {} })
  const [view, setView] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [actionUser, setActionUser] = useState<any>(null)
  const [actionLoading, setActionLoading] = useState('')
  const [toast, setToast] = useState('')
  const [addCreditsVal, setAddCreditsVal] = useState('10')

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}')
    if (!token || u.role !== 'admin') { router.push('/login'); return }
    loadData()
  }, [])

  const loadData = () => {
    fetch('/api/admin/stats', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json()).then(d => {
        if (d.stats) { setStats(d.stats); setUsers(d.users || []) }
      })
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  const doAction = async (action: string, userId: string, value?: string) => {
    setActionLoading(action + userId)
    const r = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ action, userId, value }),
    })
    const d = await r.json()
    if (r.ok) {
      showToast('Ação executada com sucesso')
      setActionUser(null)
      loadData()
    } else { showToast(d.error || 'Erro') }
    setActionLoading('')
  }

  const logout = () => { localStorage.clear(); router.push('/') }

  const filteredUsers = users.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const planColor = (plan: string) => plan === 'enterprise' ? C.violet : plan === 'pro' ? C.red : plan === 'starter' ? C.amber : C.t3
  const planBg = (plan: string) => plan === 'enterprise' ? C.vDim : plan === 'pro' ? C.redDim : plan === 'starter' ? C.aDim : 'transparent'

  return (
    <>
      <Head><title>Admin — NOCTURN.AI</title></Head>
      <style>{`
        body{margin:0} * { box-sizing:border-box; }
        .nav-item{transition:background .15s,color .15s!important}
        .nav-item:hover{background:rgba(255,255,255,.03)!important;color:${C.t2}!important}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:${C.lineHi};border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: C.card, border: `1px solid ${C.green}`, color: C.green, padding: '12px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '13px', fontFamily: F.body, animation: 'fadeUp .2s ease', boxShadow: '0 8px 24px rgba(0,0,0,.5)' }}>
          {toast}
        </div>
      )}

      {/* User action modal */}
      {actionUser && (
        <div onClick={() => setActionUser(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(2,4,10,.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.layer, border: `1px solid ${C.lineHi}`, borderRadius: '16px', padding: '28px', width: '420px', maxWidth: '95vw', boxShadow: '0 32px 80px rgba(0,0,0,.85)' }}>
            <div style={{ fontFamily: F.head, fontSize: '16px', fontWeight: 700, color: C.t1, marginBottom: '4px' }}>Gerenciar usuário</div>
            <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.t3, marginBottom: '24px' }}>{actionUser.email}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {actionUser.active ? (
                <button onClick={() => doAction('ban', actionUser.id)} disabled={!!actionLoading}
                  style={{ padding: '10px', background: 'rgba(197,24,58,.1)', border: '1px solid rgba(197,24,58,.3)', color: C.red, borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: F.body }}>
                  🚫 Banir usuário
                </button>
              ) : (
                <button onClick={() => doAction('unban', actionUser.id)} disabled={!!actionLoading}
                  style={{ padding: '10px', background: C.gDim, border: `1px solid rgba(5,150,105,.3)`, color: C.green, borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: F.body }}>
                  ✓ Desbanir
                </button>
              )}
              <button onClick={() => doAction('reset_credits', actionUser.id)} disabled={!!actionLoading}
                style={{ padding: '10px', background: C.aDim, border: `1px solid rgba(217,119,6,.3)`, color: C.amber, borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: F.body }}>
                ↺ Reset créditos
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.t3, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mudar plano</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px' }}>
                {['free', 'starter', 'pro', 'enterprise'].map(p => (
                  <button key={p} onClick={() => doAction('change_plan', actionUser.id, p)} disabled={!!actionLoading || actionUser.plan === p}
                    style={{ padding: '7px 4px', background: actionUser.plan === p ? planBg(p) : 'transparent', border: `1px solid ${actionUser.plan === p ? planColor(p) : C.line}`, color: actionUser.plan === p ? planColor(p) : C.t3, borderRadius: '7px', cursor: 'pointer', fontSize: '10px', fontWeight: 600, fontFamily: F.mono, opacity: actionUser.plan === p ? 1 : 0.7 }}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
              <input type="number" value={addCreditsVal} onChange={e => setAddCreditsVal(e.target.value)}
                style={{ flex: 1, background: C.card, border: `1px solid ${C.line}`, borderRadius: '8px', padding: '8px 12px', color: C.t1, fontSize: '12px', outline: 'none', fontFamily: F.body }}
                placeholder="Créditos a adicionar" />
              <button onClick={() => doAction('add_credits', actionUser.id, addCreditsVal)} disabled={!!actionLoading}
                style={{ padding: '8px 16px', background: C.gDim, border: `1px solid rgba(5,150,105,.3)`, color: C.green, borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: F.body, whiteSpace: 'nowrap' }}>
                + Créditos
              </button>
            </div>

            <button onClick={() => setActionUser(null)} style={{ width: '100%', padding: '9px', background: 'transparent', border: `1px solid ${C.line}`, color: C.t3, borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: F.body }}>
              Fechar
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.base, color: C.t1, fontFamily: F.body }}>

        {/* Sidebar */}
        <div style={{ width: '220px', background: C.layer, borderRight: `1px solid ${C.line}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '18px 16px', borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,#C5183A,#8B0A22)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.head, fontWeight: 800, color: '#fff', fontSize: '13px' }}>N</div>
            <div>
              <div style={{ fontFamily: F.head, fontSize: '13px', fontWeight: 700, color: C.t1 }}>NOCTURN.AI</div>
              <div style={{ fontFamily: F.mono, fontSize: '8px', color: C.red, letterSpacing: '0.1em' }}>ADMIN</div>
            </div>
          </div>
          <nav style={{ padding: '10px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ fontFamily: F.mono, fontSize: '8px', color: C.t3, letterSpacing: '0.12em', padding: '8px 8px 6px', textTransform: 'uppercase' }}>Painel</div>
            {[
              { id: 'dashboard', icon: '◑', label: 'Dashboard' },
              { id: 'users', icon: '◎', label: `Usuários (${users.length})` },
              { id: 'revenue', icon: '◆', label: 'Receita' },
            ].map(item => (
              <div key={item.id} onClick={() => setView(item.id)} className="nav-item"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', paddingLeft: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: view === item.id ? 600 : 400, color: view === item.id ? C.t1 : C.t3, background: view === item.id ? 'rgba(197,24,58,.08)' : 'transparent', borderLeft: `2px solid ${view === item.id ? C.red : 'transparent'}` }}>
                <span style={{ fontFamily: F.mono, fontSize: '11px', color: view === item.id ? C.red : C.t3 }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </nav>
          <div style={{ padding: '12px', borderTop: `1px solid ${C.line}`, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button onClick={() => router.push('/dashboard')} style={{ width: '100%', background: 'transparent', border: `1px solid ${C.line}`, color: C.t3, borderRadius: '8px', padding: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: F.body }}>← Voltar ao App</button>
            <button onClick={logout} style={{ width: '100%', background: 'transparent', border: `1px solid ${C.line}`, color: C.t3, borderRadius: '8px', padding: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: F.body }}>Sair</button>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ padding: '0 28px', height: '54px', borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,8,15,.92)', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)' }}>
            <div style={{ fontFamily: F.head, fontSize: '16px', fontWeight: 700, letterSpacing: '-0.03em', color: C.t1 }}>
              {view === 'dashboard' ? 'Dashboard Admin' : view === 'users' ? 'Usuários' : 'Receita'}
            </div>
            <div style={{ background: C.redDim, border: '1px solid rgba(197,24,58,.3)', color: C.red, fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '6px', fontFamily: F.mono, letterSpacing: '0.08em' }}>ADMIN</div>
          </div>

          <div style={{ padding: '24px 28px' }}>

            {/* ── DASHBOARD ── */}
            {view === 'dashboard' && (
              <div>
                {/* KPI cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { l: 'MRR', v: 'R$' + stats.mrr.toLocaleString('pt-BR'), sub: 'receita mensal', color: C.red },
                    { l: 'Usuários', v: stats.totalUsers, sub: `${stats.activeUsers || 0} ativos`, color: C.green },
                    { l: 'Vídeos Hoje', v: stats.videosToday, sub: `${stats.totalVideos || 0} total`, color: C.violet },
                    { l: 'Novos 7d', v: stats.newUsers7d || 0, sub: 'novos cadastros', color: C.amber },
                  ].map((s, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: '12px', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,.5)' }}>
                      <div style={{ fontFamily: F.mono, fontSize: '8px', color: C.t3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>{s.l}</div>
                      <div style={{ fontFamily: F.head, fontSize: '26px', fontWeight: 800, color: s.color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '4px' }}>{s.v}</div>
                      <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.t3 }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Vídeos por dia */}
                  <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,.5)' }}>
                    <div style={{ fontFamily: F.head, fontSize: '13px', fontWeight: 700, color: C.t1, marginBottom: '4px' }}>Vídeos Gerados (7 dias)</div>
                    <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.t3, marginBottom: '16px' }}>produção diária</div>
                    {stats.videosByDay && Object.keys(stats.videosByDay).length > 0
                      ? <MiniBarChart data={stats.videosByDay} />
                      : <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.t3, fontSize: '12px', fontFamily: F.body }}>Sem dados ainda</div>
                    }
                  </div>

                  {/* Usuários por plano */}
                  <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,.5)' }}>
                    <div style={{ fontFamily: F.head, fontSize: '13px', fontWeight: 700, color: C.t1, marginBottom: '4px' }}>Distribuição de Planos</div>
                    <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.t3, marginBottom: '16px' }}>usuários por plano</div>
                    {Object.entries(stats.byPlan || {}).map(([plan, count]: [string, any]) => {
                      const total = stats.totalUsers || 1
                      const pct = Math.round((count / total) * 100)
                      const color = planColor(plan)
                      return (
                        <div key={plan} style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: '10px', color: C.t2, marginBottom: '4px' }}>
                            <span style={{ color, fontWeight: 600, textTransform: 'capitalize' }}>{plan}</span>
                            <span>{count} users ({pct}%)</span>
                          </div>
                          <div style={{ height: '3px', background: C.line, borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '2px', transition: 'width .5s' }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── USERS ── */}
            {view === 'users' && (
              <div>
                <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar por nome ou email..."
                    style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: '9px', padding: '10px 14px', color: C.t1, fontSize: '13px', outline: 'none', fontFamily: F.body, width: '280px', transition: 'border-color .15s' }}
                    onFocus={e => e.target.style.borderColor = C.red}
                    onBlur={e => e.target.style.borderColor = C.line} />
                  <button onClick={() => {
                    const cols = ['Nome', 'Email', 'Plano', 'Créditos', 'Vídeos', 'Status', 'Verificado', 'Desde']
                    const rows = users.map(u => [
                      u.name, u.email, u.plan || 'free', u.credits ?? 0, u.videoCount ?? 0,
                      u.active ? 'Ativo' : 'Banido', u.verified ? 'Sim' : 'Não',
                      u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : '',
                    ])
                    const csv = [cols, ...rows].map(r => r.map((v: any) => `"${v}"`).join(',')).join('\n')
                    const b = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                    const url = URL.createObjectURL(b)
                    const a = document.createElement('a'); a.href = url
                    a.download = `nocturn-usuarios-${new Date().toISOString().slice(0,10)}.csv`
                    a.click(); URL.revokeObjectURL(url)
                  }} style={{ background: C.gDim, border: `1px solid rgba(5,150,105,.3)`, color: C.green, borderRadius: '9px', padding: '10px 16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: F.body, whiteSpace: 'nowrap' }}>
                    ↓ Exportar CSV
                  </button>
                </div>
                <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.5)' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr>
                          {['Nome', 'Email', 'Plano', 'Créditos', 'Vídeos', 'Status', 'Desde', 'Ações'].map(h => (
                            <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: F.mono, fontSize: '9px', color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.line}`, whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length === 0 ? (
                          <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: C.t3, fontFamily: F.body }}>Nenhum usuário encontrado.</td></tr>
                        ) : filteredUsers.map((u, i) => (
                          <tr key={i} style={{ borderBottom: `1px solid ${C.line}` }}>
                            <td style={{ padding: '10px 14px', color: C.t1, fontWeight: 600 }}>{u.name}</td>
                            <td style={{ padding: '10px 14px', color: C.t3, fontFamily: F.mono, fontSize: '11px' }}>{u.email}</td>
                            <td style={{ padding: '10px 14px' }}>
                              <span style={{ padding: '2px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, fontFamily: F.mono, background: planBg(u.plan), color: planColor(u.plan), textTransform: 'uppercase' }}>{u.plan || 'free'}</span>
                            </td>
                            <td style={{ padding: '10px 14px', fontFamily: F.mono, fontSize: '11px', color: (u.credits ?? 0) < 3 ? C.red : C.t2 }}>{u.credits ?? 0}</td>
                            <td style={{ padding: '10px 14px', fontFamily: F.mono, fontSize: '11px', color: C.t2 }}>{u.videoCount ?? 0}</td>
                            <td style={{ padding: '10px 14px' }}>
                              <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 600, color: u.active ? C.green : C.red }}>{u.active ? '● Ativo' : '● Banido'}</span>
                            </td>
                            <td style={{ padding: '10px 14px', fontFamily: F.mono, fontSize: '10px', color: C.t3, whiteSpace: 'nowrap' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : '—'}</td>
                            <td style={{ padding: '10px 14px' }}>
                              <button onClick={() => setActionUser(u)}
                                style={{ background: 'transparent', border: `1px solid ${C.lineHi}`, color: C.t2, borderRadius: '7px', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: F.body, fontWeight: 500 }}>
                                Gerenciar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── REVENUE ── */}
            {view === 'revenue' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { l: 'MRR Total', v: 'R$' + stats.mrr.toLocaleString('pt-BR'), color: C.red },
                    { l: 'ARR Projetado', v: 'R$' + (stats.mrr * 12).toLocaleString('pt-BR'), color: C.violet },
                    { l: 'LTV Médio', v: 'R$' + Math.round(stats.mrr / Math.max(1, stats.activeUsers || 1) * 12).toLocaleString('pt-BR'), color: C.amber },
                  ].map((s, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: '12px', padding: '18px 20px' }}>
                      <div style={{ fontFamily: F.mono, fontSize: '8px', color: C.t3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>{s.l}</div>
                      <div style={{ fontFamily: F.head, fontSize: '26px', fontWeight: 800, color: s.color, letterSpacing: '-0.04em' }}>{s.v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                  <div style={{ fontFamily: F.head, fontSize: '13px', fontWeight: 700, color: C.t1, marginBottom: '16px' }}>Receita por Plano</div>
                  {[
                    { plan: 'Enterprise', price: 297, color: C.violet },
                    { plan: 'Pro', price: 97, color: C.red },
                    { plan: 'Starter', price: 47, color: C.amber },
                  ].map(({ plan, price, color }) => {
                    const count = (stats.byPlan || {})[plan.toLowerCase()] || 0
                    const revenue = count * price
                    const pct = stats.mrr > 0 ? Math.round((revenue / stats.mrr) * 100) : 0
                    return (
                      <div key={plan} style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F.body, fontSize: '12px', color: C.t2, marginBottom: '6px' }}>
                          <span style={{ color, fontWeight: 600 }}>{plan}</span>
                          <span><strong style={{ color: C.t1 }}>R${revenue.toLocaleString('pt-BR')}</strong> — {count} assinantes</span>
                        </div>
                        <div style={{ height: '4px', background: C.line, borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '2px' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontFamily: F.head, fontSize: '13px', fontWeight: 700, color: C.t1, marginBottom: '12px' }}>Gateways de Pagamento</div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[{ n: 'Cakto', on: true }, { n: 'Hotmart', on: false }, { n: 'Kiwify', on: false }].map((g, i) => (
                      <div key={i} style={{ background: C.raised, border: `1px solid ${g.on ? 'rgba(5,150,105,.3)' : C.line}`, borderRadius: '8px', padding: '10px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: F.body }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: g.on ? C.green : C.t3 }} />
                        <span style={{ color: g.on ? C.t1 : C.t3, fontWeight: g.on ? 600 : 400 }}>{g.n}</span>
                        <span style={{ fontFamily: F.mono, fontSize: '9px', color: g.on ? C.green : C.t3 }}>{g.on ? 'ATIVO' : 'OFF'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
