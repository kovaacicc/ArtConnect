# 2. Analiza zahtjeva

**Cilj:** Iz odobrenog opsega projekta izvesti prepoznatljive, prioritetizirane i provjerljive zahtjeve. Zahtjevi se mogu mijenjati; pri završnoj predaji moraju odražavati dogovorenu aplikaciju. Izvori, odluke i poveznice u primjerima kolegija nastavni su scenariji, a ne projektni zapisi.

<details>
<summary><strong>Održavanje zahtjeva ažurnima</strong></summary>

Primjeri koriste temu projekta CrisisMap. Neki namjerno sadrže korisne nedostatke za raspravu. Izvori, odluke i poveznice na provjere u tim primjerima **nastavni su scenariji**, a ne zapisi rada stvarnog studentskog tima. Zamijenite ih zahtjevima i dokazima svojeg odobrenog projekta. Značajne promjene zabilježite u §2.5.

</details>

## 2.1 Funkcijski zahtjevi

| **ID** | **Opis**                                                                                                                                                                                                                             | **Prioritet** | **Izvor**        | **Kriterij prihvaćanja**                                                                                                                                                            |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F-001  | Sustav omogućuje registraciju računa putem vanjskog servisa za autentifikaciju (OAuth2.0).                                                                                                                                           | Visok         | odobreni zadatak | Korisnik se može registrirati preko OAuth pružatelja i odabrati ulogu. Račun se kreira s odabranom ulogom.                                                                          |
| F-002  | Sustav omogućuje odabir uloge umjetnika ili organizatora pri registraciji.                                                                                                                                                           | Visok         | odobreni zadatak | Korisnik tijekom prijave može odabrati ulogu umjetnika ili organizatora. Račun se kreira s odabranom ulogom.                                                                        |
| F-003  | Sustav omogućuje prijavu i odjavu registriranog korisnika putem vanjskog servisa za autentifikaciju.                                                                                                                                 | Visok         | odobreni zadatak | Registrirani korisnik se može prijaviti i dobiva pristup funkcijama svoje uloge. Nakon odjave nema pristup zaštićenim funkcijama.                                                   |
| F-004  | Sustav pri registraciji umjetnika bilježi osnovne podatke, područje umjetničkog djelovanja i, ako postoje, poveznice na web-stranice ili društvene mreže.                                                                            | Srednji       | odobreni zadatak | Umjetnik pri registraciji unosi podatke i područje djelovanja. Poveznice su neobavezne. Podaci su vidljivi na njegovu profilu.                                                      |
| F-005  | Sustav omogućuje umjetniku izradu i uređivanje digitalnog portfolija: biografije, opisa umjetničkog rada te podataka o prethodnim izložbama i projektima.                                                                            | Visok         | odobreni zadatak | Umjetnik može unijeti i izmijeniti navedene podatke. Izmjene su odmah vidljive u portfoliju.                                                                                        |
| F-006  | Sustav omogućuje umjetniku dodavanje djela u portfolio s nazivom, godinom nastanka, tehnikom, dimenzijama, opisom i priloženim fotografijama ili datotekama.                                                                         | Nizak         | odobreni zadatak | Umjetnik može dodati djelo sa svim navedenim podacima i datotekama. Djelo se prikazuje u portfoliju.                                                                                |
| F-007  | Sustav omogućuje umjetniku uređivanje i brisanje djela te određivanje je li pojedino djelo javno dostupno.                                                                                                                           | Nizak         | odobreni zadatak | Umjetnik može izmijeniti ili obrisati djelo. Djelo označeno kao NIJE JAVNO nije vidljivo drugim korisnicima.                                                                        |
| F-008  | Sustav prikazuje drugim korisnicima javni portfolio umjetnika, uključujući samo djela označena kao javna.                                                                                                                            | Srednji       | odobreni zadatak | Organizator i drugi korisnici mogu otvoriti profil umjetnika i vide samo javna djela.                                                                                               |
| F-009  | Sustav omogućuje organizatoru objavu prilike (natječaj, izložba, radionica) s nazivom, opisom, rokom za prijavu, mjestom održavanja, područjem umjetnosti, dobnim ili drugim kriterijem te nagradom ili naknadom, ako postoji.       | Visok         | odobreni zadatak | Organizator može unijeti sve navedene podatke i objaviti priliku. Objavljena prilika vidljiva je umjetnicima.                                                                       |
| F-010  | Sustav za događanja na fizičkoj lokaciji prikazuje lokaciju na karti putem vanjskog kartografskog servisa, na temelju adrese koju je unio organizator.                                                                               | Nizak         | odobreni zadatak | Uz priliku s unesenom adresom prikazuje se karta s ispravno označenom lokacijom.                                                                                                    |
| F-011  | Sustav vodi status prilike (priprema, otvoreno za prijave, prijave zatvorene, u procesu odabira, završeno) i omogućuje organizatoru uređivanje prilike i promjenu statusa.                                                           | Visok         | odobreni zadatak | Organizator može urediti priliku i promijeniti joj status. Prijave je moguće slati samo dok je status "otvoreno za prijave".                                                        |
| F-012  | Sustav omogućuje organizatoru da mijenja podatke objavljene prilike i briše vlastitu objavljenu priliku uz obrazloženje.                                                                                                             | Nizak         | odobreni zadatak | Izmjena je odmah vidljiva umjetnicima, moguće je mijenjati samo lokaciju, rok za prijavu i vrijeme održavanja. Obrisana prilikanije vidljiva korisnicima, a obrasloženje se sprema. |
| F-013  | Sustav omogućuje umjetniku pretraživanje i filtriranje dostupnih prilika prema području umjetnosti, lokaciji, roku za prijavu i drugim kriterijima.                                                                                  | Srednji       | odobreni zadatak | Nakon zadavanja kriterija prikazuju se samo prilike koje ih zadovoljavaju. Kriteriji se mogu kombinirati.                                                                           |
| F-014  | Sustav omogućuje umjetniku prijavu na odabranu priliku slanjem portfolija i dodatnih materijala.                                                                                                                                     | Srednji       | odobreni zadatak | Umjetnik može predati prijavu s portfolijem i prilozima. Prijava se evidentira sa statusom "predana".                                                                               |
| F-015  | Sustav umjetniku prikazuje status svake njegove prijave (predana, u pregledu, potrebna dopuna, prihvaćena, odbijena).                                                                                                                | Nizak         | odobreni zadatak | Umjetnik za svaku prijavu vidi trenutni status. Status se ažurira nakon odluke organizatora.                                                                                        |
| F-016  | Sustav omogućuje organizatoru pregled pristiglih prijava te njihovo odobravanje ili odbijanje, uz mogućnost unosa razloga odbijanja.                                                                                                 | Srednji       | odobreni zadatak | Organizator vidi sve prijave na svoje prilike i može ih odobriti ili odbiti. Razlog odbijanja pohranjuje se i vidljiv je umjetniku.                                                 |
| F-017  | Sustav omogućuje organizatoru da od umjetnika zatraži dopunu prijave, a umjetniku da dostavi dopunu.                                                                                                                                 | Nizak         | odobreni zadatak | Organizator može prijavu označiti kao "potrebna dopuna". Umjetnik može dodati materijale, nakon čega prijava ponovno prelazi u pregled.                                             |
| F-018  | Sustav omogućuje umjetniku čija je prijava prihvaćena dodavanje događanja u osobni kalendar putem integracije s vanjskim kalendarskim servisom.                                                                                      | Nizak         | odobreni zadatak | Za prihvaćenu prijavu umjetnik može dodati događanje u svoj kalendar s ispravnim nazivom, datumom i mjestom.                                                                        |
| F-019  | Sustav organizatoru prikazuje osnovne statistike: broj prijava po području umjetnosti, broj prihvaćenih umjetnika i broj prijava na pojedine natječaje.                                                                              | Nizak         | odobreni zadatak | Organizator vidi navedene brojeve za svoje prilike i oni odgovaraju stvarnim podacima u sustavu.                                                                                    |
| F-020  | Sustav omogućuje organizatoru objavu rezultata nakon završetka događanja i označavanje umjetnika koji su sudjelovali. Sudjelovanja se prikazuju na profilu umjetnika.                                                                | Srednji       | odobreni zadatak | Organizator može objaviti rezultate i označiti sudionike. Označeni umjetnik vidi to sudjelovanje na svom profilu.                                                                   |
| F-021  | Sustav omogućuje administratoru upravljanje korisnicima, organizatorima i objavljenim sadržajem.                                                                                                                                     | Visok         | odobreni zadatak | Administrator može pregledati, urediti, blokirati ili ukloniti korisnika, organizatora i objavljeni sadržaj. Promjena je odmah vidljiva u sustavu.                                  |
| F-022  | Sustav omogućuje administratoru upravljanje kategorijama umjetnosti, kriterijima pretraživanja i osnovnim postavkama sustava te pregled mjesečnih izvještaja (broj registriranih umjetnika, objavljenih prilika i predanih prijava). | Nizak         | odobreni zadatak | Administrator može dodati, urediti i ukloniti kategorije i kriterije. Za odabrani mjesec vidi točne brojeve registracija, prilika i prijava.                                        |

