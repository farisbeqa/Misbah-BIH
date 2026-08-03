export interface BioSection {
  title: string
  items: string[]
}

export interface Bio {
  name: string
  role: string
  photo?: string
  born?: string
  sections: BioSection[]
}

export const BIOS: Record<string, Bio> = {
  'esma-klisura': {
    name: 'Esma Klisura',
    role: 'Urednica',
    photo: '/tim/esma-klisura.jpg',
    born: '22. april 2001., Sarajevo',
    sections: [
      {
        title: 'Obrazovanje',
        items: [
          '2020–2024. Fakultet islamskih nauka Univerziteta u Sarajevu — Bachelor islamske vjeronauke i religijske pedagogije',
          '2020. Pravni fakultet Univerziteta u Sarajevu (nije završen)',
          '2016–2020. Gazi Husrev-begova medresa u Sarajevu',
          '2007–2016. Osnovna škola „Nafija Sarajlić", Sarajevo',
        ],
      },
      {
        title: 'Iskustvo u radu',
        items: [
          'Ljetne mektebske radionice za djecu — Medžlis islamske zajednice Sarajevo (2022)',
          'Radno iskustvo u mektebskoj nastavi, džemat Nova Breka (2023)',
          'Instrukcije na području arapskog pisma i arapskog jezika (2023, 2024)',
          'Radionice i workshopovi za srednjoškolce u sklopu programa „Kurs islama" IZ (2024)',
          'Vjerska pouka za djecu u predškolskoj ustanovi „Dječiji koraci" (2024)',
          'Unos podataka u informacioni sistem Islamske zajednice u BiH (2024)',
          'Medijski angažman na Hayat TV (2025) i platformi IslamEDU (2024, 2025, 2026)',
          'Nastavnik vjeronauke u osnovnoj (2025) i srednjoj školi (2026)',
        ],
      },
      {
        title: 'Seminari i edukacije',
        items: [
          'Atraktivnost nastavničkog zanimanja — Ministarstvo za odgoj i obrazovanje KS (2023)',
          'Medijski diskurs o religiji u BIH: Odgovornost za riječ — Media centar IZ i NDI (2023)',
          'Akademija liderstva za mlade (I modul) — Studentski centar IZ u BiH (2022)',
          'Trening za trenere — Nadbiskupijski centar za pastoral mladih Ivan Pavao II (2022)',
          'Interkulturalni odgoj — Nadbiskupijski centar za pastoral mladih Ivan Pavao II (2023)',
          'Liderstvo u obrazovanju u BiH i SAD-u (COIL) — FIN i Shenandoah University US (2023)',
          'Zdravo, porodico — Medžlis IZ Sarajevo, Međureligijsko vijeće, World Vision, UNICEF (2023)',
          'Tajne uspješnog timskog rada — Centar za mlade Medžlisa IZ Sarajevo (2025)',
          'Genocide denial: history, tactics, and response — Univerzitet u Sarajevu, Yale (2025)',
          'Srebrenica Media Meetings 2025 — Memorijalni Centar Srebrenica i Britanska ambasada',
          'The Srebrenica Oral History Program — host/voditelj programa (2025)',
        ],
      },
      {
        title: 'Aktivnosti',
        items: [
          'Učešće u organizaciji programa „30 godina islamske vjeronauke u BIH" — FIN i Uprava za obrazovanje Rijaseta IZ (2022)',
          'Učešće u organizaciji seminara za imame „Bošnjaci u vremenu" — Rijaset IZ u BiH (2023)',
          'Učešće u organizaciji manifestacije „Selam ya Resulallah" — Medžlis IZ Sarajevo (2023, 2024)',
          'Organizacija Orijentacionog programa za studente I godine FIN (2023, 2024)',
          'Kustos na izložbi „Pod nebom vedre vjere" — Rijaset IZ u BiH (2023)',
          'Koordinator Centra za mlade Medžlisa IZ Sarajevo (2023, 2024)',
          'Podpredsjednik Upravnog odbora Udruženja studenata FIN (2023) — vodi projekte: Večer Kur\'ana, Dan Arapskog jezika, Ramazanske misli, Kapi dobrote',
        ],
      },
      {
        title: 'Medijska angažiranost',
        items: [
          'Vanjski saradnik Media centra IZ — BIR Radio',
          'Jednomjesečna praksa u medijskoj kući Hayat TV',
          'Kratki video-isječci „Dobrobit svake situacije u kojoj se nađemo" — BIR TV',
          '„Izvrsnost u postupcima" — Televizija 5',
          '„Odgoj djece" — Televizija 5',
          'Gostovanje u emisijama RTBH – In Medias Res: „Komunikacija", „Prijateljstvo"',
          'Gostovanje u emisijama Hayat TV: „Vrijednost znanja", „Tradicija Bošnjaka", „Znanje je vakuf"',
        ],
      },
      {
        title: 'Jezici',
        items: ['Engleski jezik', 'Turski jezik', 'Arapski jezik'],
      },
    ],
  },

  'hamza-bajraktarevic': {
    name: 'Hamza Bajraktarević',
    role: 'Urednik',
    photo: '/tim/hamza-bajraktarevic.jpg',
    sections: [
      {
        title: 'O Hamzi',
        items: [
          'Imam džemata Bjelave u Islamskoj zajednici u Bosni i Hercegovini.',
          'Student prava na Internacionalnom univerzitetu u Sarajevu (IUS) — dobitnik pune stipendije.',
          'Istovremeno studira islamsku teologiju na Fakultetu islamskih nauka Univerziteta u Sarajevu.',
          'Oblasti interesovanja: evropsko, međunarodno i komparativno pravo, islamsko pravo i etika.',
        ],
      },
      {
        title: 'Obrazovanje',
        items: [
          '2022– Pravni fakultet (LL.B.) — Internacionalni univerzitet u Sarajevu (IUS) · Dobitnik pune stipendije',
          '2024– Teološki studij — Fakultet islamskih nauka, Univerzitet u Sarajevu',
          '2018–2022. Gazi Husrev-begova medresa — završio s odličnim uspjehom',
        ],
      },
      {
        title: 'Radno iskustvo',
        items: [
          'Imam — Islamska zajednica u BiH, Džemat Bjelave (2025 – u toku)',
          'Mujezin — Džemat Bjelave (2020–2025)',
          'Urednik i voditelj omladinskih programa — Radio BIR (2021–2022)',
        ],
      },
      {
        title: 'Aktivnosti pri Misbah EDU',
        items: [
          'Organizuje i uređuje edukativna video predavanja iz serijala sire Božijeg Poslanika s.a.v.s.',
          'Piše edukativne tekstove iz oblasti sire Božijeg Poslanika s.a.v.s.',
          'Narator raznovrsnog edukativnog sadržaja',
          'Prevođenje edukativnog materijala sa engleskog i arapskog na bosanski jezik',
        ],
      },
      {
        title: 'Edukacije i certifikati',
        items: [
          'Deloitte Youth Talent Program — Deloitte',
          'Akademija liderstva — Studentski centar Islamske zajednice u BiH (2024)',
          'Seminar za radijsko novinarstvo i produkciju — Radio BIR (2022)',
        ],
      },
    ],
  },

  'mubina-suljic-solo': {
    name: 'Mubina Suljić Solo',
    role: 'Asistent na Katedri za šerijatsko pravo (fikh), FIN UNSA',
    photo: '/tim/mubina-suljic-solo.jpg',
    sections: [
      {
        title: 'O Mubini',
        items: [
          'Asistent na Katedri za šerijatsko pravo (fikh) na Fakultetu islamskih nauka Univerziteta u Sarajevu.',
          'Diplomirala 2023. godine na FIN UNSA sa prosjekom 10,00 — dobitnica Zlatne značke Univerziteta u Sarajevu.',
          'Magistrirala 2025. godine radom „Zbrinjavanje medicinskog otpada u šerijatskom pravu i zakonodavstvu Bosne i Hercegovine".',
          'Studentica I godine doktorskog studija na Fakultetu islamskih nauka.',
          'Hafiz Kur\'ana — hifz položen pred Komisijom Rijaseta IZ u BiH (juni 2019).',
          'Oblasti interesovanja: obredoslovlje (ibadat), šerijatsko pravo, historija fikha, savremena fikhska pitanja.',
        ],
      },
      {
        title: 'Obrazovanje',
        items: [
          '2025– Doktorski studij — Fakultet islamskih nauka, Univerzitet u Sarajevu',
          '2023–2025. Postdiplomski magistarski studij u islamskim naukama (oblast: šerijatsko pravo - fikh) — FIN UNSA · Teza: Zbrinjavanje medicinskog otpada u šerijatskom pravu i zakonodavstvu Bosne i Hercegovine',
          '2019–2023. Dodiplomski studij islamske teologije — FIN UNSA (prosjek 10,00)',
          '2015–2019. Gazi Husrev-begova medresa u Sarajevu',
        ],
      },
      {
        title: 'Radno iskustvo',
        items: [
          'Asistent — Katedra za šerijatsko pravo (fikh), FIN UNSA (april 2024 – u toku)',
          'Demonstrator — FIN UNSA (2021–2024)',
          'Edukatorica na predmetima ibadat, šerijatsko bračno pravo i kur\'ansko pismo — Medžlis IZ Sarajevo, Napredni edukativni program za žene (2023–2026)',
        ],
      },
      {
        title: 'Nastava na FIN UNSA',
        items: [
          'Ibadat (Islamsko obredoslovlje), Ibadat I i II',
          'Historija šerijatskog prava, Uvod u šerijatsko pravo',
          'Savremene fikhske teme, Šerijatsko građansko i vakufsko pravo',
          'Šerijatsko personalno pravo, Metodologija šerijatskog prava',
          'Drugi ciklus: Savremene fikhske studije u bh. kontekstu',
        ],
      },
      {
        title: 'Nagrade i priznanja',
        items: [
          'Zlatna značka — Univerzitet u Sarajevu (decembar 2023) · Najbolji student prvog ciklusa FIN UNSA, prosjek 10,00',
          'Diploma o položenom hifzu — Rijaset IZ u BiH (juni 2019)',
          'II mjesto — Takmičenje u hifzu „40 Nevevijevih hadisa", Fondacija „Hifz Časnog Kur\'ana" (septembar 2022)',
          'I mjesto — „Ljetni izazov: Jedan dan, jedan hadis", Fondacija „Hifz Časnog Kur\'ana" (august 2021)',
          'Certifikat za engleski jezik C1 — Poliglot (13.8.2026.)',
        ],
      },
      {
        title: 'Publikacije',
        items: [
          'Suljić Solo, Mubina, „Zbrinjavanje patološkog otpada u svjetlu šerijatskog prava i zakonodavstva BiH", Zbornik radova FIN, 2025.',
          'Suljić, Mubina, „Putovanje u sveta mjesta (jedinstvo u razlikama)", Putem svjetlosti iz pera mladosti, Planjax komerc, Tešanj, 2021.',
        ],
      },
      {
        title: 'Medijski nastupi (izbor)',
        items: [
          'Televizija BIR: „Moj ramazan" (april 2024)',
          'FTV: Dobro jutro BiH!, jutarnji program (januar 2024)',
          'Islam EDU: „Emocionalna inteligencija Muhammeda, a.s." (april 2023)',
          'Hayat Media BiH: „Kako post utiče na međuljudske relacije" (april 2022)',
          'Radio BIR: Gostovanje povodom položenog hifza (2019)',
        ],
      },
    ],
  },

  'muhamed-selimovic': {
    name: 'Muhamed Selimović',
    role: 'Autor edukativnog sadržaja',
    photo: '/tim/muhamed-selimovic.jpg',
    born: 'Konjic',
    sections: [
      {
        title: 'O Muhamedu',
        items: [
          'Hafiz Muhamed Selimović rođen je u Konjicu, gdje završava osnovnu školu kao učenik generacije.',
          'Još u mektebu učestvuje i pobjeđuje na mektebskom takmičenju na nivou Rijaseta.',
          'U novembru 2022. godine položio je hifz pred komisijom Rijaseta IZ u BiH. Muhaffiz mu je bio hafiz Salih ef. Halilović.',
          'Od 2022. godine je aktivan član projekta Misbah.',
        ],
      },
      {
        title: 'Obrazovanje',
        items: [
          'Osnovna škola u Konjicu — završio kao učenik generacije',
          'Gazi Husrev-begova medresa u Sarajevu — završio s odličnim uspjehom',
          'Fakultet Elektrotehnike — Internacionalni Univerzitet u Sarajevu (u toku)',
        ],
      },
      {
        title: 'Hifz i takmičenja',
        items: [
          'Hifz položen u novembru 2022. pred komisijom Rijaseta IZ u BiH (muhaffiz: hafiz Salih ef. Halilović)',
          'Učestvovao na nekoliko takmičenja iz učenja Kur\'ana',
          'Predvodio teravije i učio hafiske mukabele u Ferhadiji, Carevoj i Bakr-babinoj džamiji',
          'Pobjednik 17. državnog takmičenja iz hifza u kategoriji 15 džuzeva',
          'Drugoplasirani na Međunarodnom takmičenju u Zagrebu 2025. godine',
        ],
      },
    ],
  },

  'adna-kurtanovic': {
    name: 'Adna Kurtanović',
    role: 'Videografija i digitalni dizajn',
    photo: '/tim/adna-kurtanovic.jpg',
    born: '18. juli 2004., Sarajevo',
    sections: [
      {
        title: 'Obrazovanje',
        items: [
          'Osnovna škola „Edhem Mulabdić", Sarajevo — ponos i najistaknutiji učenik škole za 2017. godinu',
          'Gazi Husrev-begova medresa u Sarajevu',
          'Filozofski fakultet Univerziteta u Sarajevu — Odsjek za orijentalnu filologiju (u toku)',
        ],
      },
      {
        title: 'Vjerska angažiranost',
        items: [
          'Dugogodišnja aktivistkinja u džematu Carina na Vratniku, s povremenim angažmanom u ulozi mualime na polju mektebske pouke',
          'Aktivna članica škole hifza pri punktu Sultan Fatihove Careve džamije u Sarajevu',
          'Učesnica halke hifza i tefsira sure Merjem za studente Univerziteta u Sarajevu — Centar za Kur\'an i sunnet i Udruženje studenata Fakulteta islamskih nauka',
        ],
      },
      {
        title: 'Iskustvo u Misbahu',
        items: [
          'Članica projekta „Misbah" od 2022. — zadužena za kreiranje, editovanje i objavljivanje video i vizuelnog sadržaja na društvenim mrežama',
          'Videografijom i digitalnim dizajnom aktivno se bavi od 2024. godine',
          'Angažovana od strane Univerziteta u Sarajevu za snimanje i kreiranje video dokumentacije i medijskog sadržaja na naučnim konferencijama i međunarodnim događajima (mreža EUPeace i dr.)',
        ],
      },
      {
        title: 'Nagrade i dostignuća',
        items: [
          'III mjesto na Smotri naučno-tehničkog stvaralaštva mladih Bosne i Hercegovine — disciplina Spot',
          'III mjesto na video konkursu „Proljeće u Sarajevu" (2026) za autorski kratki film o Sarajevu — dodijeljeno u sklopu Dani Kantona Sarajevo',
        ],
      },
    ],
  },

  'muhamed-tutnic': {
    name: 'Muhamed Tutnić',
    role: 'Autor edukativnog sadržaja',
    photo: '/tim/muhamed-tutnic.jpg',
    born: '4. oktobar 2002., Zenica',
    sections: [
      {
        title: 'Obrazovanje',
        items: [
          'Osnovna škola „Žepče", Žepče',
          'Gazi Husrev-begova medresa, Sarajevo',
          'Fakultet islamskih nauka, Univerzitet u Sarajevu',
        ],
      },
      {
        title: 'Edukacije',
        items: [
          'Projekat „Imamsko mentorstvo"',
          'Edukacija „Mostovi mira: budućnost bez nasilja"',
          'Edukacija „Govorništvo i javni nastup"',
        ],
      },
    ],
  },

  'abdullah-hodzic': {
    name: 'Abdullah Hodžić',
    role: 'Društvene mreže i multimedija',
    photo: '/tim/abdullah-hodzic.jpg',
    sections: [
      {
        title: 'Edukacija i međunarodni programi',
        items: [
          '2021–2025. Bachelor grafičkog dizajna i multimedije — International Burch University, Sarajevo',
          '2024–2025. Erasmus+ studijska mobilnost — IDarte School of Art and Higher School of Design, Vitoria-Gasteiz, Španija',
          '2018. AFS program razmjene učenika — America Field Service (AFS), Bari, Italija · međunarodni program interkulturalnog učenja i razmjene',
          '2017–2021. Tehničar reklamne grafike — Srednja škola primijenjenih umjetnosti, Sarajevo',
          '2021–2022. Multimedijalna praksa — Centar za promociju civilnog društva (CPCD), Sarajevo · asistencija u kreiranju sadržaja, grafičkom dizajnu te video predprodukciji, produkciji i postprodukciji',
          '2023. Učesnik programa Schweizer Jugendfilmtag i Talent Campa — Švajcarski festival filma za mlade',
        ],
      },
      {
        title: 'Omladinski i društveni projekti',
        items: [
          'Erasmus+ omladinska razmjena „RESOLVE: Equity" — London, Ujedinjeno Kraljevstvo (juli 2022) · međunarodna razmjena posvećena jednakosti i društvenim temama',
          'Evropski korpus solidarnosti (ESC) — Zavod Manipura, Slovenija (juni–august 2021) · projekat „Vještine, osnaživanje i usmjeravanje mladih kroz volonterske aktivnosti u međunarodnim grupama"',
          'Trener za omladinske aktivnosti — Centar za izgradnju mira (CIM), Sanski Most (2020) · dijalog, debata, identitet, diskriminacija i izgradnja mira',
        ],
      },
      {
        title: 'Profesionalno multimedijalno iskustvo',
        items: [
          'Freelance novinar i kreator digitalnog sadržaja — Deutsche Welle (DW), Programi za Evropu (2022 – u toku) · kreiranje multimedijalnog sadržaja za društvene mreže i digitalne platforme',
          'Snimanje fotografija i videa, grafički dizajn, animacija, video montaža te video predprodukcija, produkcija i postprodukcija za sadržaje DW-a',
          'Učestvovanje u planiranju snimanja, komunikaciji sa sagovornicima i terenskoj realizaciji video-priča u Bosni i Hercegovini',
          'Objavljivanje, uređivanje i prilagođavanje sadržaja za Instagram profil DW Fokus, uz distribuciju sadržaja i na regionalnim DW Facebook i YouTube kanalima',
          'Učestvovanje na događajima Deutsche Wellea u Njemačkoj i zemljama zapadnog Balkana',
          'Samostalni freelance kreator sadržaja (2019 – u toku) · grafički dizajn, video i animacija, od razvoja ideje do finalne postprodukcije',
        ],
      },
      {
        title: 'Multimedijalna ostvarenja',
        items: [
          'Prvo mjesto za video „Prevencija rodno zasnovanog nasilja" — BH novinari i Medicus Mundi Mediterrània (2021)',
          'Prvo mjesto za kratki film „Moja porodica u izolaciji" — Omladinski filmski festival Zenica (2020)',
          'Prvo mjesto za kratki film „Moja porodica u izolaciji" — Centar kulture i mladih Sarajevo (2020)',
          'Pobjednik foto-konkursa „Most za budućnost" — Ambasada Švajcarske (2017)',
        ],
      },
    ],
  },

  'hamdo-solo': {
    name: 'Hamdo Solo',
    role: 'Urednik / Imam džemata Carina Vratnik',
    photo: '/tim/hamdo-solo.jpg',
    sections: [
      {
        title: 'O Hamdi',
        items: [
          'Stručni saradnik u nastavi kiraeta-korepetitor na Fakultetu islamskih nauka Univerziteta u Sarajevu.',
          'Diplomirao 2023. godine na Fakultetu islamskih nauka sa prosjekom 9,69.',
          'Magistarski rad „Metodologija upotrebe kiraetā u tefsiru al-Muḥarrar al-waǧīz Ibn ʿAṭiyye al-Andalūsija" odbranio 2025. godine.',
          'Student I godine doktorskog studija na Fakultetu islamskih nauka.',
          'Uže područje interesovanja: tedžvid i kiraeti (čitanja Kur\'ana).',
        ],
      },
      {
        title: 'Obrazovanje',
        items: [
          '2025– Doktorski studij, Fakultet islamskih nauka, Univerzitet u Sarajevu',
          '2023–2025. Postdiplomski magistarski studij (oblast: Kiraet) — FIN UNSA · Teza: Metodologija upotrebe kiraetā u tefsiru al-Muḥarrar al-waǧīz Ibn ʿAṭiyye al-Andalūsija',
          '2019–2023. Dodiplomski studij islamske teologije — FIN UNSA (prosjek 9,69)',
          '2015–2019. Behram-begova medresa, Tuzla',
        ],
      },
      {
        title: 'Radno iskustvo',
        items: [
          'Stručni saradnik u nastavi za Kiraet — FIN UNSA (2025 – u toku)',
          'Demonstrator — FIN UNSA (2022–2025)',
          'Student-prorektor — Univerzitet u Sarajevu (2024–2025)',
          'Honorarni imam (2022 – u toku)',
          'Muhafiz u Školi hifza (2022–2025)',
        ],
      },
      {
        title: 'Nastava',
        items: [
          'Kiraet I, Kiraet II, Kiraet III, Kiraet IV — prvi ciklus studija, FIN UNSA',
        ],
      },
      {
        title: 'Hutbe, predavanja i vazovi',
        items: [
          'Hutbe u džematu Carina na Vratniku — MIZ Sarajevo (2021 – u toku)',
          'Tefsir kur\'anskih sura — Centar za Kur\'an i Sunnet, MIZ Sarajevo (2023 – u toku)',
          'Sedmična predavanja četvrtkom — projekat Misbah EDU (2024 – u toku)',
        ],
      },
      {
        title: 'Stručno usavršavanje (izbor)',
        items: [
          'Tahqiq Course (Rukopisi) — ISAM Center for Islamic Studies, Istanbul (august 2025)',
          'Genocide denial: History, tactics, and response — Yale & UNSA (novembar 2025)',
          'Ljetni seminar u islamskim naukama — Hayrat Vakfi, Istanbul i Bursa (2024)',
          'Ljetni seminar u islamskim naukama — Hayrat Vakfi i Darul Irfan, Istanbul (2023)',
          'Primjena inovativnih metoda rada u univerzitetskoj nastavi — FIN UNSA (2023)',
          'Responsible AI in Research — Centar za istraživanje i razvoj (maj 2026)',
        ],
      },
      {
        title: 'Nagrade i priznanja (izbor)',
        items: [
          'Zlatna značka — Univerzitet u Sarajevu (decembar 2023)',
          '2. mjesto na Evropskom debatnom takmičenju na arapskom jeziku — Qatar Debate (oktobar 2023)',
          '3. mjesto na 28. Internacionalnom takmičenju učača Kur\'ana u Zagrebu (septembar 2022)',
          '3. mjesto na 27. Internacionalnom takmičenju učača Kur\'ana u Zagrebu (septembar 2021)',
          '2. mjesto na takmičenju učača Kur\'ana u Srbiji — 15 džuzova (novembar 2021)',
          'Učešće na Međunarodnom takmičenju hifz cijelog Kur\'ana u Kuvajtu (2022)',
          'Certifikat za engleski jezik C1 — Poliglot (august 2025)',
          'Diploma o položenom hifzu — Rijaset Islamske zajednice u BiH (maj 2017)',
        ],
      },
      {
        title: 'Objavljena djela',
        items: [
          'Kiraeti u tefsiru al-Muḥarrar al-waǧīz imama Ibn ʿAṭiyye — august 2025.',
          'Metodologija upotrebe kiraetā u tefsiru al-Muḥarrar al-waǧīz Ibn ʿAṭiyye al-Andalūsija — Zbornik radova IPF-a, august 2025.',
          'Članak u Zborniku radova FIN-a (u toku)',
        ],
      },
      {
        title: 'Medijski nastupi (izbor)',
        items: [
          'IslamEDU Podcast: „Lijep govor mijenja svijet" (2025)',
          'Televizija BIR: „Moj ramazan" s Mubinom Suljić Solo (2024)',
          'Hayat Media BiH: „Stil života u islamu" (2024)',
          'IslamEDU: „Muhammedovo, a.s., insistiranje na moralnom djelovanju" (2023)',
          'IslamEDU: „Muhammedovo, a.s., insistiranje na vrijednostima učenja i znanja" (2023)',
          'Hayat Media BiH: „Kur\'an – Uže spasa" (2022)',
          'Televizija 5 BiH: „Ekipa s FIN-a druga na Evropskom debatnom takmičenju" (2023)',
        ],
      },
    ],
  },
}
