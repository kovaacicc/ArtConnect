# 2. Analiza zahtjeva

## 2.1 Funkcijski zahtjevi

| **ID** | **Opis**                                                                                                                                                                                                                             | **Prioritet** | **Izvor**        | **Kriterij prihvaćanja**                                                                                                                                                            |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F-001  | Sustav omogućuje registraciju računa te prijavu i odjavu korisnika putem vanjskog servisa za autentifikaciju (OAuth2.0).                                                                                                                                           | Visok         | odobreni zadatak | Korisnik se može registrirati preko OAuth pružatelja i odabrati ulogu. Račun se kreira s odabranom ulogom.                                                                          |
| F-001.1  | Sustav omogućuje odabir uloge umjetnika ili organizatora pri registraciji.                                                                                                                                                           | Visok         | odobreni zadatak | Korisnik tijekom prijave može odabrati ulogu umjetnika ili organizatora. Račun se kreira s odabranom ulogom.                                                                        |
| F-002  | Sustav pri registraciji umjetnika bilježi osnovne podatke, područje umjetničkog djelovanja i, ako postoje, poveznice na web-stranice ili društvene mreže.                                                                            | Srednji       | odobreni zadatak | Umjetnik pri registraciji unosi podatke i područje djelovanja. Poveznice su neobavezne. Podaci su vidljivi na njegovu profilu.                                                      |
| F-003  | Sustav omogućuje umjetniku izradu i uređivanje digitalnog portfolija: biografije, opisa umjetničkog rada te podataka o prethodnim izložbama i projektima.                                                                            | Visok         | odobreni zadatak | Umjetnik može unijeti i izmijeniti navedene podatke. Izmjene su odmah vidljive u portfoliju.                                                                                        |
| F-004  | Sustav omogućuje umjetniku dodavanje djela u portfolio s nazivom, godinom nastanka, tehnikom, dimenzijama, opisom i priloženim fotografijama ili datotekama.                                                                         | Nizak         | odobreni zadatak | Umjetnik može dodati djelo sa svim navedenim podacima i datotekama. Djelo se prikazuje u portfoliju.                                                                                |
| F-005  | Sustav omogućuje umjetniku uređivanje i brisanje djela te određivanje je li pojedino djelo javno dostupno.                                                                                                                           | Nizak         | odobreni zadatak | Umjetnik može izmijeniti ili obrisati djelo. Djelo označeno kao NIJE JAVNO nije vidljivo drugim korisnicima.                                                                        |
| F-006  | Sustav prikazuje drugim korisnicima javni portfolio umjetnika, uključujući samo djela označena kao javna.                                                                                                                            | Srednji       | odobreni zadatak | Organizator i drugi korisnici mogu otvoriti profil umjetnika i vide samo javna djela.                                                                                               |
| F-007  | Sustav omogućuje organizatoru objavu prilike (natječaj, izložba, radionica) s nazivom, opisom, rokom za prijavu, mjestom održavanja, područjem umjetnosti, dobnim ili drugim kriterijem te nagradom ili naknadom, ako postoji.       | Visok         | odobreni zadatak | Organizator može unijeti sve navedene podatke i objaviti priliku. Objavljena prilika vidljiva je umjetnicima.                                                                       |
| F-007.1 | Sustav omogućuje objavu prilike samo organizatoru čiji je račun odobrio administrator. Neodobreni organizator može pripremati i uređivati nacrte prilika, ali ih ne može objaviti. | Srednji | dogovor tima | Neodobreni organizator može spremiti nacrt, ali ga ne može objaviti. Nakon što administrator odobri račun, organizator može objaviti isti nacrt. |
| F-008  | Sustav za događanja na fizičkoj lokaciji prikazuje lokaciju na karti putem vanjskog kartografskog servisa, na temelju adrese koju je unio organizator.                                                                               | Nizak         | odobreni zadatak | Uz priliku s unesenom adresom prikazuje se karta s ispravno označenom lokacijom.                                                                                                    |
| F-009  | Sustav vodi status prilike (priprema, otvoreno za prijave, prijave zatvorene, u procesu odabira, završeno) i omogućuje organizatoru uređivanje prilike i promjenu statusa.                                                           | Visok         | odobreni zadatak | Organizator može urediti priliku i promijeniti joj status. Prijave je moguće slati samo dok je status "otvoreno za prijave".                                                        |
| F-010  | Sustav omogućuje organizatoru da mijenja podatke objavljene prilike i briše vlastitu objavljenu priliku uz obrazloženje.                                                                                                             | Nizak         | odobreni zadatak | Izmjena je odmah vidljiva umjetnicima, moguće je mijenjati samo lokaciju, rok za prijavu i vrijeme održavanja. Obrisana prilikanije vidljiva korisnicima, a obrasloženje se sprema. |
| F-011  | Sustav omogućuje umjetniku pretraživanje i filtriranje dostupnih prilika prema području umjetnosti, lokaciji, roku za prijavu i drugim kriterijima.                                                                                  | Srednji       | odobreni zadatak | Nakon zadavanja kriterija prikazuju se samo prilike koje ih zadovoljavaju. Kriteriji se mogu kombinirati.                                                                           |
| F-012  | Sustav omogućuje umjetniku prijavu na odabranu priliku slanjem portfolija i dodatnih materijala.                                                                                                                                     | Srednji       | odobreni zadatak | Umjetnik može predati prijavu s portfolijem i prilozima. Prijava se evidentira sa statusom "predana".                                                                               |
| F-013  | Sustav umjetniku prikazuje status svake njegove prijave (predana, u pregledu, potrebna dopuna, prihvaćena, odbijena).                                                                                                                | Nizak         | odobreni zadatak | Umjetnik za svaku prijavu vidi trenutni status. Status se ažurira nakon odluke organizatora.                                                                                        |
| F-014  | Sustav omogućuje organizatoru pregled pristiglih prijava te njihovo odobravanje ili odbijanje, uz mogućnost unosa razloga odbijanja.                                                                                                 | Srednji       | odobreni zadatak | Organizator vidi sve prijave na svoje prilike i može ih odobriti ili odbiti. Razlog odbijanja pohranjuje se i vidljiv je umjetniku.                                                 |
| F-015  | Sustav omogućuje organizatoru da od umjetnika zatraži dopunu prijave, a umjetniku da dostavi dopunu.                                                                                                                                 | Nizak         | odobreni zadatak | Organizator može prijavu označiti kao "potrebna dopuna". Umjetnik može dodati materijale, nakon čega prijava ponovno prelazi u pregled.                                             |
| F-016  | Sustav omogućuje umjetniku čija je prijava prihvaćena dodavanje događanja u osobni kalendar putem integracije s vanjskim kalendarskim servisom.                                                                                      | Nizak         | odobreni zadatak | Za prihvaćenu prijavu umjetnik može dodati događanje u svoj kalendar s ispravnim nazivom, datumom i mjestom.                                                                        |
| F-017  | Sustav organizatoru prikazuje osnovne statistike: broj prijava po području umjetnosti, broj prihvaćenih umjetnika i broj prijava na pojedine natječaje.                                                                              | Nizak         | odobreni zadatak | Organizator vidi navedene brojeve za svoje prilike i oni odgovaraju stvarnim podacima u sustavu.                                                                                    |
| F-018  | Sustav omogućuje organizatoru objavu rezultata nakon završetka događanja i označavanje umjetnika koji su sudjelovali. Sudjelovanja se prikazuju na profilu umjetnika.                                                                | Srednji       | odobreni zadatak | Organizator može objaviti rezultate i označiti sudionike. Označeni umjetnik vidi to sudjelovanje na svom profilu.                                                                   |
| F-019  | Sustav omogućuje administratoru upravljanje korisnicima, organizatorima i objavljenim sadržajem.                                                                                                                                     | Visok         | odobreni zadatak | Administrator može pregledati, urediti, blokirati ili ukloniti korisnika, organizatora i objavljeni sadržaj. Promjena je odmah vidljiva u sustavu.                                  |
| F-020  | Sustav omogućuje administratoru upravljanje kategorijama umjetnosti, kriterijima pretraživanja i osnovnim postavkama sustava te pregled mjesečnih izvještaja (broj registriranih umjetnika, objavljenih prilika i predanih prijava). | Nizak         | odobreni zadatak | Administrator može dodati, urediti i ukloniti kategorije i kriterije. Za odabrani mjesec vidi točne brojeve registracija, prilika i prijava.                                        |

