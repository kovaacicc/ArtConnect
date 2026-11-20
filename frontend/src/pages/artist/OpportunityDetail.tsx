import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { opportunitiesApi } from '../../services/opportunitiesApi';
import { formatDate } from '../../services/artistApi';
import type { Opportunity } from '../../types/artist';
import { Empty, Loading, NotImplemented, OpportunityBadge } from '../../components/artist/ui';

export default function OpportunityDetail() {
  const { id = '' } = useParams();
  const [opp, setOpp] = useState<Opportunity | null | undefined>(undefined);

  useEffect(() => {
    const numericId = Number(id);
    if (isNaN(numericId)) { setOpp(null); return; }
    opportunitiesApi.get(numericId).then(setOpp).catch(() => setOpp(null));
  }, [id]);

  if (opp === undefined) return <Loading />;
  if (opp === null) return <Empty title="Prilika nije pronađena" action={<Link className="ac-btn" to="/umjetnik/prilike">Natrag na prilike</Link>} />;

  return (
    <>
      <Link to="/umjetnik/prilike" className="ac-back">← Sve prilike</Link>
      <header className="ac-page-head">
        <div className="ac-row"><span className="ac-chip">{opp.field_name}</span><OpportunityBadge status={opp.status} /></div>
        <h1>{opp.title}</h1>
        <p className="ac-muted">{opp.organizer_name}</p>
      </header>

      <div className="ac-cols--detail">
        <section>
          <p className="ac-prose">{opp.description}</p>
          <dl className="ac-meta ac-meta--stack">
            <div><dt>Rok za prijavu</dt><dd>{opp.deadline ? formatDate(opp.deadline) : 'Nema roka'}</dd></div>
            <div><dt>Događanje</dt><dd>{opp.starts_at ? formatDate(opp.starts_at) : 'Nije definirano'}</dd></div>
            <div><dt>Mjesto</dt><dd>{opp.address || 'Nije navedeno'}</dd></div>
            {opp.age_criteria && <div><dt>Dob</dt><dd>{opp.age_criteria}</dd></div>}
            {opp.reward && <div><dt>Nagrada / naknada</dt><dd>{opp.reward}</dd></div>}
          </dl>

          <h3 style={{ marginBottom: '0.75rem' }}>Prijava na priliku</h3>
          <NotImplemented />
        </section>

        {opp.address && (
          <section>
            <iframe
              className="ac-map"
              title={`Karta: ${opp.address}`}
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(opp.address)}&output=embed`}
            />
          </section>
        )}
      </div>
    </>
  );
}
