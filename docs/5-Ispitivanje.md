# 5. Ispitivanje

**Cilj:** Prikazati kako tim provjerava važno ponašanje aplikacije, što je stvarno ispitano, što rezultati pokazuju i koji poznati nedostaci ostaju. Planirano ispitivanje nije dokaz uspješnog izvođenja.

Proširivi primjeri CrisisMapa prikazuju oblikovanje ispitivanja i izvještavanje o rezultatima. Povezivanje zahtjev → obrazac uporabe → ispitivanje održavajte u [tablici sljedivosti zahtjeva](2-Analiza-zahtjeva.md); specifikacije ispitivanja i dokaze izvođenja zabilježite ovdje ili povežite s ispitivanjima u repozitoriju.

## 5.1 Pristup ispitivanju

**Cilj:** Odabrati provjere koje obuhvaćaju glavne korisničke ciljeve, važne uvjete neuspjeha i projektno specifične nefunkcijske zahtjeve.

**Pristup ispitivanju:** [U nekoliko rečenica navedite komponente ili pravila koja se ispituju izdvojeno, glavne interakcije provjerene u pokrenutoj aplikaciji i relevantne nefunkcijske provjere. Navedite koje su provjere automatizirane, koje se izvode ručno i gdje tim čuva dokaze.]

Odaberite normalne slučajeve, granične vrijednosti i neuspjehe koji otkrivaju različita ponašanja. Selenium IDE može snimiti i ponovno izvesti osnovnu interakciju u pregledniku; Selenium WebDriver omogućuje zapis provjere preglednika u kodu. Selenium ili drugi prikladan alat koristite kada pomaže da sustavska provjera bude ponovljiva. Navedite alat koji tim stvarno koristi. Ispitivanje razreda ili pravila pripada razini komponente; otvaranje obrasca u pregledniku provjerava pokrenuti sustav. Tijek kontinuirane integracije (engl. *continuous integration*, CI) i njegova izvođenja navedite samo ako ga tim stvarno koristi. Kontinuirana integracija podrazumijeva da se promjene redovito integriraju u zajednički repozitorij te automatizirano izgrađuju i provjeravaju. Sama uporaba GitHub Actionsa ili drugog alata ne znači da projekt primjenjuje CI ako se takve provjere stvarno ne izvode nad promjenama.

<details>
<summary><strong>Odabir provjera za podnošenje prijave</strong></summary>

**Primjer — CrisisMap:** Tim izravno ispituje provjeru lokacije i promjene stanja prijave kontroliranim ulazima. Zatim u pokrenutom pregledniku uz Selenium WebDriver provjerava podnošenje prijave i pripadajuće poruke o pogreškama. Zasebna provjera pokušava odobriti prijavu bez moderatorskih ovlasti. Ako je dostava obavijesti dio odobrenog opsega, ispitivanje provjerava odabir primatelja; ispitivanje potpune dostave od početka do kraja zahtijeva i aktivnog pružatelja obavijesti. Odbijanje geolokacije preglednika provjerava se uz mogućnost ručnog odabira lokacije. Automatizirani kod ispitivanja čuva se u Gitu, a svaki izvršeni rezultat upućuje na određeno izvođenje.

**Analiza primjera:** Pravilo provjere valjanosti može proći iako potpuno podnošenje prijave ne uspije. Ispitivanja preglednika i komponente zato odgovaraju na različita pitanja. Primjer obavijesti odvaja logiku odabira primatelja od stvarne dostave. Ni naziv alata ni snimka zaslona sami po sebi ne dokazuju da je cijela interakcija uspješno prošla.

</details>

## 5.2 Ispitni slučajevi

 
Slučajevi CT-01 do CT-60 su automatizirani; u zagradi uz korake naveden je test u repozitoriju koji ih izvodi (CT-01 do CT-19 nalaze se u `users/tests.py`, CT-20 i CT-21 u `portfolio/tests.py`, CT-22 do CT-60 u `opportunities/tests.py`). Slučaj ST-01 izvodi se ručno.
 
