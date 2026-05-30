// Run with: node prisma/seed.js
// Set DATABASE_URL first: set DATABASE_URL=file:./dev.db

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const videos = [
  // ─── YouTube (landscape) ─────────────────────────────────────────────────
  {
    title: 'Najveća deredža u Džennetu | hfz. Hamdo Solo',
    description: 'Kakva je najveća nagrada za vjernika u Džennetu? Kratki podcast isječak – hfz. Hamdo Solo.',
    url: 'https://www.youtube.com/shorts/8MrxV4MBWt0',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/8MrxV4MBWt0',
    thumbnailUrl: 'https://img.youtube.com/vi/8MrxV4MBWt0/hqdefault.jpg',
    isShortForm: true,
    published: true,
  },
  // ─── TikTok ───────────────────────────────────────────────────────────────
  {
    title: 'Šejtan napada s lijeve strane | hfz. Hamdo Solo',
    description: 'Na koji način šejtan napada čovjeka kroz strasti i uljepšavanje grijeha. Kratki isječak predavanja.',
    url: 'https://www.tiktok.com/@misbah_ba',
    platform: 'tiktok',
    embedUrl: 'https://www.tiktok.com/embed/v2/7636506823218023701',
    thumbnailUrl: null,
    isShortForm: true,
    published: true,
  },
  {
    title: 'Napad šejtana kroz dobra djela | hfz. Hamdo Solo',
    description: 'Šejtan napada i s desne strane – kroz samodopadljivost i oholost u dobrim djelima. Kratko predavanje.',
    url: 'https://www.tiktok.com/@misbah_ba',
    platform: 'tiktok',
    embedUrl: 'https://www.tiktok.com/embed/v2/7638383186577313045',
    thumbnailUrl: null,
    isShortForm: true,
    published: true,
  },
  // ─── Instagram ────────────────────────────────────────────────────────────
  {
    title: 'Napad šejtana s lijeve strane | hfz. Hamdo Solo',
    description: 'Predavanje o načinima na koje šejtan napada čovjeka kroz strasti i uljepšavanje grijeha.',
    url: 'https://www.instagram.com/reel/DY8D7UHo9tD/',
    platform: 'instagram',
    embedUrl: 'https://www.instagram.com/p/DY8D7UHo9tD/embed/',
    thumbnailUrl: null,
    isShortForm: true,
    published: true,
  },
  // ─── Facebook ─────────────────────────────────────────────────────────────
  {
    title: 'Napad šejtana s lijeve strane – kompletno predavanje | hfz. Hamdo Solo',
    description: 'Kompletan video sa predavanja o napadu šejtana kroz strasti i uljepšavanje grijeha.',
    url: 'https://www.facebook.com/share/r/1Dz8sGjdCW/',
    platform: 'facebook',
    embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fr%2F1Dz8sGjdCW%2F&show_text=false&width=560&autoplay=false',
    thumbnailUrl: null,
    isShortForm: false,
    published: true,
  },
  // ─── YouTube (dugi format) ────────────────────────────────────────────────
  {
    title: 'Sura Utješiteljica | hfz. Hamdo Solo',
    description: 'Učenje i tumačenje Sure Utješiteljice. Kompletno predavanje sa džamije Carina u Sarajevu.',
    url: 'https://www.youtube.com/watch?v=Aelrqpzz8y0',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/Aelrqpzz8y0',
    thumbnailUrl: 'https://img.youtube.com/vi/Aelrqpzz8y0/hqdefault.jpg',
    isShortForm: false,
    published: true,
  },
]

