# Internacionalização PT/EN — Nocturn AI
## Sistema completo de troca de idioma Português ↔ Inglês (EUA)

Você é um engenheiro sênior especialista em internacionalização (i18n) de SaaS.

Sua missão é implementar um sistema completo de troca de idioma no Nocturn AI — quando o usuário trocar para EN, TUDO muda: textos da interface, prompts enviados para o Runway, narração dos vídeos, e-mails automáticos e página de pricing em dólar.

---

## FASE 1 — DIAGNÓSTICO (não altere nada ainda)

Leia todos os arquivos do projeto e me responda:

1. Onde estão os textos da interface? (hardcoded no HTML/JSX, em arquivos separados, em variáveis?)
2. Qual framework está sendo usado? (Next.js, React, Vue, HTML puro?)
3. Onde o prompt é montado antes de ser enviado para o Runway?
4. Existe algum sistema de autenticação? (para salvar a preferência de idioma do usuário)
5. Onde está a página de pricing? (valores em BRL?)
6. Existe envio de e-mails automáticos? (boas-vindas, confirmação, etc.)

Após o diagnóstico, me apresente o relatório e aguarde aprovação.

---

## FASE 2 — ESTRUTURA DE TRADUÇÃO

### 2.1 — Instale a biblioteca de i18n

Se o projeto for Next.js ou React:
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

Se for HTML puro com JavaScript:
```bash
npm install i18next i18next-browser-languagedetector
```

### 2.2 — Crie a estrutura de arquivos de tradução

Crie a pasta `locales` na raiz do projeto com os arquivos:

**`locales/pt-BR.json`** — todos os textos em português:
```json
{
  "nav": {
    "dashboard": "Painel",
    "generate": "Gerar Vídeo",
    "history": "Histórico",
    "settings": "Configurações",
    "logout": "Sair"
  },
  "dashboard": {
    "welcome": "Bom dia, {{name}} 👋",
    "videos_generated": "Vídeos Gerados",
    "credits_remaining": "Créditos Restantes",
    "last_video": "Último Vídeo",
    "time_saved": "Tempo Economizado",
    "recent_videos": "Seus vídeos recentes",
    "new_video_btn": "Criar Novo Vídeo",
    "empty_state_title": "Seu primeiro vídeo está a 1 clique",
    "empty_state_desc": "Descreva sua ideia e nossa IA transforma em vídeo profissional em segundos.",
    "empty_state_cta": "Criar meu primeiro vídeo →"
  },
  "generate": {
    "title": "Gerar Vídeo",
    "prompt_label": "Descreva seu vídeo",
    "prompt_placeholder": "Ex: Vídeo de apresentação de produto de skincare, tom profissional, fundo branco...",
    "duration_label": "Duração",
    "style_label": "Estilo",
    "generate_btn": "Gerar Vídeo",
    "generating": "Gerando seu vídeo...",
    "step_script": "Gerando roteiro...",
    "step_scenes": "Criando cenas...",
    "step_export": "Finalizando exportação...",
    "success": "Vídeo gerado com sucesso!",
    "download_btn": "Baixar Vídeo em MP4",
    "error": "Erro ao gerar vídeo. Tente novamente."
  },
  "history": {
    "title": "Histórico de Vídeos",
    "search_placeholder": "Buscar vídeos...",
    "empty_title": "Nenhum vídeo ainda",
    "empty_desc": "Seus vídeos gerados aparecerão aqui.",
    "download": "Baixar",
    "delete": "Deletar"
  },
  "pricing": {
    "title": "Escolha seu plano",
    "subtitle": "Comece grátis. Escale quando precisar.",
    "currency": "R$",
    "per_month": "/mês",
    "most_popular": "Mais Popular",
    "starter": {
      "name": "Starter",
      "price": "0",
      "desc": "Para começar a criar",
      "cta": "Começar Grátis"
    },
    "pro": {
      "name": "Pro",
      "price": "97",
      "desc": "Para criadores sérios",
      "cta": "Assinar Pro"
    },
    "business": {
      "name": "Business",
      "price": "297",
      "desc": "Para agências e times",
      "cta": "Assinar Business"
    }
  },
  "common": {
    "save": "Salvar",
    "cancel": "Cancelar",
    "confirm": "Confirmar",
    "loading": "Carregando...",
    "error": "Algo deu errado",
    "success": "Sucesso!",
    "upgrade": "Fazer Upgrade",
    "credits_warning": "Você usou {{used}} de {{total}} créditos. Faça upgrade para continuar.",
    "language": "Idioma"
  }
}
```