| ID ispitnog slučaja | Scenarij ispitivanja | Ulazni podaci | Očekivani rezultat | Stvarni rezultat | Ishod | Koraci ispitivanja |
| --- | --- | --- | --- | --- | --- | --- |
| CT-01 | Komponenta: `me` za neprijavljenog korisnika | GET `/api/users/me/` bez sesije. | Odgovor 401. | Odgovor 401. | Prošlo | Pozvati `GET /api/users/me/` bez prijave; provjeriti status 401. (`MeViewTests.test_not_logged_in_returns_401`) |
| CT-02 | Komponenta: `me` za novog korisnika bez profila | Prijavljeni korisnik bez profila umjetnika ili organizatora. | 200; `registration_complete` je `false`; `artist_profile` i `organizer_profile` su `null`. | Kao očekivano. | Prošlo | Stvoriti korisnika bez profila i prijaviti ga; pozvati `GET /api/users/me/`; provjeriti status 200, `registration_complete` false i oba profila `null`. (`MeViewTests.test_new_user_has_incomplete_registration_and_no_profiles`) |
| CT-03 | Komponenta: registracija bez prijave | POST s valjanim podacima umjetnika, bez sesije. | Odgovor 401. | Kao očekivano. | Prošlo | Pozvati `POST /api/users/auth/register/` s valjanim podacima umjetnika bez prijave; provjeriti status 401. (`RegisterViewTests.test_not_logged_in_returns_401`) |
| CT-04 | Komponenta: valjana registracija umjetnika | `role: artist`, ime, prezime, dva aktivna ID-a područja. | 201; `registration_complete: true`; uloga `artist`; profil spremljen s dva područja. | Kao očekivano. | Prošlo | Prijaviti korisnika; poslati registraciju umjetnika s dva aktivna područja; provjeriti status 201, `registration_complete` true i ulogu `artist`; provjeriti da je profil spremljen s dva područja. (`RegisterViewTests.test_artist_registration_succeeds`) |
| CT-05 | Komponenta: valjana registracija organizatora | `role: organizer`, `name: Galerija X`. | 201; uloga `organizer`; profil spremljen s `approved = false`. | Kao očekivano. | Prošlo | Prijaviti korisnika; poslati registraciju organizatora s poljem `name`; provjeriti status 201 i ulogu `organizer`; provjeriti da je profil spremljen s `approved` false. (`RegisterViewTests.test_organizer_registration_is_not_approved`) |
| CT-06 | Komponenta: umjetnik bez imena | Podaci umjetnika bez `first_name`. | 400 s porukom uz `first_name`; profil se ne sprema. | Kao očekivano. | Prošlo | Poslati registraciju umjetnika bez `first_name`; provjeriti status 400 i poruku uz `first_name`; provjeriti da profil nije spremljen. (`RegisterViewTests.test_artist_without_first_name_returns_400`) |
| CT-07 | Komponenta: umjetnik bez područja | `art_fields: []`. | 400 s porukom uz `art_fields`. | Kao očekivano. | Prošlo | Poslati registraciju umjetnika s praznim popisom područja; provjeriti status 400 i poruku uz `art_fields`. (`RegisterViewTests.test_artist_without_art_fields_returns_400`) |
| CT-08 | Komponenta: organizator bez naziva | `role: organizer` bez `name`. | 400 s porukom uz `name`. | Kao očekivano. | Prošlo | Poslati registraciju organizatora bez `name`; provjeriti status 400 i poruku uz `name`. (`RegisterViewTests.test_organizer_without_name_returns_400`) |
| CT-09 | Komponenta: zabranjena uloga | `role: admin`. | 400; uloga korisnika ostaje različita od `admin`. | Kao očekivano. | Prošlo | Poslati registraciju s ulogom `admin`; provjeriti status 400; ponovno učitati korisnika iz baze i provjeriti da njegova uloga nije `admin`. (`RegisterViewTests.test_admin_role_is_rejected`) |
| CT-10 | Komponenta: nepostojeće područje | `art_fields: [9999]`. | Odgovor 400. | Kao očekivano. | Prošlo | Poslati registraciju umjetnika s ID-om područja koji ne postoji; provjeriti status 400. (`RegisterViewTests.test_unknown_art_field_returns_400`) |
| CT-11 | Komponenta: neaktivno područje | ID područja s `active = false`. | Odgovor 400. | Kao očekivano. | Prošlo | Stvoriti neaktivno područje; poslati registraciju umjetnika s njegovim ID-om; provjeriti status 400. (`RegisterViewTests.test_inactive_art_field_returns_400`) |
| CT-12 | Komponenta: neispravan URL | `website_url: "banana"`. | 400 s porukom uz `website_url`. | Kao očekivano. | Prošlo | Poslati registraciju umjetnika s `website_url` koji nije URL; provjeriti status 400 i poruku uz `website_url`. (`RegisterViewTests.test_invalid_url_returns_400`) |
| CT-13 | Komponenta: dvostruka registracija | Isti korisnik šalje valjanu registraciju dvaput. | Prvi poziv 201, drugi 409. | Kao očekivano. | Prošlo | Poslati valjanu registraciju umjetnika; provjeriti status 201; poslati istu registraciju ponovno; provjeriti status 409. (`RegisterViewTests.test_registering_twice_returns_409`) |
| CT-14 | Komponenta: odjava završava sesiju | Prijavljeni korisnik poziva POST `/api/users/auth/logout/`, zatim GET `/api/users/me/`. | Odjava 204; `me` zatim vraća 401. | Kao očekivano. | Prošlo | Prijaviti korisnika; provjeriti da `GET /api/users/me/` vraća 200; poslati `POST /api/users/auth/logout/` i provjeriti status 204; ponovno pozvati `GET /api/users/me/` i provjeriti status 401. (`LogoutAndCsrfTests.test_logout_ends_the_session`) |
| CT-15 | Komponenta: CSRF kolačić | GET `/api/users/auth/csrf/`. | 200; postavljen kolačić `csrftoken`. | Kao očekivano. | Prošlo | Pozvati `GET /api/users/auth/csrf/`; provjeriti status 200 i da odgovor postavlja kolačić `csrftoken`. (`LogoutAndCsrfTests.test_csrf_route_sets_cookie`) |
| CT-16 | Komponenta: POST bez CSRF tokena | Prijavljeni korisnik, provjera CSRF-a uključena, POST na odjavu bez zaglavlja. | Odgovor 403. | Kao očekivano. | Prošlo | Prijaviti korisnika klijentom s uključenom CSRF provjerom; poslati `POST /api/users/auth/logout/` bez zaglavlja `X-CSRFToken`; provjeriti status 403. (`LogoutAndCsrfTests.test_post_without_csrf_token_is_rejected`) |
| CT-17 | Komponenta: POST s CSRF tokenom | Token dohvaćen preko rute `csrf` i poslan u zaglavlju `X-CSRFToken`. | Odjava 204. | Kao očekivano. | Prošlo | Prijaviti korisnika klijentom s uključenom CSRF provjerom; pozvati `GET /api/users/auth/csrf/` i pročitati kolačić `csrftoken`; poslati `POST /api/users/auth/logout/` sa zaglavljem `X-CSRFToken`; provjeriti status 204. (`LogoutAndCsrfTests.test_post_with_csrf_token_works`) |
| CT-18 | Komponenta: ime korisnika iz Googleovih podataka | `email`, `first_name: Ana`, `last_name: Kovač`; račun `google` s ID-om `12345`. | `display_name` je „Ana Kovač”; `oauth_provider` je `google`; `oauth_subject` je `12345`. | Kao očekivano. | Prošlo | Pozvati `populate_user` adaptera s ovim podacima; provjeriti `display_name`, `oauth_provider` i `oauth_subject`. (`SocialAdapterTests.test_display_name_comes_from_first_and_last_name`) |
| CT-19 | Komponenta: nedostaje ime u Googleovim podacima | Samo `email`. | `display_name` je email. | Kao očekivano. | Prošlo | Pozvati `populate_user` adaptera samo s emailom; provjeriti da je `display_name` jednak emailu. (`SocialAdapterTests.test_display_name_falls_back_to_email`) |
| CT-20 | Komponenta: popis područja je javan, sortiran i samo aktivan | Tri područja (Sculpting i Painting aktivna, Hidden neaktivno); zahtjev bez prijave. | 200; samo aktivna područja, poredana po nazivu. | Kao očekivano. | Prošlo | Stvoriti tri područja; pozvati `GET /api/portfolio/art-fields/` bez prijave; provjeriti status 200 i da su vraćena samo područja Painting i Sculpting, tim redoslijedom. (`ArtFieldListTests.test_is_public_sorted_and_only_active`) |
| CT-21 | Komponenta: oblik odgovora popisa područja | Jedno područje „Painting”. | Odgovor je `[{"id": <id>, "name": "Painting"}]` i ništa drugo. | Kao očekivano. | Prošlo | Stvoriti područje Painting; pozvati `GET /api/portfolio/art-fields/`; provjeriti da je odgovor točno popis s jednim objektom koji sadrži samo `id` i `name`. (`ArtFieldListTests.test_item_has_id_and_name_only`) |
| CT-22 | Komponenta: stvaranje prilike bez prijave (F-007) | POST `/api/opportunities/` s valjanim podacima, bez sesije. | Odgovor 401. | Kao očekivano. | Prošlo | Poslati `POST /api/opportunities/` s valjanim podacima bez prijave; provjeriti status 401. (`CreateOpportunityTests.test_not_logged_in_returns_401`) |
| CT-23 | Komponenta: umjetnik ne može stvoriti priliku (F-007) | Prijavljeni korisnik s ulogom umjetnika šalje POST s valjanim podacima. | Odgovor 403. | Kao očekivano. | Prošlo | Prijaviti umjetnika; poslati `POST /api/opportunities/` s valjanim podacima; provjeriti status 403. (`CreateOpportunityTests.test_artist_returns_403`) |
| CT-24 | Komponenta: organizator stvara priliku (F-007) | Prijavljeni organizator; `type`, `title`, `description`, `field` (ID aktivnog područja), `deadline` za 30 dana. | 201; `status` je `preparation`; prilika je spremljena uz profil prijavljenog organizatora. | Kao očekivano. | Prošlo | Prijaviti organizatora; poslati valjanu priliku; provjeriti status 201 i `status` `preparation`; učitati priliku iz baze i provjeriti da joj je organizator prijavljeni organizator. (`CreateOpportunityTests.test_organizer_creates_opportunity_in_preparation`) |
| CT-25 | Komponenta: status se ne može zadati pri stvaranju (F-009) | Valjani podaci uz dodatno `status: open`. | 201; `status` u odgovoru je `preparation`. | Kao očekivano. | Prošlo | Poslati valjanu priliku s poljem `status: open`; provjeriti status 201 i da je `status` u odgovoru `preparation`. (`CreateOpportunityTests.test_status_in_request_is_ignored`) |
| CT-26 | Komponenta: prilika bez naziva (F-007) | Valjani podaci bez `title`. | 400 s porukom uz `title`. | Kao očekivano. | Prošlo | Poslati priliku bez `title`; provjeriti status 400 i poruku uz `title`. (`CreateOpportunityTests.test_missing_title_returns_400`) |
| CT-27 | Komponenta: rok za prijavu u prošlosti (F-007) | Valjani podaci s `deadline` od jučer. | 400 s porukom uz `deadline`. | Kao očekivano. | Prošlo | Poslati priliku s jučerašnjim rokom; provjeriti status 400 i poruku uz `deadline`. (`CreateOpportunityTests.test_deadline_in_past_returns_400`) |
| CT-28 | Komponenta: popis prilika bez prijave (F-007) | GET `/api/opportunities/` bez sesije. | Odgovor 401. | Kao očekivano. | Prošlo | Pozvati `GET /api/opportunities/` bez prijave; provjeriti status 401. (`ListOpportunitiesTests.test_not_logged_in_returns_401`) |
| CT-29 | Komponenta: umjetnik vidi samo objavljene prilike (F-007) | Dvije prilike istog organizatora: jedna u statusu `preparation`, jedna `open`; prijavljeni umjetnik. | 200; vraćena je samo prilika `open`. | Kao očekivano. | Prošlo | Stvoriti nacrt i otvorenu priliku; prijaviti umjetnika; pozvati `GET /api/opportunities/`; provjeriti status 200 i da popis sadrži samo otvorenu priliku. (`ListOpportunitiesTests.test_artist_sees_only_published`) |
| CT-30 | Komponenta: organizator vidi vlastite prilike uključujući nacrte (F-007) | Organizator ima nacrt i otvorenu priliku; drugi organizator ima nacrt. | 200; vraćene su samo dvije vlastite prilike, tuđe nema. | Kao očekivano. | Prošlo | Stvoriti dva organizatora i tri prilike; prijaviti prvog; pozvati `GET /api/opportunities/mine/`; provjeriti status 200 i da su vraćene samo njegove dvije prilike. (`MyOpportunitiesTests.test_organizer_sees_own_including_drafts_but_not_others`) |
| CT-31 | Komponenta: umjetnik ne može otvoriti popis „moje prilike” (F-007) | Prijavljeni umjetnik poziva GET `/api/opportunities/mine/`. | Odgovor 403. | Kao očekivano. | Prošlo | Prijaviti umjetnika; pozvati `GET /api/opportunities/mine/`; provjeriti status 403. (`MyOpportunitiesTests.test_artist_returns_403`) |
| CT-32 | Komponenta: detalj prilike bez prijave (F-007) | GET `/api/opportunities/<id>/` bez sesije. | Odgovor 401. | Kao očekivano. | Prošlo | Pozvati detalj objavljene prilike bez prijave; provjeriti status 401. (`OpportunityDetailTests.test_not_logged_in_returns_401`) |
| CT-33 | Komponenta: umjetnik otvara objavljenu priliku (F-007) | Prilika u statusu `open`; prijavljeni umjetnik. | 200; odgovor sadrži naziv prilike. | Kao očekivano. | Prošlo | Prijaviti umjetnika; pozvati detalj otvorene prilike; provjeriti status 200 i `title`. (`OpportunityDetailTests.test_artist_can_open_published`) |
| CT-34 | Komponenta: umjetnik ne vidi nacrt (F-007) | Prilika u statusu `preparation`; prijavljeni umjetnik. | Odgovor 404. | Kao očekivano. | Prošlo | Prijaviti umjetnika; pozvati detalj nacrta; provjeriti status 404. (`OpportunityDetailTests.test_artist_cannot_open_draft_returns_404`) |
| CT-35 | Komponenta: organizator otvara vlastiti nacrt (F-007) | Prilika u statusu `preparation`; prijavljen njezin organizator. | Odgovor 200. | Kao očekivano. | Prošlo | Prijaviti vlasnika; pozvati detalj njegova nacrta; provjeriti status 200. (`OpportunityDetailTests.test_owner_can_open_own_draft`) |
| CT-36 | Komponenta: drugi organizator ne vidi tuđi nacrt (F-007) | Nacrt prvog organizatora; prijavljen drugi organizator. | Odgovor 404. | Kao očekivano. | Prošlo | Prijaviti drugog organizatora; pozvati detalj tuđeg nacrta; provjeriti status 404. (`OpportunityDetailTests.test_other_organizer_cannot_open_draft_returns_404`) |
| CT-37 | Komponenta: objava prilike (F-009) | Prilika `preparation` s opisom i rokom; odobreni organizator; POST `status: open`. | 200; `status` je `open` i u odgovoru i u bazi. | Kao očekivano. | Prošlo | Prijaviti vlasnika; poslati `POST /api/opportunities/<id>/status/` s `open`; provjeriti status 200 i `open` u odgovoru; ponovno učitati priliku i provjeriti status. (`StatusChangeTests.test_publish_moves_preparation_to_open`) |
| CT-38 | Komponenta: cijeli životni ciklus statusa (F-009) | Prilika `preparation`; redom `open`, `closed`, `open`, `selection`, `finished`. | Svaka promjena vraća 200. | Kao očekivano. | Prošlo | Poslati redom svih pet promjena statusa; provjeriti status 200 nakon svake. (`StatusChangeTests.test_full_lifecycle`) |
| CT-39 | Komponenta: nedopušten prijelaz statusa (F-009) | Prilika `preparation`; zahtjev za status `finished`. | 400; status ostaje `preparation`. | Kao očekivano. | Prošlo | Poslati promjenu iz `preparation` u `finished`; provjeriti status 400; ponovno učitati priliku i provjeriti da je i dalje `preparation`. (`StatusChangeTests.test_invalid_transition_returns_400`) |
| CT-40 | Komponenta: završena prilika ne mijenja status (F-009) | Prilika `finished`; zahtjev za status `open`. | Odgovor 400. | Kao očekivano. | Prošlo | Postaviti priliku na `finished`; poslati promjenu u `open`; provjeriti status 400. (`StatusChangeTests.test_cannot_leave_finished`) |
| CT-41 | Komponenta: objava traži opis i rok (F-009) | Prilika bez roka i bez opisa; zahtjev za status `open`. | 400 s porukama uz `deadline` i `description`. | Kao očekivano. | Prošlo | Stvoriti priliku bez roka i opisa; poslati promjenu u `open`; provjeriti status 400 i poruke uz oba polja. (`StatusChangeTests.test_publish_requires_deadline_and_description`) |
| CT-42 | Komponenta: neodobreni organizator ne može objaviti (F-007.1, F-009) | Organizator s `approved = false`; vlastita prilika `preparation`; zahtjev za status `open`. | Odgovor 403. | Kao očekivano. | Prošlo | Stvoriti neodobrenog organizatora i njegovu priliku; prijaviti ga; poslati promjenu u `open`; provjeriti status 403. (`StatusChangeTests.test_unapproved_organizer_cannot_publish_returns_403`) |
| CT-43 | Komponenta: tuđoj prilici ne može promijeniti status (F-009) | Prilika prvog organizatora; prijavljen drugi organizator. | Odgovor 404. | Kao očekivano. | Prošlo | Prijaviti drugog organizatora; poslati promjenu statusa tuđe prilike; provjeriti status 404. (`StatusChangeTests.test_other_organizer_gets_404`) |
| CT-44 | Komponenta: umjetnik ne može mijenjati status (F-009) | Prijavljeni umjetnik šalje promjenu statusa. | Odgovor 403. | Kao očekivano. | Prošlo | Prijaviti umjetnika; poslati promjenu statusa; provjeriti status 403. (`StatusChangeTests.test_artist_gets_403`) |
| CT-45 | Komponenta: nacrt se može uređivati bez ograničenja (F-009, F-010) | Nacrt; PATCH s novim `title` i `reward`. | 200; oba polja promijenjena u bazi. | Kao očekivano. | Prošlo | Poslati `PATCH /api/opportunities/<id>/` s `title` i `reward`; provjeriti status 200; ponovno učitati priliku i provjeriti oba polja. (`UpdateOpportunityTests.test_draft_can_be_edited_freely`) |
| CT-46 | Komponenta: objavljenoj prilici mijenja se lokacija, rok i vrijeme (F-010) | Prilika `open`; PATCH s `address`, `latitude`, `longitude`, `deadline`, `starts_at`, `ends_at`. | 200; `address` i `deadline` promijenjeni. | Kao očekivano. | Prošlo | Poslati PATCH s navedenim poljima; provjeriti status 200; ponovno učitati priliku i provjeriti `address` i `deadline`. (`UpdateOpportunityTests.test_published_allows_location_deadline_and_time`) |
| CT-47 | Komponenta: objavljenoj prilici ostala polja su zaključana (F-010) | Prilika `open`; PATCH s `title` i `reward`. | 400 s porukama uz `title` i `reward`; naziv ostaje nepromijenjen. | Kao očekivano. | Prošlo | Poslati PATCH s `title` i `reward`; provjeriti status 400 i poruke uz oba polja; ponovno učitati priliku i provjeriti da je `title` isti. (`UpdateOpportunityTests.test_published_rejects_other_fields`) |
| CT-48 | Komponenta: nepromijenjena zaključana vrijednost nije greška (F-010) | Prilika `open`; PATCH s istim `title` i novim `address`. | Odgovor 200. | Kao očekivano. | Prošlo | Poslati PATCH s postojećim nazivom i novom adresom; provjeriti status 200. (`UpdateOpportunityTests.test_published_accepts_unchanged_value_for_locked_field`) |
| CT-49 | Komponenta: završena prilika se ne uređuje (F-010) | Prilika `finished`; PATCH s novom `address`. | Odgovor 400. | Kao očekivano. | Prošlo | Postaviti priliku na `finished`; poslati PATCH; provjeriti status 400. (`UpdateOpportunityTests.test_finished_cannot_be_edited`) |
| CT-50 | Komponenta: status se ne mijenja uređivanjem (F-009) | Nacrt; PATCH sa `status: open`. | Status u bazi ostaje `preparation`. | Kao očekivano. | Prošlo | Poslati PATCH sa `status: open`; ponovno učitati priliku i provjeriti da je `preparation`. (`UpdateOpportunityTests.test_status_cannot_be_changed_through_patch`) |
| CT-51 | Komponenta: tuđu priliku ne može uređivati (F-010) | Prilika prvog organizatora; prijavljen drugi organizator. | Odgovor 404. | Kao očekivano. | Prošlo | Prijaviti drugog organizatora; poslati PATCH na tuđu priliku; provjeriti status 404. (`UpdateOpportunityTests.test_other_organizer_gets_404`) |
| CT-52 | Komponenta: umjetnik ne može uređivati prilike (F-010) | Prijavljeni umjetnik šalje PATCH. | Odgovor 403. | Kao očekivano. | Prošlo | Prijaviti umjetnika; poslati PATCH; provjeriti status 403. (`UpdateOpportunityTests.test_artist_gets_403`) |
| CT-53 | Komponenta: PUT nije dopušten (F-010) | PUT na `/api/opportunities/<id>/`. | Odgovor 405. | Kao očekivano. | Prošlo | Poslati `PUT` na detalj prilike; provjeriti status 405. (`UpdateOpportunityTests.test_put_is_not_allowed`) |
| CT-54 | Komponenta: brisanje objavljene prilike s obrazloženjem (F-010) | Prilika `open`; DELETE s `reason: "Izložba otkazana"`. | 204; redak ostaje u bazi s `deleted_at` i spremljenim obrazloženjem; umjetnik je ne vidi u popisu, a detalj vraća 404. | Kao očekivano. | Prošlo | Poslati `DELETE /api/opportunities/<id>/` s obrazloženjem; provjeriti status 204; ponovno učitati priliku i provjeriti `deleted_at` i `deletion_reason`; prijaviti umjetnika i provjeriti prazan popis i 404 na detalju. (`DeleteOpportunityTests.test_published_delete_saves_reason_and_hides_it`) |
| CT-55 | Komponenta: obrisana prilika nestaje i iz popisa vlasnika (F-010) | Obrisana objavljena prilika; vlasnik poziva GET `/api/opportunities/mine/`. | Popis je prazan. | Kao očekivano. | Prošlo | Obrisati priliku s obrazloženjem; pozvati `GET /api/opportunities/mine/`; provjeriti da je popis prazan. (`DeleteOpportunityTests.test_deleted_is_hidden_from_owner_list_too`) |
| CT-56 | Komponenta: brisanje objavljene prilike traži obrazloženje (F-010) | DELETE bez tijela, s `{}` i s `reason` od razmaka. | Svaki zahtjev 400; prilika nije obrisana. | Kao očekivano. | Prošlo | Tri puta poslati DELETE objavljene prilike bez valjanog obrazloženja; provjeriti status 400; ponovno učitati priliku i provjeriti da je `deleted_at` prazan. (`DeleteOpportunityTests.test_published_delete_without_reason_returns_400`) |
| CT-57 | Komponenta: nacrt se briše bez obrazloženja (F-010) | Nacrt; DELETE bez tijela. | 204; redak više ne postoji u bazi. | Kao očekivano. | Prošlo | Poslati DELETE nacrta; provjeriti status 204 i da prilika više ne postoji u bazi. (`DeleteOpportunityTests.test_draft_is_removed_without_reason`) |
| CT-58 | Komponenta: obrisanu priliku nije moguće ponovno obrisati (F-010) | Već obrisana prilika; novi DELETE. | Odgovor 404. | Kao očekivano. | Prošlo | Obrisati priliku; poslati DELETE ponovno; provjeriti status 404. (`DeleteOpportunityTests.test_deleted_cannot_be_deleted_again`) |
| CT-59 | Komponenta: tuđu priliku ne može obrisati (F-010) | Prilika prvog organizatora; prijavljen drugi organizator šalje DELETE s obrazloženjem. | 404; prilika nije obrisana. | Kao očekivano. | Prošlo | Prijaviti drugog organizatora; poslati DELETE; provjeriti status 404; ponovno učitati priliku i provjeriti da je `deleted_at` prazan. (`DeleteOpportunityTests.test_other_organizer_gets_404`) |
| CT-60 | Komponenta: umjetnik ne može brisati prilike (F-010) | Prijavljeni umjetnik šalje DELETE s obrazloženjem. | Odgovor 403. | Kao očekivano. | Prošlo | Prijaviti umjetnika; poslati DELETE; provjeriti status 403. (`DeleteOpportunityTests.test_artist_gets_403`) |
| ST-01 | Sustav: prijava putem Googlea i dovršetak registracije u pokrenutoj aplikaciji | Prijava Google računom s popisa testnih korisnika; zatim registracija umjetnika. | Nakon povratka, `/api/users/me/` vraća korisnika s `registration_complete: false`; nakon registracije `true`; nakon odjave 401. | Nije pokrenuto. | Nije pokrenuto | Otvoriti `/oauth/google/login/`; prijaviti se; otvoriti `/api/users/me/`; poslati registraciju kroz DRF sučelje; ponovno otvoriti `me`; odjaviti se; ponovno otvoriti `me`. |


