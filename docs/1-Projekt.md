# 1. Opseg projekta

## 1.1 Problem i cilj projekta

Mladim umjetnicima može biti teško pronaći umjetničke prilike, a organizatorima umjetničkih događanja valjane radove koji bi bili predstavljeni. Cilj ArtConnect web platforme je omogućiti povezivanje umjetnika i organizatora kako bi ostvarili suradnju na projektima.

Umjetnicima i organizatorima omogućena je besplatna registracija i prijava na platformu, dodavanje događaja na kojima sudjeluju u osobni kalendar kao i prikaz fizičkih lokacija izložbi na karti.

Jedna od glavnih poteškoća mladim umjetnicima može biti upravljanje vlastitim portfolijom. ArtConnect omogućuje izradu i uređivanje javnih digitalnih portfolija kako bi umjetnici mogli lakše prikazati svoja djela i slati ih na natječaje. 

Umjetnicima također može biti teško pronaći događaje na kojima bi predstavili svoja djela. Platforma nudi pretraživanje prilika koje odgovaraju njihovom području umjetnosti kako bi prikazali svoje radove i povezali se s drugim profesionalcima iz njihovog područja djelovanja.

Organizatorima izazov predstavlja promoviranje umjetničkih prilika koje organiziraju i pronalaženje odgovarajućih kandidata. Cilj ArtConnect-a je omogućiti organizatorima lakšu objavu natječaja te pregled prijava kako bi našli umjetnike koji najbolje odgovaraju zadanim kriterijima. 

## 1.2 Ciljani korisnici i dionici

| Skupina korisnika ili dionika | Potreba ili interes relevantan za ovaj projekt |
| --- | --- |
| Umjetnik | Pronaći informacije o umjetničkim prilikama, izraditi digitalni portfolijo kako bi se prijavili na odabrani natječaj, pratiti status prijave, prikazati ostvarena sudjelovanja na projektima. |
| Organizator | Objavljivanje umjetničkih prilika, pregled prijava umjetnika te njihovo prihvaćanje ili odbijanje, pregled osnovnih statistika prijava, objava rezultata organiziranih događaja. |
| Administrator platforme | Upravljanje korisnicima, objavljenim sadržajem, organizatorima, kategorijama umjetnosti, kriterijima za pretraživanje i osnovnim postavkama sustava. |

## 1.3 Granice projekta

**Uključeno:** Povezivanje umjetnika i organizatora kroz cijeli tijek suradnje: umjetnik izrađuje digitalni portfolio i određuje koja su djela javna, organizator objavljuje umjetničku priliku, umjetnik se na nju prijavljuje portfolijom i prati status prijave, a organizator prijave pregledava, prihvaća ili odbija (uz razlog odbijanja) te nakon događanja objavljuje rezultate. Sudjelovanja ostvarena putem platforme prikazuju se na profilu umjetnika. Uz to su uključeni pretraživanje prilika prema području umjetnosti, lokaciji i roku, osnovne statistike prijava za organizatore te administratorsko upravljanje korisnicima, sadržajem, kategorijama umjetnosti i mjesečnim izvještajima o korištenju.
**Izvan opsega ili odgođeno:** Platforma ne obrađuje plaćanja ni prodaju djela. Informacija o nagradi ili naknadi samo se prikazuje uz priliku, a prihvaćanje prijave označava odabir umjetnika i ne predstavlja ugovor niti posredovanje u financijskom dogovoru između umjetnika i organizatora. Plaćanja bi zahtijevala integraciju platnog pristupnika te dodatne sigurnosne i pravne provjere koje nisu dio projektnog zadatka. Izravna komunikacija u stvarnom vremenu (chat) nije obuhvaćena; komunikacija između umjetnika i organizatora svodi se na statuse prijava i razloge odbijanja.
**Vanjske ovisnosti:** Vanjski servis za autentifikaciju (OAuth 2.0) za registraciju i prijavu korisnika; Google Maps API za prikaz lokacije događanja na fizičkoj adresi; Google Calendar za dodavanje događanja u osobni kalendar prihvaćenog umjetnika. Platforma ostaje odgovorna za vlastite podatke o korisnicima, portfolijima, prilikama i prijavama.

## 1.4 Postojeći pristupi i opravdanost projekta

Umjetnici danas prilike najčešće pronalaze na specijaliziranim mrežnim platformama za natječaje (engl. *open calls*, *calls for entry*). Za usporedbu su odabrane četiri platforme koje rješavaju isti problem kao ArtConnect: pronalazak prilika, prijavu radova i odabir umjetnika.

**CaFÉ (CallForEntry.org)** vodi američka neprofitna organizacija WESTAF. Umjetnik u portfolio učitava uzorke radova, odabire natječaj, ispunjava uvjete prijave i po potrebi plaća kotizaciju, a istim se portfolijom može prijaviti na više natječaja. Portfolio je privatan i služi samo za prijave, a natječaji se pretražuju prema američkim regijama i saveznim državama. Organizatori plaćaju početnu i godišnju naknadu te naknade po natječaju i po prijavi, a kotizacije umjetnika prolaze kroz platformu.

