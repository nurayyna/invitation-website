/**
 * A gilt picture frame. With `src` it shows the photograph; without one it
 * shows a quiet placeholder so layouts can be judged before photos exist.
 * shape: 'portrait' (4:5) | 'landscape' (3:2) | 'arch' (4:5, arched top)
 *        'oval' (4:5, gilt oval) | 'lace' (3:2, mounted on lace-edged linen)
 */
export default function PhotoFrame({ src, alt = '', shape = 'portrait', placeholder = 'Photograph to come', className = '' }) {
  return (
    <figure className={`frame frame--${shape} ${shape === 'lace' ? 'lace' : ''} ${className}`} data-reveal="image">
      <div className="frame__window">
        {src ? (
          <img src={src} alt={alt} loading="lazy" decoding="async" data-reveal-inner />
        ) : (
          <div className="frame__placeholder" data-reveal-inner>
            <span className="frame__placeholder-mark" aria-hidden="true">❦</span>
            <span className="label">{placeholder}</span>
          </div>
        )}
      </div>
    </figure>
  )
}
