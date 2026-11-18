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

**Javno dostupna aplikacija:** https://artconnect.austriaeast.cloudapp.azure.com/

**Isprobajte:** [Jedna ili dvije kratke radnje koje pokazuju funkcionalan korisnički tijek.]

**Demonstracija:** Pri otvaranju stranice klikne se gumb "Prijavi se putem Googlea", što korisnika zatim odvede na Google za prijavu. Ako se korisnik nije prethodno registrirao, treba upisati svoje podatke za registraciju, u suprotnom odmah dobiva pristup stranici.

**Ograničenja:** [Kratko navedite ograničenja postavljene inačice ili postavite poveznicu na jedinstveno mjerodavno mjesto u dokumentaciji s poznatim problemima.]

Aplikacija je postavljena na Azure virtualnoj mašini s Ubuntu 24.04 LTS OS-om.

<a id="quick-start"></a>
## Brzi početak / instalacija

**Preduvjeti:** Git, docker i docker compose

Lokalno pokretanje:
```bash
git clone https://github.com/kovaacicc/ArtConnect
cd ArtConnect
cp .env.example .env # te urediti .env
docker compose -f docker-compose-dev.yaml up --build
```

**Adresa:** http://artconnect.austriaeast.cloudapp.azure.com/

Produkcijsko pokretanje:
```bash
git clone https://github.com/kovaacicc/ArtConnect
cd ArtConnect
cp .env.example .env # te urediti .env
./init-letsencrypt.sh
docker compose -f docker-compose-prod.yaml up --build
```

**Adresa:** https://artconnect.austriaeast.cloudapp.azure.com/

**Konfiguracija:** Postaviti .env prema primjeru .env.example. Konfigurirati potrebne vanjske servise (Google OAuth, Maps i Calendar) te upisati odgovarajuće ključeve i tajne.

Pri navigaciji na web-stranicu, trebala bi se otvoriti stranica gdje se korisnik treba prijaviti sa svojim Google računom.

## Tehnologije

| Tehnologija ili alat | Uloga u ovom projektu | Razlog uporabe ili važno ograničenje |
| --- | --- | --- |
| Django | Komunikacija s bazom podataka i poslovna logika | Lak pristup bazi podataka te mnoštvo middleware-ova spremnih za upotrebu |
| React | Prikazuje korisničko sučelje | Iste komponente se koriste na više mjesta |
| PostgreSQL | Pohranjuje korisnike, njihove podatke i prilike | Podaci su relacijski; promjene sheme zahtjevaju migraciju |
| Docker | Pokretanje aplikacije u lokalnom i produkcijskom okruženju | Jednostavnost pokretanja aplikacije te jednako okruženje kod svih članova tima |

<a id="team-members"></a>
## Članovi tima

| Član | Glavna uloga ili doprinos |
| --- | --- |
| Luka | Backend i CI|
| Lovro | Frontend |
| Klara | Baza podataka i backend |
| Lara Š | Frontend i CI |
| Petar | Frontend i dizajn |
| Lara G | Frontend i backend |
| Karlo | Backend, DevOps, vođa |

## Doprinos projektu

Za doprinos projektu otvaraju se pull requestovi s jasnim objašnjenjem što se u kodu mijenja i zašto.

<a id="license"></a>
## Licenca [![CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**Status licence:** Projekt je licenciran pod MIT; vidi datoteku [LICENSE](LICENSE).

Dokumentacijski predložak kolegija sadrži otvorene obrazovne sadržaje (engl. Open Educational Resources, OER) i licenciran je licencom Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International.

Kod trećih strana, skupovi podataka, slike, ikone i ostali sadržaji zadržavaju vlastite licence i zahtjeve za navođenje izvora.

<a id="ai-usage"></a>
## Uporaba umjetne inteligencije [![AI Usage: Disclosed](https://img.shields.io/badge/AI%20Usage-Disclosed-blue.svg)](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf)

Ovaj projekt slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

**Izjava:** Tijekom razvoja koristimo alate umjetne inteligencije (primjerice Claude Code) isključivo kao pomoć i savjetodavni alat.. Svaki član tima pregledava sav kod i tekst prije nego što uđe u repozitorij te može objasniti vlastiti doprinos.

<a id="code-of-conduct-and-support"></a>
## Kodeks ponašanja i podrška [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

Od članova tima očekuje se pridržavanje **Kodeksa ponašanja studenata** Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu, pravila timskog rada na kolegiju i [Etičkog kodeksa IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html). [Postavite poveznicu na `CODE_OF_CONDUCT.md` ako se ta datoteka koristi u vašem repozitoriju.]

---

Struktura dokumentacije prilagođena je predlošku kolegija Programsko inženjerstvo FER-a autora [Vlade Sruka](https://www.fer.unizg.hr/vlado.sruk), licenciranom pod [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Aplikaciju i njezin sadržaj izradio je gore navedeni studentski tim.