## 2.2 Nefunkcijski zahtjevi

| ID | Opis | Prioritet | Izvor | Način provjere |
|--- | --- | --- | --- | --- |
| NF-01 | Sav promet u produkciji ide preko HTTPS. HTTP zahtjevi preusmjeravaju se na HTTPS. | Visok | Sigurnosna politika | Provjera certifikata SSL testom. Pokušaj pristupa stranici preko HTTP-a vraća 301 |
| NF-02 | Na poslužitelju se radi provjera ovlasti. Zahtjev bez dopuštenja vraća 403 | Visok | Upute | Provjera krajnjih točaka automatiziranim testovima različitim ulogama |
| NF-03 | Sustav je zaštićen od uobičajenih web ranjivosti (SQLi, XSS, CSRF...) | Visok | Sigurnosna praksa | Pregled koda i ručno penetracijsko testiranje. |
| NF-04 | Dopušteno je prenositi samo slikovne, audio i PDF datoteke, do maksimalno 20MB. | Srednje | Upute | Testovi prijenosa većih i neodgovarajućih datoteka |
| NF-05 | Na web stranici istodobno može biti prijavljeno 100 korisnika te je odziv manji od 2s po zahtjevu | Srednje | SLA | Testovi virtualno izazvanim opterećenjima |
| NF-06 | Pretraživanje prilika po području, lokaciji i roku za prijavu vraća rezultate unutar 2s za bazu od 100 prilika. | Nizak | SLA | Mjerenje na bazi napunjenoj testnim podacima |
| NF-07 | Nedostupnost Google Maps ili Google Calendar ne utječe na funkcionalnost ostatka stranice. | Srednji | Dogovor tima | Test s blokiranim pozivima prema Google API-ju. |
| NF-08 | Sustav je dostupan najmanje 95 % vremena tijekom razdoblja ocjenjivanja. | Nizak | SLA | Health-check s vanjskim monitoringom |
| NF-09 | Sve prijave i registracije korisnika odvijaju se isključivo putem OAuth 2.0 servisa | Visok | Upute | Testiranje registracije i prijave |
| NF-10 | Baza podataka mora imati kapacitet pohrane 1000 korisnika te 1000 prilika/natjecanja. | Srednje | Procjena tima | Punjenje baze podataka testnim podacima. |

