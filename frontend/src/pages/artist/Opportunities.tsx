import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { artistApi, daysLeft, formatDate } from '../../services/artistApi';
import { ART_FIELDS, type Opportunity } from '../../types/artist';
import { Empty, Loading, OpportunityBadge } from '../../components/artist/ui';

type Sort = 'deadline' | 'event';

export default function Opportunities() {
  const [all, setAll] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [field, setField] = useState('');
  const [city, setCity] = useState('');
  const [onlyOpen, setOnlyOpen] = useState(true);
  const [sort, setSort] = useState<Sort>('deadline');

  useEffect(() => {
    artistApi.getOpportunities().then(setAll).finally(() => setLoading(false));
  }, []);

  const cities = useMemo(() => [...new Set(all.map((o) => o.city))].sort(), [all]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    return all
      .filter((o) => (onlyOpen ? o.status === 'otvoreno' : true))
      .filter((o) => (field ? o.field === field : true))
      .filter((o) => (city ? o.city === city : true))
      .filter((o) => (t ? `${o.title} ${o.organizer} ${o.description}`.toLowerCase().includes(t) : true))
      .sort((a, b) => (sort === 'deadline' ? a.deadline.localeCompare(b.deadline) : a.eventDate.localeCompare(b.eventDate)));
  }, [all, q, field, city, onlyOpen, sort]);

  return (
    <>
      <header className="ac-page-head">
        <h1>Prilike</h1>
        <p className="ac-muted">Natječaji, izložbe i radionice koje traže mlade umjetnike.</p>
      </header>

      <form className="ac-filters" onSubmit={(e) => e.preventDefault()} role="search">
        <input className="ac-input ac-input--grow" type="search" placeholder="Pretraži po nazivu ili organizatoru" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Pretraga" />
        <select className="ac-input" value={field} onChange={(e) => setField(e.target.value)} aria-label="Područje umjetnosti">
          <option value="">Sva područja</option>
          {ART_FIELDS.map((f) => <option key={f}>{f}</option>)}
        </select>
        <select className="ac-input" value={city} onChange={(e) => setCity(e.target.value)} aria-label="Lokacija">
          <option value="">Sve lokacije</option>
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="ac-input" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sortiranje">
          <option value="deadline">Rok za prijavu</option>
          <option value="event">Datum događanja</option>
        </select>
        <label className="ac-check">
          <input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} />
          Samo otvorene
        </label>
      </form>

      {loading ? <Loading /> : results.length === 0 ? (
        <Empty title="Nema prilika za odabrane filtere" text="Probaj ukloniti filter područja ili lokacije." />
      ) : (
        <div className="ac-grid">
          {results.map((o) => (
            <Link key={o.id} to={`/umjetnik/prilike/${o.id}`} className="ac-card ac-card--link">
              <div className="ac-card__top">
                <span className="ac-chip">{o.field}</span>
                <OpportunityBadge status={o.status} />
              </div>
              <h3>{o.title}</h3>
              <p className="ac-muted">{o.organizer} · {o.city}</p>
              <dl className="ac-meta">
                <div><dt>Rok</dt><dd>{formatDate(o.deadline)}{o.status === 'otvoreno' && daysLeft(o.deadline) >= 0 ? ` (još ${daysLeft(o.deadline)} d)` : ''}</dd></div>
                {o.reward && <div><dt>Naknada</dt><dd>{o.reward}</dd></div>}
              </dl>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
