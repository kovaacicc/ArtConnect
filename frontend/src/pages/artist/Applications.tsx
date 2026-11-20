import { NotImplemented } from '../../components/artist/ui';

export default function Applications() {
  return (
    <>
      <header className="ac-page-head">
        <h1>Moje prijave</h1>
        <p className="ac-muted">Prati status svake prijave i odgovori na zahtjeve organizatora.</p>
      </header>
      <NotImplemented what="Pregled prijava bit će dostupan kad backend dobije endpoint za prijave umjetnika." />
    </>
  );
}
