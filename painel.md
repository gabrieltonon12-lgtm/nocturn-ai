# Redesign Completo do Painel — Nocturn AI
## Referência visual: Linear.app — minimalista, clean, profissional

Você é um designer de produto sênior e engenheiro frontend especialista em SaaS de nível internacional.

Sua missão é transformar TODAS as telas do painel do Nocturn AI para que pareçam um produto de R$ 1 milhão — limpo, rápido, moderno e sem nenhum elemento genérico.

A referência visual é o Linear.app: espaço em branco generoso, tipografia precisa, hierarquia clara, zero elementos desnecessários, sensação de velocidade e controle.

---

## FASE 1 — DIAGNÓSTICO (não altere nada ainda)

Leia todos os arquivos do projeto e me responda:

1. Quais são todas as telas/páginas do painel?
2. Qual framework/biblioteca de UI está sendo usado? (Tailwind, Bootstrap, CSS puro, etc.)
3. Qual a tipografia atual?
4. Qual a paleta de cores atual?
5. Quais componentes se repetem em mais de uma tela? (botões, cards, inputs, navbar)
6. Existe algum design system ou arquivo de variáveis CSS/tokens?

Após o diagnóstico, me apresente o relatório e aguarde minha aprovação para continuar.

---

## FASE 2 — DESIGN SYSTEM (base de tudo)

Antes de mexer em qualquer tela, crie ou refatore o design system completo.

### Tipografia
- Fonte principal: Inter (importar do Google Fonts)
- Hierarquia:
  - H1: 28px / weight 600
  - H2: 22px / weight 600
  - H3: 18px / weight 500
  - Body: 15px / weight 400 / line-height 1.6
  - Caption: 13px / weight 400 / cor secundária
  - Label: 12px / weight 500 / uppercase / letter-spacing 0.05em

### Paleta de cores (estilo Linear — fundo branco premium)
```
--color-bg-primary: #FAFAFA;        /* Fundo principal */
--color-bg-secondary: #F4F4F5;      /* Fundo de cards e painéis */
--color-bg-tertiary: #EBEBEC;       /* Hover states e divisórias */
--color-bg-elevated: #FFFFFF;       /* Cards elevados */

--color-text-primary: #09090B;      /* Texto principal */
--color-text-secondary: #52525B;    /* Texto secundário */
--color-text-tertiary: #A1A1AA;     /* Placeholders e hints */
--color-text-disabled: #D4D4D8;     /* Desabilitado */

--color-accent: #6E56CF;            /* Roxo — cor de destaque única */
--color-accent-hover: #5746AF;      /* Roxo escuro no hover */
--color-accent-light: #EEE9FE;      /* Roxo claro para backgrounds */
--color-accent-text: #4C3899;       /* Texto sobre fundo accent-light */

--color-success: #16A34A;
--color-success-light: #DCFCE7;
--color-warning: #CA8A04;
--color-warning-light: #FEF9C3;
--color-danger: #DC2626;
--color-danger-light: #FEE2E2;

--color-border: #E4E4E7;            /* Borda padrão */
--color-border-strong: #D4D4D8;     /* Borda com mais contraste */
```

### Espaçamento
```
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

### Border radius
```
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

### Sombras (sutis, sem exagero)
```
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
```

Após criar o design system, me mostre e aguarde aprovação.

---

## FASE 3 — COMPONENTES GLOBAIS

Refatore todos os componentes que aparecem em mais de uma tela:

### Navbar / Sidebar
- Fundo branco com borda direita fina (1px --color-border)
- Logo do Nocturn AI no topo, alinhada à esquerda
- Itens de navegação: ícone + texto, 15px, espaçamento generoso
- Item ativo: fundo --color-accent-light, texto --color-accent, sem border-radius agressivo
- Item hover: fundo --color-bg-secondary, transição 150ms
- Avatar do usuário no rodapé com nome e email em texto pequeno
- Sem sombra lateral — só a borda fina

### Botões
```
/* Primário */
background: --color-accent
color: white
padding: 8px 16px
border-radius: --radius-md
font-size: 14px / weight 500
hover: --color-accent-hover + transform: translateY(-1px)
active: transform: scale(0.98)
transition: all 150ms ease

/* Secundário */
background: transparent
border: 1px solid --color-border-strong
color: --color-text-primary
hover: background --color-bg-secondary

/* Ghost */
background: transparent
border: none
color: --color-text-secondary
hover: background --color-bg-secondary color --color-text-primary

/* Danger */
background: --color-danger-light
color: --color-danger
hover: background #FECACA
```

### Inputs
```
background: white
border: 1px solid --color-border
border-radius: --radius-md
padding: 9px 12px
font-size: 14px
color: --color-text-primary
placeholder: --color-text-tertiary
focus: border-color --color-accent, box-shadow 0 0 0 3px rgba(110,86,207,0.12)
transition: all 150ms ease
```

