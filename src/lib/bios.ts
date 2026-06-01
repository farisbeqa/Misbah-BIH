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
}
