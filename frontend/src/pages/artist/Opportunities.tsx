import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { opportunitiesApi } from '../../services/opportunitiesApi';
import { daysLeft, formatDate } from '../../services/artistApi';
import type { Opportunity } from '../../types/artist';
import { Empty, Loading, OpportunityBadge } from '../../components/artist/ui';

type Sort = 'deadline' | 'event';

export default function Opportunities() {
  const [all, setAll] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [field, setField] = useState('');
  const [address, setAddress] = useState('');
  const [onlyOpen, setOnlyOpen] = useState(true);
  const [sort, setSort] = useState<Sort>('deadline');

  useEffect(() => {
    opportunitiesApi.list()
      .then(setAll)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    return all
      .filter((o) => (onlyOpen ? o.status === 'open' : true))
      .filter((o) => (field ? o.field_name === field : true))
      .filter((o) => (address ? o.address.toLowerCase().includes(address.toLowerCase()) : true))
      .filter((o) => (t ? `${o.title} ${o.organizer_name} ${o.description}`.toLowerCase().includes(t) : true))
      .sort((a, b) => {
        if (sort === 'deadline') {
          return (a.deadline || '9999').localeCompare(b.deadline || '9999');
        }
        return (a.starts_at || '9999').localeCompare(b.starts_at || '9999');
      });
  }, [all, q, field, address, onlyOpen, sort]);

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
          {[...new Set(all.map(o => o.field_name))].map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <input className="ac-input" placeholder="Lokacija (adresa)" value={address} onChange={(e) => setAddress(e.target.value)} aria-label="Lokacija" />
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
                <span className="ac-chip">{o.field_name}</span>
                <OpportunityBadge status={o.status} />
              </div>
              <h3>{o.title}</h3>
              <p className="ac-muted">{o.organizer_name} · {o.address}</p>
              <dl className="ac-meta">
                <div><dt>Rok</dt><dd>{o.deadline ? formatDate(o.deadline) : 'Nema roka'}{o.status === 'open' && o.deadline && daysLeft(o.deadline) >= 0 ? ` (još ${daysLeft(o.deadline)} d)` : ''}</dd></div>
                {o.reward && <div><dt>Naknada</dt><dd>{o.reward}</dd></div>}
              </dl>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}