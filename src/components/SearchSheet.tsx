import { useEffect, useState } from 'react';
import { QUICK_PLACES, searchPlaces, type Place } from '../lib/api';
import type { SavedPlace } from '../lib/hooks';
import { makeT, type Lang } from '../lib/i18n';
import { Icon } from './Icon';

export function SearchSheet({
  open,
  lang,
  saved,
  onClose,
  onPick,
  onUseGps,
  onRemoveSaved,
}: {
  open: boolean;
  lang: Lang;
  saved: SavedPlace[];
  onClose: () => void;
  onPick: (p: Place) => void;
  onUseGps: () => void;
  onRemoveSaved: (p: SavedPlace) => void;
}) {
  const t = makeT(lang);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Place[] | null>(null);
  const [busy, setBusy] = useState(false);

  // keep mounted briefly after close for the slide-down animation
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) setMounted(true);
    else {
      const id = setTimeout(() => setMounted(false), 340);
      return () => clearTimeout(id);
    }
  }, [open]);

  // lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // debounced search
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(async () => {
      if (q.trim().length < 2) {
        setResults(null);
        return;
      }
      setBusy(true);
      try {
        setResults(await searchPlaces(q.trim(), lang));
      } finally {
        setBusy(false);
      }
    }, 350);
    return () => clearTimeout(id);
  }, [q, lang, open]);

  if (!mounted) return null;

  return (
    <div className={`sheet-wrap${open ? ' open' : ''}`} role="dialog" aria-modal="true">
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-head">
          <div className="sheet-title">{t('searchTitle')}</div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="sheet-search">
          <Icon name="search" size={18} />
          <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('searchPlaceholder')}
            enterKeyHint="search"
          />
          {q && (
            <button className="icon-btn sm" onClick={() => setQ('')} aria-label="Clear">
              <Icon name="close" size={15} />
            </button>
          )}
        </div>

        {results === null ? (
          <>
            {saved.length > 0 && (
              <>
                <div className="sheet-label">{t('savedTitle')}</div>
                <div className="chips">
                  {saved.map((p) => (
                    <div className="chip-group" key={`${p.name}-${p.lat}`}>
                      <button className="chip" onClick={() => onPick({ ...p })}>
                        {p.name}
                      </button>
                      <button
                        className="chip chip-x"
                        onClick={() => onRemoveSaved(p)}
                        aria-label="×"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="sheet-label">{t('popular')}</div>
            <div className="chips">
              {QUICK_PLACES.map((c) => (
                <button
                  key={c.en}
                  className="chip"
                  onClick={() =>
                    onPick({
                      name: lang === 'bn' ? c.bn : c.en,
                      admin1: 'Bangladesh',
                      lat: c.lat,
                      lon: c.lon,
                    })
                  }
                >
                  {lang === 'bn' ? c.bn : c.en}
                </button>
              ))}
            </div>
            <button className="btn btn-ghost gps-btn" onClick={onUseGps}>
              <Icon name="locate" size={18} />
              {t('useLocation')}
            </button>
          </>
        ) : busy ? (
          <div className="nores">{t('locating')}</div>
        ) : results.length === 0 ? (
          <div className="nores">{t('noResults')}</div>
        ) : (
          <div className="results">
            {results.map((r) => (
              <button
                key={`${r.name}-${r.lat}-${r.lon}`}
                className="result"
                onClick={() => onPick(r)}
              >
                <Icon name="pin" size={17} />
                <div className="result-text">
                  <div className="result-name">{r.name}</div>
                  <div className="result-sub">
                    {[r.admin1, r.country].filter(Boolean).join(', ')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