### Cards
```
background: --color-bg-elevated
border: 1px solid --color-border
border-radius: --radius-lg
padding: 20px 24px
box-shadow: --shadow-sm
hover (se clicável): box-shadow --shadow-md, transform translateY(-1px)
transition: all 200ms ease
```

### Badges / Tags
```
font-size: 12px / weight 500
padding: 3px 10px
border-radius: --radius-full
sem uppercase

Variantes:
- Default: bg --color-bg-tertiary, text --color-text-secondary
- Success: bg --color-success-light, text --color-success
- Warning: bg --color-warning-light, text --color-warning
- Danger: bg --color-danger-light, text --color-danger
- Accent: bg --color-accent-light, text --color-accent-text
```

### Loading / Skeleton
- Substitua todos os spinners genéricos por skeleton loaders
- Skeleton: retângulos arredondados com animação de shimmer suave
- Cor base: --color-bg-tertiary com shimmer em --color-bg-secondary

### Toasts / Notificações
```
Posição: canto inferior direito
background: --color-bg-elevated
border: 1px solid --color-border
border-radius: --radius-lg
box-shadow: --shadow-lg
padding: 14px 18px
Animação: slide-in da direita, 250ms ease-out
Ícone colorido à esquerda conforme tipo (success/warning/danger)
Texto: font-size 14px, --color-text-primary
```

Após refatorar todos os componentes, me mostre e aguarde aprovação.

---

## FASE 4 — TELA POR TELA

Para cada tela do painel, aplique as melhorias abaixo. Trate cada tela separadamente e me mostre antes de passar para a próxima.

### Dashboard / Home
- Header com saudação personalizada: "Bom dia, [nome] 👋"
- 3-4 cards de métricas no topo: vídeos gerados, créditos restantes, último vídeo, tempo economizado
- Seção "Seus vídeos recentes" com grid de thumbnails
- Botão de nova criação grande e destacado (cor accent) sempre visível
- Empty state caso não tenha vídeos: ilustração simples + texto motivacional + CTA
- Sem elementos desnecessários — só o que o usuário precisa ver

### Tela de Geração de Vídeo
- Formulário limpo, campos bem espaçados
- Label acima do input, nunca placeholder como label
- Barra de progresso durante a geração com mensagens animadas:
  - "Gerando roteiro..."
  - "Criando cenas..."
  - "Finalizando exportação..."
- Resultado final: player de vídeo HTML5 limpo + botão de download bem visível
- Feedback visual claro em cada etapa

### Histórico de Vídeos
- Grid responsivo com cards de vídeo (thumbnail, título, data, duração)
- Filtro e busca no topo
- Hover no card: aparecem botões de ação (baixar, deletar, compartilhar)
- Empty state atrativo caso não tenha vídeos

### Configurações / Perfil
- Layout de 2 colunas: menu lateral com seções + conteúdo à direita
- Seções: Perfil, Plano, Notificações, API
- Informações do plano atual com barra de uso de créditos
- Botão de upgrade destacado se estiver no plano gratuito

---

## FASE 5 — MICRO-ANIMAÇÕES E POLISH

Após todas as telas estarem refatoradas, adicione os detalhes finais:

- Transições de página suaves (fade-in, 200ms)
- Hover em todos os elementos clicáveis (cursor pointer + feedback visual)
- Focus states visíveis em todos os inputs e botões (acessibilidade)
- Scroll suave em toda a aplicação
- Animação de entrada nos cards do dashboard (fade-in + translateY de 8px, stagger de 50ms entre cards)
- Loading state no botão de geração de vídeo (spinner inline + texto "Gerando...")

---

## FASE 6 — RESPONSIVIDADE

Garanta que TODAS as telas funcionam perfeitamente em:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1280px+

Regras:
- Sidebar vira menu hambúrguer no mobile
- Grid de cards vira coluna única no mobile
- Inputs e botões com tamanho mínimo de 44px no mobile (touch targets)
- Sem overflow horizontal em nenhuma tela

---

## REGRAS IMPORTANTES

- Use APENAS as variáveis CSS do design system criado na Fase 2 — zero cores hardcoded
- NÃO use bibliotecas de UI prontas (Bootstrap, Material UI) sem customização total
- Preserve 100% da lógica de negócio — apenas visual e UX
- Cada fase precisa da minha aprovação antes de continuar
- Se precisar instalar alguma biblioteca, avise o nome e motivo antes
- Após cada tela, me mostre o resultado e pergunte se posso continuar

---

Comece pela FASE 1. Leia todos os arquivos, faça o diagnóstico completo e me apresente antes de alterar qualquer coisa.
