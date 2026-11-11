export default function MusicButton({ playing, onToggle }) {
  return (
    <button
      type="button"
      className="music"
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? 'Pause music' : 'Play music'}
    >
      <span aria-hidden="true">{playing ? '♪' : '♩'}</span>
    </button>
  )
}