## 2.3 Dionici i akteri

|**ID**|**Uloga**|**Odnos prema sustavu**|**Obuhvaćeni**<br>**funkcijski**<br>**zahtjevi**|
|---|---|---|---|
|A-01|Umjetnik|Može se prijavit u<br>sustav, može mijenjat<br>svoj profil i portfolio,<br>može objaviti svoj<br>sadržaj, može se<br>prijavit i gledat status<br>eventa|F-001<br>F-001.1<br>F-002<br>F-003<br>F-004<br>F-005<br>F-006<br>F-011<br>F-012<br>F-013<br>F-015<br>F-016|
|A-02|Organizator|Može se prijavit u<br>sustav.<br>Može objaviti i upravljat<br>statusom natječaja te<br>pregledati predane<br>prijave te po potrebi<br>zatražiti dodatne<br>informacije od<br>umjetnika, može<br>gledati rezultate te ih<br>objaviti|F-001<br>F-001.1<br>F-006<br>F-007<br>F-007.1<br>F-008<br>F-009<br>F-010<br>F-014<br>F-015<br>F-017<br>F-018|
|A-03|Administrator platforme|upravlja korisnicima,<br>objavljenim sadržajem<br>i organizatorima.<br>Također može<br>upravljati kategorijama<br>umjetnosti, kriterijima<br>za pretraživanje i<br>osnovnim postavkama<br>sustava. Pregledava<br>mjesečne izvještaje|F-001<br>F-006<br>F-007.1<br>F-019<br>F-020|