## 2.2 Nefunkcijski zahtjevi

| ID    | Opis                                                                                                            | Prioritet | Izvor               | Način provjere                                                                    |
| ----- | --------------------------------------------------------------------------------------------------------------- | --------- | ------------------- | --------------------------------------------------------------------------------- |
| NF-01 | Sav promet u produkciji ide preko HTTPS. HTTP zahtjevi preusmjeravaju se na HTTPS.                              | Visok     | Sigurnosna politika | Provjera certifikata SSL testom. Pokušaj pristupa stranici preko HTTP-a vraća 301 |
| NF-02 | Na poslužitelju se radi provjera ovlasti. Zahtjev bez dopušenja vraća 403                                       | Visok     | Upute               | Provjera krajnjih točaka automatiziranim testovima različitim ulogama             |
| NF-03 | Sustav je zaštićen od uobičajenih web ranjivosti (SQLi, XSS, CSRF...)                                           | Visok     | Sigurnosna praksa   | Pregled koda i ručno penetracijsko testiranje.                                    |
| NF-04 | Dopušteno je prenositi samo slikovne, audio i PDF datoteke, do maksimalno 20MB.                                 | Srednje   | Upute               | Testovi prijenosa većih i neodgovarajućih datoteka                                |
| NF-05 | Na web stranici istodobno može biti prijavljeno 100 korisnika te je odziv manji od 2s po zahtjevu               | Srednje   | SLA                 | Testovi virtualno izazvanim opterećenjima                                         |
| NF-06 | Pretraživanje prilika po području, lokaciji i roku za prijavu vraća rezultate unutar 2s za bazu od 100 prilika. | Nizak     | SLA                 | Mjerenje na bazi napunjenoj testnim podacima                                      |
| NF-07 | Nedostupnost Google Maps ili Google Calendar ne utječe na funkcionalnost ostatka stranice.                      | Srednji   | Dogovor tima        | Test s blokiranim pozivima prema Google API-ju.                                   |
| NF-08 | ustav je dostupan najmanje 95 % vremena tijekom razdoblja ocjenjivanja.                                         | Nizak     | SLA                 | Health-check s vanjskim monitoringom                                              |
| NF-09 | Sve prijave i registracije korisnika odvijaju se isključivo putem OAuth 2.0 servisa                             | Visok     | Upute               | Testiranje registracije i prijave                                                 |
| NF-10 | Baza podataka mora imati kapacitet pohrane 1000 korisnika te 1000 prilika/natjecanja.                           | Srednje   | Procjena tima       | Punjenje baze podataka testim podacima.                                           |

