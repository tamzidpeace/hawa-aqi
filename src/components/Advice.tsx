import { adviceFor, type Band } from '../lib/aqi';
import { makeT, type Lang } from '../lib/i18n';
import { Icon } from './Icon';

export function Advice({ band, lang }: { band: Band; lang: Lang }) {
  const t = makeT(lang);
  const items = adviceFor(band.key, lang);
  return (
    <section className="card advice-card">
      <div className="sec-title">{t('whatNow')}</div>
      <ul className="advice-list">
        {items.map((a) => (
          <li className="advice-item" key={a.text}>
            <span className="advice-ic">
              <Icon name={a.icon} size={17} />
            </span>
            <span>{a.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