Scenarij određuje funkcionalnost koja se ispituje. Opaženi rezultat i **Prošlo**, **Nije prošlo** ili **Blokirano** unesite tek nakon izvođenja; do tada koristite **Nije pokrenuto**. Koraci ispitivanja moraju omogućiti drugom članu tima da ponovi provjeru. Izvorni kod automatiziranog ispitivanja čuvajte u Git repozitoriju projekta i iz relevantnog slučaja postavite poveznicu na njega; za ručnu provjeru ovdje dokumentirajte korake. Odaberite normalne slučajeve, smislene nevaljane ulaze ili granice, neuspjehe i relevantna svojstva kvalitete. Funkcionalnost koja nije implementirana predstavlja nedovršen opseg; provjera kako aplikacija obrađuje nevaljani ID valjano je negativno ispitivanje.

<details>
<summary><strong>Slučajevi podnošenja prijave na dvije razine ispitivanja</strong></summary>

**Primjer — ispitni slučajevi CrisisMapa:** Jedan neuspješan rezultat, ST-02, pokazuje razliku između provedenog slučaja i planiranih slučajeva označenih kao **Nije pokrenuto**. Datum, revizija, okruženje i dokazi oglednog izvođenja navedeni su u nastavku.

| ID ispitnog slučaja | Scenarij ispitivanja | Ulazni podaci | Očekivani rezultat | Stvarni rezultat | Ishod | Koraci ispitivanja |
| --- | --- | --- | --- | --- | --- | --- |
| CT-01 | Komponenta: valjana lokacija | Poplava; zemljopisna širina 45.82; zemljopisna dužina 16.00. | Koordinate prihvaćene. | Nije pokrenuto. | Nije pokrenuto | Pozvati validator lokacije s obje koordinate; provjeriti valjan rezultat. |
| CT-02 | Komponenta: nedostaje lokacija | Poplava; zemljopisna širina i dužina nisu zadane. | Provjera odbija podnošenje; ništa se ne sprema. | Nije pokrenuto. | Nije pokrenuto | Pozvati provjeru bez lokacije; provjeriti odbijanje i da nema spremanja. |
| CT-03 | Komponenta: granična vrijednost koordinata | Prvo (90, 180), zatim (90.01, 180). | Granica prihvaćena; vrijednost izvan granice odbijena. | Nije pokrenuto. | Nije pokrenuto | Izvesti provjeru s oba ulaza; usporediti ishode. |
| CT-04 | Komponenta: prijelaz prijave | Prijava u stanju SUBMITTED; odbijanje, zatim odobravanje. | Odobravanje odbijeno; status ostaje REJECTED. | Nije pokrenuto. | Nije pokrenuto | Odbiti prijavu; pozvati odobravanje; provjeriti konačni status. |
| CT-05 | Komponenta: prijava ne postoji | Repozitorij nema prijavu s ID-om 9999. | Definiran ishod „nije pronađeno”; ne stvara se izmišljena prijava. | Nije pokrenuto. | Nije pokrenuto | Zatražiti ID 9999 nad kontroliranim podacima repozitorija; provjeriti ishod „nije pronađeno”. |
| CT-06 | Komponenta: primatelji obavijesti | Potvrđena poplava blizu regije A; jedna pretplata na regiju A i jedna na regiju B. | Odabran je samo prihvatljiv primatelj u regiji A. | Nije pokrenuto. | Nije pokrenuto | Pozvati odabir primatelja s dvjema pretplatama; usporediti ID-ove. |
| CT-07 | Komponenta: nevaljana vrsta kriznog događaja | Prijava sadrži vrstu događaja izvan podržanog skupa. | Provjera odbija vrstu; prijava se ne sprema. | Nije pokrenuto. | Nije pokrenuto | Zadati nepodržanu vrijednost provjeri prijave; provjeriti odbijanje. |
| ST-01 | Sustav: valjano podnošenje prijave | Poplava; Visoka; odabrana lokacija na karti 45.82, 16.00. | Prikazuje se potvrda; prijava se može ponovno dohvatiti. | Nije pokrenuto. | Nije pokrenuto | Otvoriti obrazac; unijeti podatke; odabrati točku; poslati; otvoriti nastalu prijavu. |
| ST-02 | Sustav: nedostaje obavezna lokacija | Poplava; Visoka; opis „Water rising”; lokacija prazna. | Prikazuje se pogreška specifična za lokaciju; broj prijava se ne povećava. | Prikazana je općenita pogreška poslužitelja; broj prijava ostao je 24. | Nije prošlo | Otvoriti obrazac; unijeti podatke bez lokacije; poslati; usporediti broj prijava prije i poslije. |
| ST-03 | Sustav: dopuštenje geolokacije odbijeno | Dopuštenje preglednika odbijeno; Poplava; ručno odabrana točka na karti. | Korisnik može ručno odabrati lokaciju i podnijeti prijavu. | Nije pokrenuto. | Nije pokrenuto | Odbiti dopuštenje; odabrati točku na karti; poslati; provjeriti potvrdu. |
| ST-04 | Sustav: zaštićeni pregled prijave | Prijavljeni građanin bez moderatorske uloge; prijava ID 104. | Odobravanje odbijeno; prijava ostaje nepromijenjena. | Nije pokrenuto. | Nije pokrenuto | Pokušati odobravanje kroz aplikaciju/API; provjeriti odgovor i stanje prijave. |
| ST-05 | Sustav: pozadinski sustav nedostupan | Valjani podaci prijave poplave; pozadinski sustav namjerno nedostupan u ispitnom okruženju. | Aplikacija prijavljuje neuspjeh i ne prikazuje lažnu potvrdu podnošenja. | Nije pokrenuto. | Nije pokrenuto | Isključiti ispitni pozadinski sustav; poslati prijavu kroz preglednik; provjeriti poruku i ponašanje pri oporavku. |

