export default function MusicButton({ playing, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={playing ? 'Mute music' : 'Play music'}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-opacity duration-300 hover:opacity-100"
      style={{
        background:     'rgba(28,53,32,0.88)',
        border:         '1px solid rgba(184,150,60,0.35)',
        backdropFilter: 'blur(8px)',
        opacity:        playing ? 0.9 : 0.55,
      }}
    >
      <span className="text-gold select-none" style={{ fontSize: '1rem', lineHeight: 1 }}>
        {playing ? '♪' : '♩'}
      </span>
    </button>
  )
}