## 2.3 Dionici i akteri

**Cilj:** Utvrditi uloge koje utječu na zahtjeve i razlikovati dionike od aktera koji komuniciraju s aplikacijom.

| ID uloge ili aktera | Odnos prema sustavu | Relevantni zahtjevi |
| ------------------- | ------------------- | ------------------- |
|                     |                     |                     |

<details>
<summary><strong>Povezivanje aktera sa zahtjevima</strong></summary>

**Primjer — akteri aplikacije CrisisMap:**

| ID aktera | Uloga                 | Obuhvaćeni funkcijski zahtjevi                                      |
| --------- | --------------------- | ------------------------------------------------------------------- |
| A-01      | Koordinator pomoći    | F-003: Pregled resursa; F-004: Podnošenje prijave kriznog događaja. |
| A-02      | Građanin              | F-001: Izrada računa; F-005: Primanje obavijesti.                   |
| A-03      | Administrator sustava | NF-1.2: Provođenje sigurnosnih pravila; upravljanje korisnicima.    |
| A-04      | Posjetitelj           | F-007: Pregled prijava na karti.                                    |
| A-05      | Moderator             | F-008: Odobravanje ili odbijanje prijava.                           |

**Odgovornosti aktera:** Uloga aktera treba biti povezana s interakcijom, a ne samo s nazivom. Provjerite podnosi li koordinator pomoći u odobrenom zadatku doista prijave kriznih događaja. Poveznica administratora s NF-1.2 navodi sigurnosni aspekt, ali sama po sebi ne opisuje obrazac uporabe; navedite stvarnu radnju administratora ili izostavite ulogu ako je nema. Nastavnici zainteresirani za rezultat mogu biti dionici, a da nisu akteri aplikacije. Tablica je polazište za razmišljanje, a ne potvrđen opis ovlasti u CrisisMapu.

