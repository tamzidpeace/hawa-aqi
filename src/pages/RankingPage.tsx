import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { bandOf } from '../lib/aqi';
import { makeT, type Lang } from '../lib/i18n';
import { getRanking, REGIONS, sortEntries, type RankEntry, type Region } from '../lib/ranking';

/** Full city ranking — Bangladesh / World (capitals & major cities), filterable. */
export default function RankingPage({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  const t = makeT(lang);
  const nav = useNavigate();
  const [group, setGroup] = useState<'bd' | 'world'>('bd');
  const [dir, setDir] = useState<'worst' | 'best'>('worst');
  const [entries, setEntries] = useState<RankEntry[] | null>(null);
  const [err, setErr] = useState(false);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<Region | 'all'>('all');

  const load = () => {
    setErr(false);
    setEntries(null);
    getRanking(group)
      .then((e) => setEntries(sortEntries(e, dir)))
      .catch(() => setErr(true));
  };

  useEffect(load, [group]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setEntries((prev) => (prev ? sortEntries(prev, dir) : prev));
  }, [dir]);

  const visible = useMemo(() => {
    if (!entries) return null;
    let v = entries;
    if (group === 'world') {
      if (region !== 'all') v = v.filter((c) => c.region === region);
      const q = query.trim();
      if (q) {
        const ql = q.toLowerCase();
        v = v.filter(
          (c) =>
            c.en.toLowerCase().includes(ql) ||
            c.bn.includes(q) ||
            (c.country ?? '').toLowerCase().includes(ql) ||
            (c.countryBn ?? '').includes(q),
        );
      }
    }
    return v;
  }, [entries, group, region, query]);

  const pick = (c: RankEntry) => {
    localStorage.setItem(
      'hawa.loc',
      JSON.stringify({
        name: lang === 'bn' ? c.bn : c.en,
        lat: c.lat,
        lon: c.lon,
        source: 'manual',
      }),
    );
    nav('/');
  };

  return (
    <div className="app" data-band="good">
      <div className="bg-blob b1" />
      <div className="bg-blob b2" />
      <div className="page">
        <header className="top">
          <div className="brand">
            <button className="icon-btn" onClick={() => nav('/')} aria-label={t('back')}>
              <Icon name="arrowLeft" size={18} />
            </button>
            <div>
              <div className="brand-name">{t('rankingTitle')}</div>
              <div className="brand-sub">
                {group === 'bd' ? t('bd') : t('world')} ·{' '}
                {dir === 'worst' ? t('worstFirst') : t('bestFirst')}
              </div>
            </div>
          </div>
          <div className="top-actions">
            <button
              className="icon-btn lang-btn"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              aria-label="Language"
            >
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>
          </div>
        </header>

        <main>
          <div className="rank-controls">
            <div className="tabs">
              <button className={`tab${group === 'bd' ? ' on' : ''}`} onClick={() => setGroup('bd')}>
                {t('bd')}
              </button>
              <button
                className={`tab${group === 'world' ? ' on' : ''}`}
                onClick={() => setGroup('world')}
              >
                {t('world')}
              </button>
            </div>
            <div className="tabs sm-tabs">
              <button
                className={`tab${dir === 'worst' ? ' on' : ''}`}
                onClick={() => setDir('worst')}
              >
                {t('worstFirst')}
              </button>
              <button className={`tab${dir === 'best' ? ' on' : ''}`} onClick={() => setDir('best')}>
                {t('bestFirst')}
              </button>
            </div>
          </div>

          {group === 'world' && (
            <>
              <div className="region-chips">
                {REGIONS.map((r) => (
                  <button
                    key={r.key}
                    className={`rchip${region === r.key ? ' on' : ''}`}
                    onClick={() => setRegion(r.key)}
                  >
                    {lang === 'bn' ? r.bn : r.en}
                  </button>
                ))}
              </div>
              <div className="rank-search">
                <Icon name="search" size={17} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('searchCities')}
                  enterKeyHint="search"
                />
                {query && (
                  <button className="icon-btn sm" onClick={() => setQuery('')} aria-label="×">
                    <Icon name="close" size={14} />
                  </button>
                )}
              </div>
            </>
          )}

          <section className="card">
            {err ? (
              <button className="nores retry" onClick={load}>
                {t('rankFail')}
              </button>
            ) : visible === null ? (
              <div className="rank-list">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skel rskel" />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="nores">{t('noMatch')}</div>
            ) : (
              <>
                {group === 'world' && (
                  <div className="rank-count">{t('nCities').replace('{n}', String(visible.length))}</div>
                )}
                <div className="rank-list">
                  {visible.map((c, i) => {
                    const band = c.aqi != null ? bandOf(c.aqi) : null;
                    return (
                      <button key={c.en} className="rank-row" onClick={() => pick(c)}>
                        <span className={`rank-no${i < 3 ? ' top' : ''}`}>{i + 1}</span>
                        <span className="rank-text">
                          <span className="rank-name">{lang === 'bn' ? c.bn : c.en}</span>
                          {group === 'world' && c.country && (
                            <span className="rank-sub">
                              {lang === 'bn' ? (c.countryBn ?? c.country) : c.country}
                            </span>
                          )}
                        </span>
                        {band && (
                          <span
                            className="rank-band"
                            style={{
                              color: band.color,
                              borderColor: `${band.color}66`,
                              background: `${band.color}1a`,
                            }}
                          >
                            {lang === 'bn' ? band.bn : band.en}
                          </span>
                        )}
                        <span className="rank-aqi" style={{ color: band?.color ?? 'inherit' }}>
                          {c.aqi ?? '—'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </main>

        <footer>
          <div>{t('source')}</div>
          <div>{t('disclaimer')}</div>
        </footer>
      </div>
    </div>
  );
}
