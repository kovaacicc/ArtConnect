# ArtConnect

ArtConnect je web platforma koja povezuje mlade umjetnike i organizatore raznih umjetničkih događanja. Umjetnici grade svoj digitalni portfolio i prijavljuju se na prilike, a organizatori objavljuju natječaje i pregledavaju prijave.

**Projekt na kolegiju:** Ovu je aplikaciju razvio studentski tim u sklopu kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva (FER) Sveučilišta u Zagrebu.

## Opis aplikacije

Mladim umjetnicima je teško pronaći prilike u kojima mogu predstaviti svoj rad, a organizatorima je teško doći do kandidata. ArtConnect je besplatna platforma za umjetnike i organizatore koja umjetnicima na jednom mjestu nudi stvaranje umjetničkog portfolija, pretraživanje prilika i upravljanje prijavama, a organizatorima objavljivanje prilika.

**Ključne funkcionalnosti**

- Umjetnik izrađuje i uređuje javni digitalni portfolio s biografijom i djelima te odlučuje koja su djela javno vidljiva.
- Umjetnik pretražuje prilike prema području umjetnosti, lokaciji i roku za prijavu te se na njih prijavljuje uz praćenje statusa prijave.

Za potpuni opseg, zahtjeve, oblikovanje i dokaze ispitivanja pogledajte [docs](docs/Home.md).

<a id="deployment"></a>
## Postavljanje (engl. deployment)

<!-- UPUTA: Obavezno od kontrolne točke 1 (8. tjedan). Provjerite vodi li URL na javno dostupnu pokrenutu aplikaciju i radi li navedeni tijek uporabe. Nikada ne objavljujte lozinke ni pristupne tokene. -->

**Javno dostupna aplikacija:** [Javni URL]

**Isprobajte:** [Jedna ili dvije kratke radnje koje pokazuju funkcionalan korisnički tijek.]

**Demonstracija:** [Objasnite kako dobiti potreban ograničeni pristup ako je prijava obavezna; u suprotnom napišite „Korisnički račun nije potreban.” Ovdje ne objavljujte lozinke ni pristupne tokene.]

**Ograničenja:** [Kratko navedite ograničenja postavljene inačice ili postavite poveznicu na jedinstveno mjerodavno mjesto u dokumentaciji s poznatim problemima.]

[Vodič za postavljanje i pokretanje] opisuje smještaj aplikacije (engl. hosting) koji tim stvarno koristi. Tim može koristiti Render ili drugu platformu koju ste dogovorili s asistentom/demonstratorom.

<a id="quick-start"></a>
## Brzi početak / instalacija

<!-- Obavezno od Demo 1 nadalje. Zamijenite mjesta za unos naredbama koje je drugi član tima uspješno izvršio nakon čistog kloniranja repozitorija. Detaljne upute za administraciju držite u projektnoj dokumentaciji u direktoriju docs/. -->

**Preduvjeti:** [Potrebno izvršno okruženje (engl. runtime) i verzija, upravitelj paketa (engl. package manager), baza podataka ili vanjska usluga ako je nužna.]

```bash
git clone [repository URL]
cd [repository directory]
[install dependencies]
[run the application]
```

**Adresa:** [Na primjer, stvarna adresa koju aplikacija ispiše nakon pokretanja.]

**Konfiguracija:** [Navedite potrebne varijable okruženja (engl. environment variables) ili uputite na sigurnu datoteku `.env.example`; objasnite gdje se dobivaju vrijednosti. Nikada ne stavljajte stvarne pristupne podatke u ovu datoteku, primjer konfiguracije, snimke zaslona, zapise ni zapise promjena (engl. commits).]

[Dodajte kratak korak provjere, primjerice koja se stranica treba otvoriti ili koja naredba pokreće osnovnu provjeru.] Za detaljno postavljanje pogledajte [projektnu dokumentaciju].

## Tehnologije

Navedite nekoliko tehnologija i vanjskih usluga koje bitno određuju kako vaša aplikacija radi. Za svaku navedite njezinu konkretnu ulogu i jedan razlog ili ograničenje važno za projekt. Alat za razvoj ili ispitivanje uključite samo ako je njegova uloga važna za razumijevanje načina na koji je projekt izrađen ili provjeren. Nemojte prepisivati popis ovisnosti (engl. dependencies), statistiku programskih jezika ni popis razvojnih okruženja i komunikacijskih alata. Tablicu provjerite prema stvarnom repozitoriju i pokrenutoj aplikaciji; potrebne verzije i konfiguraciju dokumentirajte u vodiču za instalaciju.

