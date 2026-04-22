# Instruções para o Claude Code — Melhorias do SaaS de Geração de Vídeo

Você é um especialista em produto SaaS e UX/UI com foco em retenção e conversão.

Analise TODO o código do projeto (estrutura de arquivos, frontend, backend, fluxos de usuário) e faça melhorias completas com foco em 3 objetivos principais:

---

## 1. RETENÇÃO DE USUÁRIOS

- Adicione onboarding guiado passo a passo para novos usuários (tooltip ou modal de boas-vindas)
- Implemente um sistema de progresso visível (ex: "Você completou 2 de 5 passos para criar seu primeiro vídeo")
- Adicione notificações ou alertas internos motivando o usuário a voltar a usar a plataforma
- Crie uma dashboard inicial clara mostrando o valor entregue ao usuário (vídeos gerados, tempo economizado etc.)
- Adicione empty states atrativos nas telas vazias (ex: quando o usuário ainda não gerou nenhum vídeo, mostre um CTA claro e visual atraente)

---

## 2. APARÊNCIA PROFISSIONAL

- Revise toda a UI e aplique um design system consistente (cores, tipografia, espaçamentos, border-radius)
- Use uma paleta de cores moderna e profissional (tons escuros ou neutros com 1 cor de destaque vibrante)
- Padronize todos os botões, inputs, cards e modais
- Adicione micro-animações sutis (hover, transições de página, loading states)
- Garanta que a interface seja 100% responsiva (mobile-first)
- Adicione um header/navbar profissional com logo, navegação clara e avatar do usuário
- Melhore a hierarquia visual das páginas (títulos, subtítulos, separações claras)

---

## 3. CONVERSÃO (TRIAL → PAGO / VISITANTE → CADASTRO)

- Adicione uma página de pricing clara com comparação de planos (Free, Pro, Business)
- Implemente um banner ou modal de upgrade estratégico quando o usuário atingir um limite (ex: "Você usou 3 de 5 vídeos gratuitos — faça upgrade para continuar")
- Adicione social proof onde relevante (ex: "Mais de 1.000 criadores já usam o Nocturn AI")
- Crie um CTA principal forte e visível na landing page/homepage
- Adicione urgência ou escassez onde fizer sentido (ex: "Oferta de lançamento — 50% off por tempo limitado")
- Melhore o fluxo de cadastro/login para ser o mais simples possível (menos campos, opção de Google OAuth se ainda não tiver)
- Adicione uma página ou seção de FAQ respondendo as principais objeções

---

## INSTRUÇÕES GERAIS

- Mantenha toda a lógica de negócio existente intacta
- Priorize as mudanças de maior impacto primeiro
- Comente o código nas partes alteradas explicando o que foi feito
- Se precisar instalar alguma biblioteca nova, avise antes e explique o motivo
- Após cada conjunto de mudanças, me mostre o que foi alterado e pergunte se posso prosseguir

Comece lendo todos os arquivos do projeto para entender a estrutura atual antes de fazer qualquer alteração.