const blogs = [
  {
    title: 'Šejtan i njegovi napadi – kako se zaštititi',
    content: `Šejtan (Iblis) je neprijatelj čovječanstva od samog početka. Allah dž.š. nam je u Kur'anu jasno pojasnio da šejtan napada čovjeka s više strana – s desne i s lijeve, sprijeda i straga.

Hfz. Hamdo Solo u svom predavanju pojašnjava da šejtan napada s lijeve strane kroz strasti i uljepšavanje grijeha. Na taj način čovjek polako normalizira haram dok na kraju ne osjeti ni grižu savjesti.

S desne strane, šejtan napada kroz oholost u ibadetu. Kada čovjek radi dobra djela, šejtan mu šapuće: "Ti si bolji od ostalih. Ti si pobožniji." Ovaj napad je mnogo opasniji jer se krije iza ibadeta.

Zaštita od šejtana:
- Učiti Ajetul-kursiju svako jutro i veče
- Čitati tri sure (Ihlas, Felek, Nas) tri puta ujutro i uveče
- Tražiti utočište kod Allaha od prokletog šejtana
- Čuvati srce od oholosti i kibra

Neka nas Allah sačuva od napada šejtana i učvrsti naše imane.`,
    imageUrl: null,
    published: true,
  },
  {
    title: 'Važnost dove i tefekura u svakodnevnom životu',
    content: `Dova je suština ibadeta. Poslanik s.a.v.s. rekao je: "Dova je ibadet." Ko čini dovu, taj se obraća Allahu direktno, bez posrednika.

Tefekur (razmišljanje) je jedan od najvažnijih ibadeta koji mnogi vjernici zaboravljaju. Allah dž.š. poziva nas u više od 700 ajeta da razmišljamo, posmatramo i uzimamo pouku iz stvorenog.

Kako uvesti dovu u svakodnevni život:

1. Jutarnji i večernji zikr – počni dan s "Bismillah" i završi s "El-hamdu lillah"
2. Dova pri ulasku i izlasku iz kuće
3. Dova pri jelu i pijenju
4. Dova pri odlasku na spavanje – Ajetul-kursija

Svaki Muslim treba imati dnevnik dove u koji zapisuje šta od Allaha traži. Kad Allah uslišava dove, iman raste i čovjek postaje zahvalniji.

Neka nas Allah primi naše dove i učini nas od onih koji su zahvalni na Njegovim blagodatima.`,
    imageUrl: null,
    published: true,
  },
  {
    title: 'Ramazan – škola duha i trijumf volje',
    content: `Ramazan je najsvetiji mjesec u islamskom kalendaru. Allah dž.š. odabrao je ovaj mjesec za objavu Kur'ana i učinio ga posebnim na mnogo načina.

Zašto je post u Ramazanu toliko bitan?

Post nije samo suzdržavanje od hrane i pića. Post je potpuno suzdržavanje – od laži, ogovaranja, grešnih pogleda i loših misli. Poslanik s.a.v.s. rekao je: "Ko ne ostavi lažni govor i postupanje po njemu, Allah nema potrebe da on ostavlja hranu i piće."

Duhovne dobiti Ramazana:
- Šejtani su vezani – lakše je boriti se s nefsom
- Vrata Dženneta su otvorena, vrata Džehennema zatvorena
- Lejletu-l-kadr – noć vrijednija od hiljadu mjeseci
- Teravih namaz – poseban ibadet ovog месеца

Praktični savjeti za Ramazan:
1. Postavi cilj – koliko ćeš hatmi pročitati?
2. Smanjuje noćno spavanje i povećaj kijamul-lejl
3. Daj sadaku svaki dan, pa makar malo
4. Popravi odnose s komšijama i rodbinom

Ramazan je prilika za novi početak. Neka nam Allah pomogne da ga iskoristimo na najbolji mogući način.`,
    imageUrl: null,
    published: true,
  },
  {
    title: 'Ko je hafiz i zašto je hifz poseban ibadet',
    content: `Hafiz je onaj ko je cijeli Kur'an pohranio u svom srcu. Ova titula nosi ogromnu čast u islamu – kako za samog hafiza, tako i za njegovu porodicu.

Poslanik s.a.v.s. rekao je: "Nosiocu Kur'ana biće rečeno na Sudnjem danu: Čitaj i uspinjaj se, i tartilom uči kao što si u dunjaluku tartilom učio, jer tvoje mjesto je kod posljednjeg ajeta koji budeš čitao."

Putevi do hifza:

Hafizluk nije rezerviran samo za djecu. Postoje primjeri ljudi koji su počeli učiti Kur'an napamet u zrelim godinama i uspjeli u tome. Ono što je potrebno je:

- Iskrena nijjet (namjera) radi Allaha
- Dnevna rutina učenja (minimum 1-2 stranice)
- Muraja'a (ponavljanje naučenog)
- Strpljenje i ustrajnost

Posebnost hafiza: Hafiz je garancija za 10 članova porodice – može ih zagovarati na Sudnjem danu. Roditelji hafiza dobiće krune od nura na Sudnjem danu.

Neka Allah olakša svim onima koji nose Njegovu Knjigu u srcima i učini ih od onih koji je žive i primjenjuju.`,
    imageUrl: null,
    published: true,
  },
  {
    title: 'Lijep govor – mostovi između srca',
    content: `"Lijep govor mijenja svijet" – ova kratka rečenica nosi ogromnu istinu. Islam posebno naglašava važnost lijepog govora jer je jezik jedan od najvećih blagodati ali i najvećih fitneta.

Allah dž.š. kaže u Kur'anu: "I reci Mojim robovima da govore samo lijepe riječi, jer šejtan unosi razdor između njih."

Efendija Hamdo Solo u svojoj khutbi ističe da dobar govor ima tri karakteristike:
1. Istinit je – ne sadrži laž ni pretjerivanje
2. Koristan je – donosi dobrobit slušaču
3. Blag je – izrečen s poštovanjem, bez grubosti

Primjeri lijepog govora u svakodnevici:
- Pozdraviti komšiju s osmijehom
- Zahvaliti se osobi koja ti je pomogla
- Utješiti brata/sestru u nevolji
- Izgovoriti "džazakallahu hajren" umjesto samo "hvala"

Nauka danas potvrđuje ono što nam je Poslanik s.a.v.s. poučio prije 1400 godina: Pozitivne riječi smanjuju stres, jačaju imunitet i grade zdrave veze između ljude.

Neka nas Allah uvede u grupu onih čiji je govor ukrašen istinom, blagošću i dobrim namjerama.`,
    imageUrl: null,
    published: true,
  },
]

async function main() {
  console.log('Seeding database...')

  // Remove test upload entry if exists
  await prisma.video.deleteMany({ where: { platform: 'upload' } })

  // Skip videos already in DB (by URL)
  const existingUrls = (await prisma.video.findMany({ select: { url: true } })).map(v => v.url)

  let videoCount = 0
  for (const v of videos) {
    if (existingUrls.includes(v.url)) {
      console.log(`Skipping existing video: ${v.title}`)
      continue
    }
    await prisma.video.create({ data: v })
    console.log(`Added video: ${v.title}`)
    videoCount++
  }

  // Add blog posts
  let blogCount = 0
  for (const b of blogs) {
    await prisma.blogPost.create({ data: b })
    console.log(`Added blog: ${b.title}`)
    blogCount++
  }

  console.log(`\nDone! Added ${videoCount} videos and ${blogCount} blog posts.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