**Analiza primjera:** Komponentni slučajevi izravno ispituju pravila; sustavski slučajevi ispituju vidljivo ponašanje u pokrenutoj aplikaciji. CT-03 pokazuje stvarnu graničnu vrijednost i vrijednost neposredno izvan nje; neodređena formulacija poput „vrlo dugačak ulaz” ne utvrđuje granicu. Ako tim usvoji zahtjev kvalitete NF-01 za ručni odabir lokacije, ST-03 ga također može provjeravati; nemojte stvarati drugi slučaj s istim koracima samo da biste dobili ID nefunkcijskog ispitivanja. CT-06 i ST-04 ovise o odobrenim funkcionalnostima. Redci prikazuju više tehnika i jedan ogledni neuspjeh; ne određuju obavezni broj slučajeva. Cilj performansi ili dostupnosti treba dogovoreni prag i izvediv postupak mjerenja prije nego što postane projektno ispitivanje.

**Detalji ponavljanja ST-02:** Prije radnje prebrojite pohranjene prijave u ispitnoj bazi podataka (24 u ovom oglednom izvođenju). Otvorite obrazac; odaberite Poplava i visoku razinu ozbiljnosti; unesite „Water rising”; ostavite lokaciju praznom; pošaljite; zabilježite poruku i ponovno provjerite broj prijava. Zabilježite reviziju aplikacije, prikazanu pogrešku i oba broja. Općenita pogreška ne zadovoljava očekivano objašnjenje specifično za lokaciju iako broj prijava ostaje 24.

