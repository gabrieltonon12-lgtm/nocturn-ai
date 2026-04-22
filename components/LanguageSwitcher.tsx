import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const isEN = i18n.language === 'en-US'

  const toggle = () => {
    const next = isEN ? 'pt-BR' : 'en-US'
    i18n.changeLanguage(next)
    if (typeof window !== 'undefined') localStorage.setItem('nocturn_language', next)
  }

  return (
    <button
      onClick={toggle}
      title={isEN ? 'Switch to Portuguese' : 'Switch to English'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 10px',
        borderRadius: '8px',
        border: '1px solid #E4E4E7',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 500,
        color: '#52525B',
        fontFamily: "'Inter',system-ui,sans-serif",
        transition: 'border-color .15s, background .15s',
        flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#F4F4F5'; e.currentTarget.style.borderColor = '#D4D4D8' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#E4E4E7' }}
    >
      <span style={{ fontSize: '14px', lineHeight: 1 }}>{isEN ? '🇺🇸' : '🇧🇷'}</span>
      <span>{isEN ? 'EN' : 'PT'}</span>
    </button>
  )
}