</details>

---

## 2.4 Ograničenja i pretpostavke

**Cilj:** Zabilježiti projektno specifične granice i pretpostavke koje utječu na zahtjeve ili oblikovanje, zajedno s njihovim izvorom i praktičnom posljedicom. Ovo je njihovo mjerodavno mjesto u dokumentaciji.

| ID    | Tip          | Opis ograničenja ili pretpostavke               | Izvor               | Inženjerska posljedica / Provjera        |
| ----- | ------------ | ----------------------------------------------- | ------------------- | ---------------------------------------- |
| C-01  | Ograničenje  | [Fiksni tehnički ili procesni uvjet]            | [Zadatak / Pravila] | [Utjecaj na arhitekturu i oblikovanje]   |
| AS-01 | Pretpostavka | [Očekivani uvjet (npr. o podacima ili okolini)] | [Procjena tima]     | [Kako i kada će se provjeriti valjanost] |
|       |              |                                                 |                     |

<details>
<summary><strong>Ograničenja nasuprot pretpostavkama</strong></summary>

Ograničenje je uvjet koji tim mora poštovati; pretpostavka je uvjet na koji se tim oslanja i koji treba ponovno provjeravati.

**Primjer — projektni kontekst CrisisMapa:**

| ID    | Ograničenje ili pretpostavka                                                                 | Izvor                   | Posljedica ili način provjere                                                                                             |
| ----- | -------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| C-01  | Odobreni zadatak zahtijeva OAuth prijavu u sustav za uređivanje vlastitih prijava korisnika. | Odobreni zadatak        | Zaštićeno uređivanje projektirati oko odabranog pružatelja identiteta; provjeriti autorizirane i neautorizirane zahtjeve. |
| AS-01 | Prijave koje se prikazuju na karti imaju uporabive koordinate.                               | Pretpostavka o podacima | Pregledati ogledne i uvezene prijave; planirati prikaz prijava bez valjanih koordinata.                                   |

**Ograničenje nasuprot pretpostavci:** C-01 navodi obvezujuću odluku i njezin arhitekturni učinak; AS-01 je moguće provjeriti i može se pokazati netočnim. Nemojte kopirati C-01 ako OAuth nije dio stvarnog odobrenog zadatka. Projektni odgovor objasnite u arhitekturi bez prepisivanja ove tablice.

</details>

---

## 2.5 Značajne promjene zahtjeva