</details>

<details>
<summary><strong>Od koraka podnošenja prijave do Selenium radnji</strong></summary>

**Primjer — CrisisMap:** Slučaj ST-01 u ovom nastavnom oblikovanju koristi polje za ručni unos koordinata. Nazivi selektora u nastavku predstavljaju elemente obrasca u ovom primjeru; tim mora pregledati vlastitu aplikaciju umjesto kopiranja tih identifikatora. Selenium IDE može snimiti interakciju, ali snimljeni slučaj i dalje treba provjeru očekivanog rezultata. Selenium WebDriver omogućuje timu da radnje i provjere napiše u verzioniranom ispitivanju.

| Korak | Postupak čitljiv čovjeku | Radnja Selenium WebDrivera u primjeru |
| --- | --- | --- |
| 1 | Otvoriti obrazac za prijavu. | Otvoriti URL obrasca za prijavu u ispitnoj aplikaciji. |
| 2 | Odabrati Poplava kao vrstu kriznog događaja. | Pronaći element `incidentType` i odabrati `Flood`. |
| 3 | Odabrati visoku razinu ozbiljnosti. | Pronaći element `severity` i odabrati `High`. |
| 4 | Unijeti lokaciju prijave. | Pronaći `locationInput` i unijeti `45.82, 16.00`. |
| 5 | Opisati krizni događaj. | Pronaći `description` i unijeti `Flooding in the city center`. |
| 6 | Poslati obrazac. | Pronaći i kliknuti `submitReport`. |
| 7 | Provjeriti rezultat. | Pričekati `reportConfirmation`; provjeriti da sadrži referencu na prijavu; otvoriti prijavu i provjeriti njezin opis. |

