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

**Cilj:** Jasno definirati granice sustava — što je obuhvaćeno odobrenim zadatkom, što je svjesno izostavljeno ili odgođeno te o kojim vanjskim uslugama sustav izravno ovisi.

**Uključeno:** [Glavne mogućnosti.]  
**Izvan opsega ili odgođeno:** [Navedite funkcionalnosti koje su namjerno izostavljene ili prebačene u buduće verzije, uz kratko inženjersko ili vremensko obrazloženje.] 
**Vanjske ovisnosti:** [Navedite nužne vanjske usluge, API-je, baze podataka ili izvore informacija bez kojih sustav ne može funkcionirati (npr. Google Maps, platni pristupnici, vanjski pružatelj identiteta (OAuth)).]

<details>
<summary><strong>Definiranje početne granice projekta</strong></summary>

**Primjer — CrisisMap:**  
**Uključeno:** Podnošenje prijave kriznog događaja s lokacijom i pregled prijava na karti.  
**Isključeno:** Automatsko angažiranje hitnih službi; prikaz prijave ne odobrava niti pokreće službenu intervenciju.  
**Vanjska ovisnost:** Pružatelj kartografske usluge omogućuje prikaz karte; aplikacija ostaje odgovorna za vlastite podatke o prijavama.

Ovo je konkretna granica jer razdvaja prikaz informacija od službenog odgovora hitnih službi i određuje koji sustav osigurava kartu. Izuzeće i ovisnost dio su **nastavnog scenarija**, a ne tvrdnja o tome što objavljena aplikacija stvarno implementira; te činjenice određuju odobreni opseg i stvarna aplikacija tima.

**Drugi primjer korisne granice:** U prvoj implementaciji usredotočite se na koordinaciju odgovora na poplavu. Navedite vrste događaja ili korisnika koje pokriva odobreni projekt umjesto obećavanja svih mogućih kriznih procesa. Predviđanje pomoću umjetne inteligencije ili obuku u virtualnoj stvarnosti navedite kao budući rad samo ako predstavljaju smislen sljedeći korak, a ne kao pretpostavljene funkcionalnosti prve inačice.

Tvrdnja poput „modularna arhitektura omogućuje brzo postavljanje u novim regijama” zahtijeva stvarno projektno uporište. Ovdje nemojte obećavati prilagodljivost samo zato što zvuči kao poželjna korist projekta.

Ovaj pregled zadržite na razini opsega: navedite glavnu mogućnost i njezinu granicu bez popisivanja svakog zahtjeva ili projektne pojedinosti. Ono što je stvarno dovršeno i ono što je ostalo nedovršeno navedite u završnim rezultatima, a ne u ovom početnom opisu.

</details>

## 1.4 Postojeći pristupi i opravdanost projekta

**Cilj:** Objasniti kako korisnici trenutačno rješavaju problem i koja preostala potreba opravdava odobreni projekt.

[U dvije do četiri rečenice opišite jedan postojeći postupak ili relevantno rješenje, što ono već omogućuje i koja konkretna potreba motivira ovaj projekt. Činjenične tvrdnje o vanjskim proizvodima ili praksama potkrijepite izvorom.]

<details>
<summary><strong>Postojeći pristupi i opravdanost projekta</strong></summary>

**Primjer — CrisisMap:** „Nakon teškog vremenskog događaja građanin će možda morati provjeriti izvor meteoroloških upozorenja i zaseban izvor lokalnih prijava. Predloženi prikaz na karti u CrisisMapu objedinjuje prijave kriznih događaja relevantne za odabranu lokaciju. Aplikacija ne zamjenjuje službena upozorenja ni hitne službe.” Time se objašnjava potreba i namjeravana granica projekta bez tvrdnje da su svi postojeći kanali neučinkoviti. Prva je rečenica **primjer korisničkog scenarija**, a ne izmjeren nalaz o stvarnim korisnicima. Ako tim navodi konkretnu službu upozoravanja ili konkurentski proizvod, treba navesti izvor. Pregled konkurencije i snimke zaslona nisu obavezni.

Ako je postojeće rješenje stvarno utjecalo na projekt, usporedite samo relevantnu funkcionalnost, primjerice jasnoću karte ili potrebnu integraciju. Izbjegavajte unaprijed zadani broj proizvoda ili tablicu kriterija koji nisu povezani s odobrenim zadatkom.

</details>

---

>**Završna provjera:** Opis problema, cilj projekta, korisnici i dionici, granice opsega te postojeći pristupi međusobno su usklađeni. Navedene koristi ne predstavljaju neprovjerene tvrdnje, a uključene i izostavljene funkcionalnosti odgovaraju odobrenom projektnom zadatku.
