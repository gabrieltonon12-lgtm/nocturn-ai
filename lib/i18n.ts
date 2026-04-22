import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ptBR from '../locales/pt-BR.json'
import enUS from '../locales/en-US.json'

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        'pt-BR': { translation: ptBR },
        'en-US': { translation: enUS },
      },
      lng: typeof window !== 'undefined'
        ? (localStorage.getItem('nocturn_language') || 'pt-BR')
        : 'pt-BR',
      fallbackLng: 'pt-BR',
      defaultNS: 'translation',
      interpolation: { escapeValue: false },
    })
}

export default i18n