**WebDriver fragment (JavaScript):**

```js
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

(async () => {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get(baseUrl + '/reports/new');
    await driver.findElement(By.id('incidentType')).sendKeys('Flood');
    await driver.findElement(By.id('severity')).sendKeys('High');
    await driver.findElement(By.id('locationInput')).sendKeys('45.82, 16.00');
    await driver.findElement(By.id('description'))
      .sendKeys('Flooding in the city center');
    await driver.findElement(By.id('submitReport')).click();

    const confirmation = await driver.wait(
      until.elementLocated(By.id('reportConfirmation')),
      10000
    );

    assert((await confirmation.getText()).includes('Report'));

    const reportUrl = await driver
      .findElement(By.id('createdReportLink'))
      .getAttribute('href');

    await driver.get(reportUrl);

    assert(
      (await driver.findElement(By.id('reportDetails')).getText())
        .includes('Flooding in the city center')
    );
  } finally {
    await driver.quit();
  }
})();
```

**Analiza primjera:** Sedmi korak provjerava potvrdu i da se podnesena prijava može ponovno dohvatiti. Eksplicitno čekanje daje aplikaciji vrijeme za prikaz asinkrone potvrde. Selektori, ruta i tekst potvrde moraju odgovarati korisničkom sučelju tima; snimanje tijeka bez provjere očekivanog rezultata nije dokaz da je ispitivanje prošlo. Verzionirajte automatizirano ispitivanje i sačuvajte rezultat izvođenja.

