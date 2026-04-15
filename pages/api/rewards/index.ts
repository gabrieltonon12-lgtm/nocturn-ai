import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { getUsers, saveUsers, getVideos, ensureAdmin } from '../../../lib/db'

// Sistema de Rewards — economia balanceada
// Regras para não quebrar receita:
// - Bônus máximo = 2 créditos/mês por usuário (não substitui plano)
// - Só recompensa views verificadas manualmente (usuário informa)
// - Milestones progressivos que criam hábito sem substituir upgrade
// - Créditos bônus expiram no fim do mês (urgência de uso)

const MILESTONES = [
  { id: 'first_video', label: 'Primeiro vídeo gerado', credits: 0, badge: '🎬', type: 'onboarding' },
  { id: 'videos_3', label: '3 vídeos gerados', credits: 0, badge: '🔥', type: 'habit' },
  { id: 'videos_7', label: '7 vídeos gerados — 1 semana de conteúdo', credits: 1, badge: '⚡', type: 'habit' },
  { id: 'videos_30', label: '30 vídeos — Criador consistente', credits: 1, badge: '👑', type: 'habit' },
  { id: 'views_1k', label: '1.000 views no primeiro vídeo', credits: 0, badge: '📈', type: 'views' },
  { id: 'views_10k', label: '10.000 views totais', credits: 1, badge: '🚀', type: 'views' },
  { id: 'views_100k', label: '100.000 views — Dark Channel Pro', credits: 1, badge: '💎', type: 'views' },
]

// Max 2 créditos bônus por mês — não substitui plano, apenas recompensa engajamento
const MAX_BONUS_CREDITS_PER_MONTH = 2

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.JWT_SECRET || 'nocturnai_jwt_super_secret_2025_xK9mP'
  
  try {
    await ensureAdmin()
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token obrigatório' })
    let decoded: any
    try { decoded = jwt.verify(auth.split(' ')[1], secret) } 
    catch { return res.status(401).json({ error: 'Token inválido' }) }

    const users = await getUsers()
    const idx = users.findIndex((u: any) => u.id === decoded.id || u.email === decoded.email)
    if (idx === -1) return res.status(404).json({ error: 'Usuário não encontrado' })
    const user = users[idx]

    // GET — retorna status dos rewards do usuário
    if (req.method === 'GET') {
      const videos = await getVideos(user.id)
      const videoCount = videos.length
      const unlockedIds: string[] = user.unlockedRewards || []
      const currentMonth = new Date().toISOString().substring(0, 7)
      const bonusThisMonth = user.bonusCreditsMonth === currentMonth ? (user.bonusCreditsGiven || 0) : 0
      const canEarnMore = bonusThisMonth < MAX_BONUS_CREDITS_PER_MONTH

      const rewards = MILESTONES.map(m => {
        const unlocked = unlockedIds.includes(m.id)
        let progress = 0
        let target = 1

        if (m.id === 'first_video') { progress = Math.min(videoCount, 1); target = 1 }
        else if (m.id === 'videos_3') { progress = Math.min(videoCount, 3); target = 3 }
        else if (m.id === 'videos_7') { progress = Math.min(videoCount, 7); target = 7 }
        else if (m.id === 'videos_30') { progress = Math.min(videoCount, 30); target = 30 }
        else if (m.id === 'views_1k') { progress = Math.min(user.totalViews || 0, 1000); target = 1000 }
        else if (m.id === 'views_10k') { progress = Math.min(user.totalViews || 0, 10000); target = 10000 }
        else if (m.id === 'views_100k') { progress = Math.min(user.totalViews || 0, 100000); target = 100000 }

        const eligible = !unlocked && progress >= target
        return { ...m, unlocked, progress, target, eligible, canClaim: eligible && (m.credits === 0 || canEarnMore) }
      })

      return res.status(200).json({ rewards, bonusThisMonth, canEarnMore, maxBonus: MAX_BONUS_CREDITS_PER_MONTH })
    }

    // POST — claim de reward ou report de views
    if (req.method === 'POST') {
      const { action, rewardId, views, videoId } = req.body

      // Report views (usuário informa manualmente — honesty system)
      if (action === 'report_views') {
        const viewCount = parseInt(views) || 0
        if (viewCount < 0 || viewCount > 10000000) return res.status(400).json({ error: 'Views inválidas' })
        users[idx].totalViews = (user.totalViews || 0) + viewCount
        await saveUsers(users)
        return res.status(200).json({ ok: true, totalViews: users[idx].totalViews })
      }

      // Claim reward
      if (action === 'claim') {
        const milestone = MILESTONES.find(m => m.id === rewardId)
        if (!milestone) return res.status(400).json({ error: 'Reward inválido' })

        const unlockedIds: string[] = user.unlockedRewards || []
        if (unlockedIds.includes(rewardId)) return res.status(400).json({ error: 'Reward já resgatado' })

        const videos = await getVideos(user.id)
        const videoCount = videos.length
        let eligible = false

        if (rewardId === 'first_video') eligible = videoCount >= 1
        else if (rewardId === 'videos_3') eligible = videoCount >= 3
        else if (rewardId === 'videos_7') eligible = videoCount >= 7
        else if (rewardId === 'videos_30') eligible = videoCount >= 30
        else if (rewardId === 'views_1k') eligible = (user.totalViews || 0) >= 1000
        else if (rewardId === 'views_10k') eligible = (user.totalViews || 0) >= 10000
        else if (rewardId === 'views_100k') eligible = (user.totalViews || 0) >= 100000

        if (!eligible) return res.status(400).json({ error: 'Critério não atingido' })

        // Check monthly bonus cap
        const currentMonth = new Date().toISOString().substring(0, 7)
        const bonusThisMonth = user.bonusCreditsMonth === currentMonth ? (user.bonusCreditsGiven || 0) : 0
        
        if (milestone.credits > 0 && bonusThisMonth >= MAX_BONUS_CREDITS_PER_MONTH) {
          // Desbloqueia o badge mas não dá crédito (cap atingido)
          users[idx].unlockedRewards = [...unlockedIds, rewardId]
          await saveUsers(users)
          return res.status(200).json({ ok: true, creditsEarned: 0, badge: true, message: 'Badge desbloqueado! Limite de créditos bônus do mês atingido.' })
        }

        // Grant credits + badge
        users[idx].unlockedRewards = [...unlockedIds, rewardId]
        if (milestone.credits > 0) {
          users[idx].credits = (user.credits || 0) + milestone.credits
          users[idx].bonusCreditsMonth = currentMonth
          users[idx].bonusCreditsGiven = bonusThisMonth + milestone.credits
        }
        await saveUsers(users)

        return res.status(200).json({ 
          ok: true, 
          creditsEarned: milestone.credits, 
          badge: milestone.badge,
          newCredits: users[idx].credits,
          message: milestone.credits > 0 ? `+${milestone.credits} crédito bônus desbloqueado!` : `Badge ${milestone.badge} desbloqueado!`
        })
      }

      return res.status(400).json({ error: 'Action inválida' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch(e: any) {
    console.error('Rewards error:', e)
    res.status(500).json({ error: e.message })
  }
}