**`locales/en-US.json`** — todos os textos em inglês americano:
```json
{
  "nav": {
    "dashboard": "Dashboard",
    "generate": "Generate Video",
    "history": "History",
    "settings": "Settings",
    "logout": "Sign Out"
  },
  "dashboard": {
    "welcome": "Good morning, {{name}} 👋",
    "videos_generated": "Videos Generated",
    "credits_remaining": "Credits Remaining",
    "last_video": "Last Video",
    "time_saved": "Time Saved",
    "recent_videos": "Your recent videos",
    "new_video_btn": "Create New Video",
    "empty_state_title": "Your first video is one click away",
    "empty_state_desc": "Describe your idea and our AI turns it into a professional video in seconds.",
    "empty_state_cta": "Create my first video →"
  },
  "generate": {
    "title": "Generate Video",
    "prompt_label": "Describe your video",
    "prompt_placeholder": "Ex: Product presentation video for a skincare brand, professional tone, white background...",
    "duration_label": "Duration",
    "style_label": "Style",
    "generate_btn": "Generate Video",
    "generating": "Generating your video...",
    "step_script": "Writing script...",
    "step_scenes": "Creating scenes...",
    "step_export": "Finalizing export...",
    "success": "Video generated successfully!",
    "download_btn": "Download MP4 Video",
    "error": "Error generating video. Please try again."
  },
  "history": {
    "title": "Video History",
    "search_placeholder": "Search videos...",
    "empty_title": "No videos yet",
    "empty_desc": "Your generated videos will appear here.",
    "download": "Download",
    "delete": "Delete"
  },
  "pricing": {
    "title": "Choose your plan",
    "subtitle": "Start free. Scale when you're ready.",
    "currency": "$",
    "per_month": "/mo",
    "most_popular": "Most Popular",
    "starter": {
      "name": "Starter",
      "price": "0",
      "desc": "To get started",
      "cta": "Get Started Free"
    },
    "pro": {
      "name": "Pro",
      "price": "19",
      "desc": "For serious creators",
      "cta": "Subscribe to Pro"
    },
    "business": {
      "name": "Business",
      "price": "59",
      "desc": "For agencies and teams",
      "cta": "Subscribe to Business"
    }
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "loading": "Loading...",
    "error": "Something went wrong",
    "success": "Success!",
    "upgrade": "Upgrade Plan",
    "credits_warning": "You've used {{used}} of {{total}} credits. Upgrade to continue.",
    "language": "Language"
  }
}
```

---

## FASE 3 — CONFIGURAÇÃO DO i18n

Crie o arquivo `lib/i18n.js` (ou `lib/i18n.ts` se TypeScript):

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ptBR from '../locales/pt-BR.json';
import enUS from '../locales/en-US.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      'en-US': { translation: enUS },
    },
    fallbackLng: 'pt-BR',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'nocturn_language',
    },
  });