**Cilj:** Sačuvati razlog promjena koje mijenjaju dogovoreni opseg, prioritet ili kriterije prihvaćanja, uz istodobno održavanje prethodnih zahtjeva ažurnima.

| Datum | ID zahtjeva | Promjena i razlog | Dogovoreno s / dokaz |
| ----- | ----------- | ----------------- | -------------------- |
|       |             |                   |                      |

<details>
<summary><strong>Bilježenje značajne promjene</strong></summary>

**Primjer scenarija — odluka tijekom pregleda CrisisMapa:**

| Datum            | ID zahtjeva  | Promjena i razlog                                                                                                                                    | Dogovoreno s / dokaz                                      |
| ---------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [Datum pregleda] | F-004, NF-01 | Dodati ručni odabir lokacije kada korisnik odbije geolokaciju preglednika; bez toga građanin ne može podnijeti prijavu kriznog događaja s lokacijom. | [Poveznica na stvarnu bilješku pregleda ili zadatak tima] |

**Razlog promjene:** Zapis navodi zahvaćene stavke i objašnjava razlog iz perspektive korisnika, a zatim upućuje na dokaz odluke. Nakon stvarne odluke ažurirajte trenutačne zahtjeve; stilska izmjena teksta ne zahtijeva zapis u dnevniku promjena. Trenutačni red zadataka držite u alatu za praćenje zadataka.

</details>

---

## 2.6 Sljedivost zahtjeva

**Cilj:** Osigurati dvosmjernu sljedivost — povezati zahtjeve s opisanim ponašanjem, dijelovima sustava koji ih ostvaruju te ispitivanjem ili drugom provjerom.

| ID zahtjeva | Obrazac uporabe / modul | Arhitekturna realizacija                         | Ispitivanje ili provjera          |
| ----------- | ----------------------- | ------------------------------------------------ | --------------------------------- |
| F-001       | [UC-001]                | [Komponenta, modul ili drugo mjesto realizacije] | [ST-01, CT-01 ili druga provjera] |
|             |                         |                                                  |                                   |

<details>
<summary><strong>Povezivanje zahtjeva, slučajeva uporabe i ispitivanja</strong></summary>

**Primjer — poveznice zahtjeva CrisisMapa:**

| ID zahtjeva | Obrazac uporabe / ponašanje                | Arhitekturna realizacija                                          | Ispitivanje / provjera                                                                 |
| ----------- | ------------------------------------------ | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| F-004       | UC-002 Podnošenje prijave kriznog događaja | Web-klijent; API za prijave; usluga za prijave                    | T-01 Valjana prijava; T-02 Nedostaje lokacija; T-03 Odbijeno dopuštenje za geolokaciju |
| F-001       | UC-001 Registracija računa                 | [Odgovarajući dio sustava u projektu koji uključuje registraciju] | T-04 Valjana registracija; T-05 Postojeća adresa e-pošte                               |

**Pokrivenost i dokazi:** Svaki redak pokazuje gdje je zahtjev opisan kao ponašanje, gdje je ostvaren u sustavu i gdje se nalazi dokaz njegove provjere. Zahtjev ne mora imati zaseban obrazac uporabe ako ne opisuje korisničku interakciju; tada navedite relevantno ponašanje, arhitekturni element ili drugi prikladan način realizacije. U svojem projektu koristite stvarne nazive komponenata, modula i provjera iz dokumentacije i implementacije. Nedostajuću poveznicu ostavite praznom ili označite kao _na čekanju_ uz kratak razlog. Stvarni rezultati ispitivanja bilježe se uz ispitne slučajeve; ova tablica pokazuje gdje ih pronaći.

</details>

---

## 2.7 Pregled zahtjeva

**Cilj:** Zabilježiti važne povratne informacije o zahtjevima i odluke koje iz njih proizlaze na dvije formalne kontrolne točke projekta, u 7. i 14. tjednu.

| Kontrolna točka                | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| ------------------------------ | ------------------------------ | ---------------------------- |
| Kontrolna točka 1 (7. tjedan)  | [Povratna informacija]         | [Odluka; vidi odjeljak 2.5]  |
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
