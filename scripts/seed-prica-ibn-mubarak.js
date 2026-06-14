require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@libsql/client')

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const title = "Hadž siromašne udovice"

const content = `Bio je ʿAbdullāh ibn al-Mubārak pobožan čovjek. U godini kada je odlučio obaviti hadž, izašao je jedne noći da se oprosti sa svojim prijateljima prije putovanja. Na putu je ugledao prizor od kojeg su mu se tijelo i živci potresli.

U mraku je vidio ženu kako se saginje nad gomilom smeća i iz nje uzima mrtvu kokoš, stavlja je pod ruku i odlazi u tamu.

Pozvao ju je i rekao:
„O robkinjo Allahova, šta radiš? Ovo je mrtva kokoš!"

Ona mu odgovori:
„O ʿAbdullāh, ostavi stvorenja njihovom Stvoritelju, jer Allah ima Svoje odredbe među Svojim robovima."

Reče joj Ibn al-Mubārak:
„Zaklinjem te Allahom da mi kažeš svoju priču."

Ona odgovori:
„Kad si me već zakleo Allahom, reći ću ti."

Njene suze su progovorile prije riječi:
„Allah nam je dozvolio da jedemo strvinu (u nuždi). Ja sam siromašna udovica i majka četiriju djevojčica. Njihov staratelj je umro, stanje nam se pogoršalo, novac mi je nestao. Kucala sam na vrata ljudi, ali nisam našla milosti u njihovim srcima. Izašla sam da nađem večeru za svoje kćeri, čije su nutrine spaljene glađu, pa mi je Allah dao ovu strvinu. Zar ćeš me sada zbog toga koriti?"

Na to su oči Ibn al-Mubāraka zasuzile. Rekao joj je:
„Uzmi ovaj imetak," i dao joj sav novac koji je bio pripremio za hadž.

Majka siročadi ga je uzela, vratila se zahvalna svojoj djeci, a Ibn al-Mubārak se vratio kući i nije otišao na hadž.

Hodočasnici iz njegovog mjesta otišli su na hadž, obavili ga i vratili se. Svi su zahvaljivali Ibn al-Mubāraku na uslugama koje im je pružio tokom hadža. Govorili su:
„Allah ti se smilovao, o Ibn al-Mubārak! Nismo sjeli ni na jedno mjesto a da nas nisi podučio onome čemu te Allah naučio, niti smo vidjeli boljeg od tebe u ibadetu ove godine na hadžu."

Ibn al-Mubārak se začudio njihovim riječima i zbunio, jer nije napuštao svoje mjesto niti je išao s njima, ali nije želio otkriti svoju tajnu.

U snu je vidio čovjeka čije je lice sjalo svjetlom, koji mu reče:
„Selam alejke, o ʿAbdullāh! Znaš li ko sam ja? Ja sam Muhammed, Allahov Poslanik. Ja sam tvoj voljeni na dunjaluku i tvoj zagovornik na ahiretu. Neka te Allah nagradi za moj ummet.

O ʿAbdullāhu ibn al-Mubārak, Allah te je počastio kao što si ti počastio majku siročadi, i sakrio te kao što si ti zaštitio siročad. Allah je stvorio meleka u tvom liku koji je išao s ljudima tvoga mjesta kroz obrede hadža. Svakom hadžiji je upisana nagrada jednog hadža, a tebi je upisana nagrada sedamdeset hadževa."`

const author = "ʿAbdullāh ibn al-Mubārak"

async function main() {
  const now = new Date().toISOString()
  await client.execute({
    sql: `INSERT INTO "Prica" (title, content, author, imageUrl, published, createdAt, updatedAt)
          VALUES (?, ?, ?, NULL, 1, ?, ?)`,
    args: [title, content, author, now, now],
  })
  console.log('Priča uspješno dodana.')
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