## 2.4 Ograničenja i pretpostavke

**Cilj:** Zabilježiti projektno specifične granice i pretpostavke koje utječu na zahtjeve ili oblikovanje, zajedno s njihovim izvorom i praktičnom posljedicom. Ovo je njihovo mjerodavno mjesto u dokumentaciji.

| ID    | Tip          | Opis ograničenja ili pretpostavke               | Izvor               | Inženjerska posljedica / Provjera        |
| ----- | ------------ | ----------------------------------------------- | ------------------- | ---------------------------------------- |
| C-01  | Ograničenje  | Registracija i prijava ostvaruju se isključivo putem Google OAuth. | Zadatak | Prijava preko django-allauth, bez korisničkih lozinki. Provjera: testovi registracije i prijave. |
| C-02  | Ograničenje  | Sav promet u produkciji ide preko HTTPS-a. Google OAuth prihvaća `http://` samo za `localhost`. | Pravila Googlea | nginx server s Let's Encrypt certifikatom. Odvojene Docker Compose konfiguracije za razvoj (HTTP) i produkciju (HTTPS). |
| C-03  | Ograničenje  | Frontend i API moraju dijeliti isti izvor jer autentifikacija koristi sesijski kolačić i CSRF zaglavlje. | Tehnička odluka | nginx poslužuje frontend i prosljeđuje `/api`, `/admin` i `/oauth` na Django backend. Frontend šalje `X-CSRFToken`. Provjera: testovi s uključenom CSRF provjerom. |
| C-04  | Ograničenje  | Google Maps JavaScript API učitava se u pregledniku pa je API ključ javno vidljiv. | Ograničenje Google API-ja | Ključ ograničiti po referreru i API-jima, zasebni ključevi za produkciju i lokalno okruženje. |
| AS-01 | Pretpostavka | Korisnik ima jednu ulogu (umjetnik ili organizator) i ne mijenja je nakon registracije. | Odluka tima | Ponovna registracija vraća 409, ulogu mijenja samo administrator. Provjera: test ponovne registracije. |
| AS-02 | Pretpostavka | Organizator može izrađivati pripreme, ali objaviti priliku tek nakon odobrenja administratora. | Odluka tima | `approved=false` po zadanom, otvaranje prilike vraća 403 dok organizator nije odobren od strane administratora. Provjera: test objave neodobrenog organizatora. |
| AS-03 | Pretpostavka | Google vraća verificiranu e-poštu prilikom registracije | Procjena tima | E-pošta se ne verificira zasebno. |
| AS-04 | Pretpostavka | Adrese prilika mogu se geokodirati. | Procjena o podacima | Koordinate su opcionalne, a karta se skriva bez njih. Provjera: ručni test s neuobičajenim adresama. |
| AS-05 | Pretpostavka | Jedna VM s Gunicornom podnosi 100 istodobnih korisnika uz odziv ispod 2 s. | Procjena tima | Provjera: test opterećenja. |

## 2.5 Značajne promjene zahtjeva

| Datum | ID zahtjeva | Promjena i razlog | Dogovoreno s / dokaz |
| ----- | ----------- | ----------------- | -------------------- |
|       |             |                   |                      |


## 2.6 Sljedivost zahtjeva