| Tehnologija ili alat | Uloga u ovom projektu | Razlog uporabe ili važno ograničenje |
| --- | --- | --- |
| Django | Backend |  |
| React / TypeScript | Frontend | |
| PostgreSQL | Baza podataka |  |
| Docker | Pokretanje aplikacije u kontejneru |  |
| GitHub Actions | Testovi kod pull requestova |  |

<details>
<summary><strong>Primjer: objašnjenje ključnih tehnoloških odluka</strong></summary>

**Primjer — CrisisMap:**

| Tehnologija ili alat | Uloga u ovom projektu | Razlog uporabe ili važno ograničenje |
| --- | --- | --- |
| React | Prikazuje obrazac za prijavu i kartu kriznih događaja u pregledniku. | Karta i poslane prijave mogu se ažurirati bez ponovnog učitavanja cijele stranice. |
| PostgreSQL | Pohranjuje prijave, lokacije i njihove odnose. | Zapisi o prijavama moraju ostati povezani s autorima i lokacijama; promjene sheme zahtijevaju migracije baze podataka (engl. database migrations). |
| Usluga kartografskih pločica (engl. map tile service) | Omogućuje prikaz karte u pregledniku. | Karta ovisi o vanjskoj usluzi; slanje prijave mora imati definirano ponašanje i kada kartografske pločice nisu dostupne. |

**Analiza primjera:** Svaki redak opisuje ulogu ili posljedicu konkretne tehnologije u ovoj aplikaciji. Verzije paketa pripadaju datotekama s ovisnostima projekta; verzije izvršnog okruženja i konfiguracija važna za postavljanje pripadaju vodiču za instalaciju. Važne kompromise u oblikovanju (engl. design trade-offs) objasnite na stranici arhitekture u direktoriju `docs/` umjesto da ovdje ponavljate cijeli zapis odluke. Navodite samo usluge koje vaš tim stvarno integrira.

</details>

<a id="team-members"></a>
## Članovi tima

| Član | Glavna uloga ili doprinos |
| --- | --- |
| Luka | Backend |
| Lovro | Frontend |
| Klara | Baza podataka i backend |
| Lara Š | Frontend i CI |
| Petar | Frontend i dizajn |
| Lara G | Frontend i backend |
| Karlo | Backend, DevOps, vođa |

## Doprinos projektu

[Ako je primjenjivo, u dvije rečenice opišite kako se predlaže zadatak ili prijavljuje nedostatak, kako se pregledava promjena koda i gdje se nalazi aktualna evidencija zadataka. Ako tim održava `CONTRIBUTING.md`, ovdje postavite poveznicu umjesto ponavljanja pravila. Nemojte stvarati tu datoteku samo zato da biste popunili ovaj odjeljak.]

<a id="license"></a>
## Licenca [![CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**Status licence:** Projekt je licenciran pod MIT; vidi datoteku [LICENSE](LICENSE).

Dokumentacijski predložak kolegija sadrži otvorene obrazovne sadržaje (engl. Open Educational Resources, OER) i licenciran je licencom Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. Ta licenca **ne određuje automatski licencu studentske aplikacije**; tim treba jasno navesti licencu svojeg projekta u prethodnom retku i datoteci `LICENSE`, ako je primjenjivo.

Kod trećih strana, skupovi podataka, slike, ikone i ostali sadržaji zadržavaju vlastite licence i zahtjeve za navođenje izvora. [Po potrebi postavite poveznicu na dodatne zahvale i izvore.]

<a id="ai-usage"></a>
## Uporaba umjetne inteligencije [![AI Usage: Disclosed](https://img.shields.io/badge/AI%20Usage-Disclosed-blue.svg)](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf)

Ovaj projekt slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

**Izjava:** Tijekom razvoja koristimo alate umjetne inteligencije (primjerice Claude Code) isključivo kao pomoć i savjetodavni alat.. Svaki član tima pregledava sav kod i tekst prije nego što uđe u repozitorij te može objasniti vlastiti doprinos.

<a id="code-of-conduct-and-support"></a>
## Kodeks ponašanja i podrška [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

Od članova tima očekuje se pridržavanje **Kodeksa ponašanja studenata** Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu, pravila timskog rada na kolegiju i [Etičkog kodeksa IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html). [Postavite poveznicu na `CODE_OF_CONDUCT.md` ako se ta datoteka koristi u vašem repozitoriju.]

---

Struktura dokumentacije prilagođena je predlošku kolegija Programsko inženjerstvo FER-a autora [Vlade Sruka](https://www.fer.unizg.hr/vlado.sruk), licenciranom pod [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Aplikaciju i njezin sadržaj izradio je gore navedeni studentski tim.