export default i18n;
```

---

## FASE 4 — BOTÃO DE TROCA DE IDIOMA

Crie o componente `components/LanguageSwitcher.jsx`:

```jsx
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isEN = i18n.language === 'en-US';

  const toggle = () => {
    const next = isEN ? 'pt-BR' : 'en-US';
    i18n.changeLanguage(next);
    localStorage.setItem('nocturn_language', next);
  };

  return (
    <button
      onClick={toggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '8px',
        border: '1px solid var(--color-border)',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        color: 'var(--color-text-secondary)',
        transition: 'all 150ms ease',
      }}
    >
      <span style={{ fontSize: '16px' }}>{isEN ? '🇺🇸' : '🇧🇷'}</span>
      <span>{isEN ? 'EN' : 'PT'}</span>
    </button>
  );
}
```

Adicione o `<LanguageSwitcher />` na navbar, próximo ao avatar do usuário.

---

## FASE 5 — PROMPTS DO RUNWAY EM DOIS IDIOMAS

Esta é a parte mais importante — quando o usuário estiver em EN, os prompts enviados para o Runway precisam sair em inglês para que os vídeos gerados também sejam em inglês.

Localize onde o prompt é montado e enviado para o Runway e aplique essa lógica:

```javascript
// Detecta o idioma salvo do usuário
const userLanguage = localStorage.getItem('nocturn_language') || 'pt-BR';
const isEnglish = userLanguage === 'en-US';

// Prefixo de idioma adicionado ao prompt do usuário
const languagePrefix = isEnglish
  ? 'Generate this video entirely in English (US), with English narration and English text on screen. '
  : 'Gere este vídeo completamente em português do Brasil, com narração em português e textos em português. ';

// Prompt final enviado para o Runway
const finalPrompt = languagePrefix + userPrompt;
```

Isso garante que o vídeo gerado, a narração e os textos na tela saiam no idioma correto.

---

## FASE 6 — PRICING EM DÓLAR PARA USUÁRIOS EN

Quando o usuário estiver em EN, a página de pricing deve mostrar os valores em USD automaticamente.

Localize a página de pricing e aplique:

```javascript
const { i18n, t } = useTranslation();
const isEN = i18n.language === 'en-US';

// Os preços em USD já estão definidos no en-US.json
// Starter: $0 | Pro: $19/mo | Business: $59/mo
// A troca é automática via t('pricing.pro.price')
```

Certifique-se de que o símbolo de moeda também troca:
- PT: `R$ 97/mês`
- EN: `$19/mo`

---

## FASE 7 — SUBSTITUIÇÃO DOS TEXTOS NO CÓDIGO

Percorra TODAS as telas e substitua todos os textos hardcoded pelo sistema de tradução:

**Antes:**
```jsx
<h1>Painel</h1>
<button>Criar Novo Vídeo</button>
<p>Carregando...</p>
```

**Depois:**
```jsx
const { t } = useTranslation();

<h1>{t('nav.dashboard')}</h1>
<button>{t('dashboard.new_video_btn')}</button>
<p>{t('common.loading')}</p>
```

Faça isso em todas as telas:
- Dashboard
- Tela de geração de vídeo
- Histórico
- Configurações
- Pricing
- Onboarding
- Mensagens de erro e sucesso

---

## FASE 8 — SALVAR PREFERÊNCIA NO PERFIL DO USUÁRIO

Se o projeto tiver banco de dados e autenticação, salve a preferência de idioma no perfil do usuário:

```javascript
// Ao trocar o idioma, além de salvar no localStorage,
// salvar também no banco de dados do usuário
async function changeLanguage(lang) {
  i18n.changeLanguage(lang);
  localStorage.setItem('nocturn_language', lang);

  // Salvar no banco
  await updateUserPreferences({ language: lang });
}

// Ao fazer login, carregar a preferência salva
async function onLogin(user) {
  const savedLang = user.preferences?.language || 'pt-BR';
  i18n.changeLanguage(savedLang);
  localStorage.setItem('nocturn_language', savedLang);
}
```

---

## REGRAS IMPORTANTES

- NUNCA remova os textos originais — eles ficam no `pt-BR.json`
- O idioma padrão é sempre PT-BR para novos usuários
- A troca de idioma deve ser instantânea — sem reload de página
- O botão de troca fica visível em TODAS as telas na navbar
- Quando em EN, o prompt do Runway SEMPRE recebe o prefixo em inglês
- Os preços em USD devem ser competitivos para o mercado americano
- Me mostre cada fase concluída e aguarde aprovação antes de continuar

---

Comece pela FASE 1. Leia todos os arquivos e apresente o diagnóstico completo antes de alterar qualquer coisa.