</details>

<details>
<summary><strong>Ispitivanja performansi, uporabljivosti i sigurnosti</strong></summary>

**Primjer — CrisisMap:** Ovi dodatni slučajevi prikazuju vrste provjera zastupljene u ranijim materijalima kolegija. Ciljevi opterećenja ili vremena izvršavanja zadatka primjenjuju se samo kada tim ima dogovoreni zahtjev i izvediv način mjerenja. Svih šest slučajeva u nastavku označeno je kao **Nije pokrenuto**.

| ID ispitnog slučaja | Scenarij ispitivanja | Ulazni podaci | Očekivani rezultat | Stvarni rezultat | Ishod | Koraci ispitivanja |
| --- | --- | --- | --- | --- | --- | --- |
| NF-P-01 | Performanse: opterećenje popisa prijava | 20 istodobnih korisnika tijekom dvije minute; baza podataka sadrži 100 prijava. | Ako je odobreni cilj 95. percentil vremena odziva od 2 s i najviše 1 % neuspjelih zahtjeva, obje izmjerene vrijednosti zadovoljavaju cilj. | Nije pokrenuto. | Nije pokrenuto | Pripremiti prijave; pokrenuti JMeter ili prikladan alat za opterećenje; zabilježiti vremena odziva, stopu pogrešaka i konfiguraciju smještaja. |
| NF-P-02 | Performanse: veće opterećenje | Povećati broj korisnika s 20 na 40, zatim na 80 uz isti skup podataka. | Zabilježiti opterećenje pri kojem se prvi put prekorači dogovoreni cilj kašnjenja ili stope pogrešaka; bez cilja ne tvrditi da je ispitivanje prošlo. | Nije pokrenuto. | Nije pokrenuto | Povećavati opterećenje u koracima; sačuvati izvještaj alata i zabilježiti kada se pogreške prvi put pojavljuju. |
| NF-U-01 | Uporabljivost: podnošenje prijave poplave | Tri sudionika koji prvi put koriste sučelje; svi dobivaju isti zadatak prijave. | Svaki sudionik može pronaći obrazac, unijeti lokaciju i podnijeti prijavu bez pomoći; zabilježiti vrijeme i poteškoće. | Nije pokrenuto. | Nije pokrenuto | Zadati zadatak; promatrati pokušaje; zabilježiti dovršetak, vrijeme i točke nesnalaženja. |
| NF-U-02 | Pristupačnost: podnošenje samo tipkovnicom | Navigacija tipkovnicom; mogućnost ručnog unosa lokacije. | Korisnik može dosegnuti sva obavezna polja, odabrati lokaciju, poslati prijavu i pročitati potvrdu bez pokazivačkog uređaja. | Nije pokrenuto. | Nije pokrenuto | Navigirati samo tipkovnicom; zabilježiti redoslijed fokusa i rezultat. |
| NF-S-01 | Sigurnost: unos prijave obrađuje se kao podatak | Opis sadrži niz `' OR '1'='1` u kontroliranom ispitnom okruženju. | Nema neželjenog rezultata upita, neovlaštenog pristupa ni kvara poslužitelja; unos se obrađuje kao podatak. | Nije pokrenuto. | Nije pokrenuto | Poslati niz; provjeriti odgovor i pohranjeni rezultat; pregledati relevantne zapise ispitivanja. |
| NF-S-02 | Sigurnost: nevaljani identitet pri pregledu | Istekli ili nevaljani token prijave; pokušaj odobravanja prijave 104. | Zahtjev odbijen; prijava 104 ostaje nepromijenjena. | Nije pokrenuto. | Nije pokrenuto | Pozvati zaštićenu radnju s nevaljanim identitetom; provjeriti odgovor i stanje prijave. |