Arhitekturna realizacija koristi nazive komponenata iz [odjeljka 4.2](4-Arhitektura-i-oblikovanje.md#42-gradivni-blokovi-i-uml-dijagram-komponenata); u zagradi je Django aplikacija u `backend/` u kojoj je ponašanje ostvareno. Ispitni slučajevi opisani su u [odjeljku 5.2](5-Ispitivanje.md#52-ispitni-slučajevi). _Na čekanju_ znači da ponašanje još nije ostvareno ili nema provjeru.

| ID zahtjeva | Obrazac uporabe / modul | Arhitekturna realizacija | Ispitivanje ili provjera |
| ----------- | ----------------------- | ------------------------ | ------------------------ |
| F-001 | UC-01 Registracija računa; UC-02 Prijava i odjava | Web-klijent; Modul za korisnike i autentifikaciju (`users`); OAuth 2.0 pružatelj identiteta | CT-01 – CT-03, CT-13, CT-14, CT-18, CT-19; ST-01 |
| F-001.1 | UC-01 Registracija računa | Modul za korisnike i autentifikaciju (`users`) | CT-04, CT-05, CT-08, CT-09 |
| F-002 | UC-01 Registracija računa | Modul za korisnike i autentifikaciju (`users`); Modul za portfolije (`portfolio`, popis područja) | CT-04, CT-06, CT-07, CT-10 – CT-12, CT-20, CT-21, CT-75 – CT-77 |
| F-003 | UC-03 Upravljanje portfoliom | Modul za portfolije (`portfolio`) | CT-70 – CT-73, CT-78, CT-79, CT-96 – CT-100, CT-112 |
| F-004 | UC-03 Upravljanje portfoliom | Modul za portfolije (`portfolio`) | CT-80 – CT-85, CT-89 – CT-92 |
| F-005 | UC-03 Upravljanje portfoliom | Modul za portfolije (`portfolio`) | CT-84, CT-86 – CT-88, CT-93 – CT-95, CT-101 |
| F-006 | UC-04 Pregled javnog portfolija umjetnika | Modul za portfolije (`portfolio`) | CT-74, CT-101, CT-102, CT-107 – CT-114 |
| F-007 | UC-05 Objava prilike | Web-klijent; Modul za prilike (`opportunities`) | CT-22 – CT-24, CT-26 – CT-36, CT-61 – CT-64 |
| F-007.1 | UC-05 Objava prilike; UC-16 Upravljanje korisnicima i sadržajem | Modul za prilike (`opportunities`); Modul za administraciju i izvještaje (Django administracijsko sučelje) | CT-05, CT-42; odobravanje organizatora od strane administratora: _na čekanju_ (nema ispitnog slučaja) |
| F-008 | UC-05 Objava prilike | Web-klijent (prikaz karte); Modul za prilike (`opportunities`); Google Maps API | CT-46 (spremanje adrese i koordinata); prikaz karte: _na čekanju_ (nema ispitnog slučaja) |
| F-009 | UC-06 Upravljanje prilikom | Web-klijent; Modul za prilike (`opportunities`) | CT-25, CT-37 – CT-44, CT-50 |
| F-010 | UC-06 Upravljanje prilikom | Web-klijent; Modul za prilike (`opportunities`) | CT-45 – CT-49, CT-51 – CT-60, CT-65 – CT-69 |
| F-011 | UC-07 Pretraživanje i pregled prilika | Web-klijent; Modul za prilike (`opportunities`) | CT-28, CT-29, CT-33 (pregled); pretraživanje i filtriranje: _na čekanju_ (nije ostvareno) |
| F-012 | UC-08 Prijava na priliku | Modul za prijave (`opportunities`, model `Application`) | _Na čekanju_ (nije ostvareno) |
| F-013 | UC-09 Praćenje statusa prijave | Modul za prijave (`opportunities`) | _Na čekanju_ (nije ostvareno) |
| F-014 | UC-10 Pregled i odlučivanje o prijavama | Modul za prijave (`opportunities`) | _Na čekanju_ (nije ostvareno) |
| F-015 | UC-11 Zatraživanje dopune prijave; UC-12 Dostava dopune prijave | Modul za prijave (`opportunities`, model `ApplicationMaterial`) | _Na čekanju_ (nije ostvareno) |
| F-016 | UC-13 Dodavanje događaja u kalendar | Modul za prijave (`opportunities`, model `CalendarEntry`); Google Calendar API | _Na čekanju_ (nije ostvareno) |
| F-017 | UC-14 Pregled statistike | Web-klijent (`/organizator/statistika`); Modul za administraciju i izvještaje | _Na čekanju_ (nije ostvareno) |
| F-018 | UC-15 Objava rezultata i označavanje sudionika | Modul za prijave (`opportunities`, oznaka `participated`); Modul za portfolije (prikaz na profilu) | CT-115 (prikaz na profilu); objava rezultata: _na čekanju_ (nije ostvareno) |
| F-019 | UC-16 Upravljanje korisnicima i sadržajem | Modul za administraciju i izvještaje (Django administracijsko sučelje) | CT-105, CT-106 (portfolio deaktiviranog korisnika nije vidljiv); ostalo: _na čekanju_ (nema ispitnog slučaja) |
| F-020 | UC-17 Upravljanje kategorijama i postavkama; UC-18 Pregled mjesečnih izvještaja | Modul za administraciju i izvještaje (`administration`, Django administracijsko sučelje); Modul za portfolije (`ArtField`) | CT-11, CT-20, CT-77, CT-103, CT-104 (neaktivna područja); mjesečni izvještaji: _na čekanju_ (nije ostvareno) |

---

## 2.7 Pregled zahtjeva

**Cilj:** Zabilježiti važne povratne informacije o zahtjevima i odluke koje iz njih proizlaze na dvije formalne kontrolne točke projekta, u 7. i 14. tjednu.

| Kontrolna točka                | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| ------------------------------ | ------------------------------ | ---------------------------- |
| Kontrolna točka 1 (7. tjedan)  | Tijekom demonstracije uočeno je da se u /artist podatci ne dohvaćaju s pravog poslužitelja, već se koriste "mock" podatci u memoriji.         |  Promijenjen način dohvaćanja podataka u skladu s F-002, time se sustav umjetnika u potpunosti prebacuje na baze podataka.  |
| Demo 2 (11. tjedan)            | [Povratna informacija]         | [Odluka; vidi odjeljak 2.5]  |
| Kontrolna točka 2 (14. tjedan) | [Povratna informacija]         | [Odluka; vidi odjeljak 2.5]  |

<details>
<summary><strong>Bilježenje odluka nakon pregleda</strong></summary>

**Primjer scenarija — pregled zahtjeva CrisisMapa:**

| Kontrolna točka     | Povratna informacija ili nalaz                                                                    | Odluka o zahtjevu ili opsegu                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 7. tjedan (primjer) | Demonstracija pokazuje da odbijanje pristupa lokaciji preglednika onemogućuje podnošenje prijave. | Dogovoriti ručni odabir lokacije; ažurirati F-004 i primjer NF-01 te razlog zabilježiti u odjeljku 2.5. |

**Odluka povezana s povratnom informacijom:** Zapis povezuje opaženo ponašanje s konkretnom promjenom zahtjeva i izbjegava zapisnik cijelog sastanka. Zapišite samo stvarne povratne informacije i odluke za kontrolne točke. Konzultacije u nekom drugom tjednu ne stvaraju dodatnu obaveznu predaju.

</details>

---

> **Završna provjera:** Zahtjevi su aktualni, provjerljivi i povezani. Svaki važan zahtjev moguće je pratiti od njegova opisa i ponašanja preko mjesta realizacije u sustavu do odgovarajućeg ispitivanja ili druge provjere. Poveznice koriste stvarne identifikatore i nazive iz projektne dokumentacije.