**Submittable** je općenita platforma za upravljanje prijavama koju koriste neprofitne organizacije, zaklade i sveučilišta za stipendije, rezidencije i višefazne postupke odabira. Nastala je kao sustav za prijave u književne časopise, pa nije usmjerena isključivo na likovnu umjetnost. Umjetnik otvara jedan račun kojim se prijavljuje kod svih organizacija koje koriste Submittable, a radove prilaže uz svaku pojedinu prijavu. Organizatorima nudi prilagodljive obrasce i naplatu kotizacija kroz platformu.

**Zealous** je neovisna britanska platforma za prijave u kreativnim industrijama, osnovana 2011. godine. Umjetnici na njoj na jednom mjestu pretražuju natječaje, rezidencije, narudžbe i fondove te izrađuju besplatan portfolio koji se može javno prikazati i priložiti uz prijave. Organizatorima nudi više krugova ocjenjivanja, komentare članova žirija i praćenje broja prijava u stvarnom vremenu.

**artconnect.com** je berlinska platforma koja umjetnicima nudi pretraživanje međunarodnih natječaja, rezidencija, stipendija i izložbi, profil s portfolijom te profesionalne resurse. Za umjetnike je besplatna, uz plaćeni profesionalni plan, a organizacije prolaze postupak verifikacije kako bi umjetnici imali povjerenja u objavljene natječaje. Platforma ima isto ime kao naš projekt, ali s njim nije povezana.

| Značajka | CaFÉ | Submittable | Zealous | artconnect.com | **ArtConnect (naš projekt)** |
| --- | --- | --- | --- | --- | --- |
| Usmjerenost | SAD, javne i institucionalne izložbe | Općenito (stipendije, grantovi, časopisi) | UK, kreativne industrije | Međunarodno | Mladi umjetnici i lokalni organizatori |
| Javni portfolio umjetnika | Ne (privatan, samo za prijave) | Ne | Da | Da | Da, s odabirom javnih djela |
| Prijava portfolijom na natječaj | Da | Da (prilozi uz obrazac) | Da | Da | Da |
| Naplata kotizacija kroz platformu | Da | Da | Moguća | – | Ne, platforma je besplatna |
| Prikaz lokacije događanja na karti | – | – | – | – | Da (Google Maps) |
| Dodavanje događanja u osobni kalendar | – | – | – | – | Da (Google Calendar) |
| Ostvarena sudjelovanja na profilu | – | – | – | – | Da, automatski nakon objave rezultata |

*„–” znači da funkcionalnost nije navedena u javno dostupnim opisima platforme.*

Postojeće platforme dobro rješavaju objavu natječaja i slanje prijava, ali su usmjerene na velik broj međunarodnih ili američkih natječaja, a troškove često prenose na organizatore i umjetnike kroz naknade i kotizacije. ArtConnect se opsegom ne natječe s tim platformama. Namijenjen je mladim umjetnicima i lokalnim organizatorima kojima treba jednostavan, besplatan alat za cijeli tijek suradnje na jednom mjestu: od javnog portfolija i prijave, preko odluke s obrazloženjem odbijanja, do lokacije događanja na karti, upisa u osobni kalendar i prikaza ostvarenog sudjelovanja na profilu umjetnika.

**Izvori:**
- CaFÉ: [Applying to a Call for Entry on CaFÉ: A Checklist](https://www.callforentry.org/applying-to-a-call-for-entry-on-cafe-a-checklist); [CaFÉ Artist Help Center – How to Apply](https://artist-help.callforentry.org/col/intro); [CaFÉ Artist Help Center – Searching for Calls](https://artist-help.callforentry.org/doc/searching-for-calls); [EntryThingy – Best Tools to Collect Artist Payments](https://www.entrythingy.com/blog/best-tools-to-collect-artist-payments)
- Submittable: [EntryThingy – Best CaFÉ Alternatives 2026](https://www.entrythingy.com/blog/5-best-call-for-entry-cafe-alternatives-2026); [Zealous – Submissions Platforms for the Creative Industries](https://zealous.co/about/?p=31553); [CREATE Magazine – Submission FAQ](https://www.createmagazine.com/faq-submission)
- Zealous: [Zealous – Company](https://zealous.co/x/company); [Zealous – The Platform That Creatives Come Back To](https://zealous.co/about/insights/zealous-the-platform-that-creatives-come-back-to/); [Zealous – Arts Residency Platform](https://zealous.co/about/arts-residency-platform/)
- artconnect.com: [ArtConnect – For Artists](https://artconnect.com/artists); [ArtConnect Relaunches with Exciting New Features](https://magazine.artconnect.com/editorial/relaunch); [Artist Trust – ArtConnect Artists to Watch](https://artisttrust.org/opportunities/artists-to-watch-2021-calls-submissions-6)