**Analiza primjera:** Primjer opterećenja zahtijeva zabilježene percentile i pogreške, a ne tvrdnju da je aplikacija „podržala 1.000 korisnika”. Opažanje triju sudionika dokaz je o tim pokušajima, a ne dokaz opće uporabljivosti. Sigurnosni retci ispituju definirano ponašanje; jedan ulazni niz ne dokazuje da je aplikacija sigurna. NF-S-02 relevantan je samo kada je zaštićeni pregled prijave dio odobrenog opsega. Sustavsko ispitivanje može istodobno pružiti dokaz za nefunkcijski zahtjev: ST-03 već provjerava ručni odabir lokacije pa ponavljanje istih koraka pod novim ID-om ne donosi vrijednost.

</details>

## 5.3 Provedena ispitivanja i rezultati

**Cilj:** Navesti reviziju aplikacije, okruženje i dokaze potrebne za tumačenje stvarnih rezultata u tablici ispitnih slučajeva. Dodajte kratak zapis izvođenja kada te podatke nije moguće jasno prenijeti poveznicom na kod ispitivanja ili CI izvođenje.

**Najnovije izvođenje ili dokaz:** Najnovije izvođenje: 15. 11. 2026., lokalno u Docker okruženju (Django u kontejneru backend, PostgreSQL 18 u kontejneru db), naredba docker compose run --rm --build backend python3 manage.py test. Rezultat: pronađeno i izvedeno 60 testova, svi prošli (OK), provjera sustava bez primjedbi. Revizija aplikacije: commit ea44017.

Izvođenje u GitHub Actionsu (ci.yml) uspješno.

Stupci **Stvarni rezultat** i **Ishod** iznad mjerodavni su rezultati za pojedinačni slučaj. Nemojte kopirati sve rezultate u drugu obaveznu tablicu. Neuspješna i blokirana izvođenja zabilježite iskreno; pri ponovnom izvođenju zadržite relevantnu povijest umjesto prikazivanja starog uspješnog rezultata kao trenutačnog.

<details>
<summary><strong>Bilježenje neuspješnog izvođenja bez izmišljanja prolaza</strong></summary>

**Primjer — scenarij pregleda CrisisMapa:** Tijekom izvođenja ST-02 korisnik podnosi prijavu bez odabira lokacije. Aplikacija prikazuje općenitu pogrešku poslužitelja umjesto da navede da lokacija nedostaje.

| ID ispitivanja ili izvođenja | Datum i revizija aplikacije | Okruženje | Opaženi rezultat i ishod | Dokaz |
| --- | --- | --- | --- | --- |
| `tests/evidence/ST-02-error.png`; `tests/evidence/ST-02-db-check.txt`; zadatak #18 |

**Analiza primjera:** Revizija i okruženje čine izvođenje prepoznatljivim; snimka zaslona podupire opaženu poruku, dok zabilježeni broj prijava podupire zasebnu tvrdnju da ništa nije spremljeno. Zadatak prati nedostatak. Nakon ispravka ponovno izvedite ST-02 i ažurirajte njegov rezultat; prethodni neuspjeh zadržite u povijesti izvođenja ili zadatka.

</details>

## 5.4 Poznati nedostaci i ograničenja ispitivanja

**Cilj:** Omogućiti čitatelju da vidi nedostatke koji utječu na uporabu trenutačne aplikacije i važno ponašanje koje tim nije mogao provjeriti.

| Problem ili ograničenje | Korisniku vidljiv učinak ili neprovjereno ponašanje | Dokaz ili poveznica na zadatak |
| --- | --- | --- |
|  |  |  |

Detaljnu reprodukciju nedostatka i napredak čuvajte u alatu za praćenje zadataka, uz kratku poveznicu ovdje za nedostatke koji bitno utječu na aplikaciju ili demonstraciju. Ako je obavezna funkcionalnost nedovršena, jasno to navedite u završnim rezultatima; nemojte je nazivati poznatim nedostatkom niti uspješnim ispitivanjem. Iskreno zabilježite i nedostajuću mogućnost ispitivanja, primjerice vanjskog pružatelja koji tijekom izvođenja nije bio dostupan. Ovaj odjeljak ne zahtijeva drugi potpuni dnevnik problema.

<details>
<summary><strong>Razlikovanje neuspjele provjere od neprovjerene integracije</strong></summary>

**Primjer — CrisisMap:**

| Problem ili ograničenje | Korisniku vidljiv učinak ili neprovjereno ponašanje | Dokaz ili poveznica na zadatak |
| --- | --- | --- |
| Pogreška zbog nedostajuće lokacije previše je općenita | Građanin ne može prepoznati što mora ispraviti prije podnošenja prijave. | Zadatak #18; dokaz izvođenja ST-02. |
| Pružatelj obavijesti nije bio dostupan tijekom ispitivanja | Tim u tom izvođenju nije provjerio dostavu obavijesti. Podnošenje prijave i dalje može raditi. | Primjer zapisa blokiranog izvođenja `tests/evidence/notification-blocked.txt`. |

**Analiza primjera:** Prvi redak opisuje opaženi nedostatak; drugi ograničenje dostupnih dokaza. Nijedan se ne smije prikazati kao uspješno ispitivanje obavijesti. Redak uklonite ili ažurirajte kada se promijene zabilježeni dokazi tima.

</details>

**Završna provjera:** ID-ovi ispitivanja i očekivani ishodi odgovaraju primjenjivim zahtjevima i obrascima uporabe. Izvedeni rezultati upućuju na stvarnu reviziju aplikacije i pregledljivo izvođenje ili ponovljivo opažanje. Važni neuspjesi i otvoreni nedostaci ostaju vidljivi, dok završni opis isporučenih funkcionalnosti odražava ono što podržavaju ispitivanja i pokrenuta aplikacija.
