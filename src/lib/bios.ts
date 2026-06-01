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
