//Generert med https://app.freeprivacypolicy.com og må byttes ut med ekte ved deployment
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import PageIcons from "@/components/ui/custom/PageIcons";

export default function PersonvernPage() {
  return (
    <main className="py-12 bg-[#f9f9f9]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <CardHeader className="flex items-center gap-3 bg-primary p-6">
              <figure className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <PageIcons
                  name="lock"
                  directory="profileIcons"
                  size={24}
                  alt="Personvern"
                  className="text-typographyPrimaryWH"
                />
                <figcaption className="sr-only">Personvernsikon</figcaption>
              </figure>
              <div>
                <h1 className="text-section-title-small font-medium text-typographyPrimaryWH">
                  Personvernerklæring
                </h1>
                <p className="text-body-small text-typographyPrimaryWH opacity-90">
                  Sist oppdatert: 14. mai 2025
                </p>
              </div>
            </CardHeader>

            <CardBody className="p-8">
              <article className="prose max-w-none text-typographyPrimary">
                <p>
                  Denne personvernerklæringen beskriver våre retningslinjer og prosedyrer for innsamling, bruk og utlevering av din informasjon når du bruker tjenesten, og forteller deg om dine personvernrettigheter og hvordan loven beskytter deg.
                </p>
                
                <p>
                  Vi bruker dine personopplysninger for å levere og forbedre tjenesten. Ved å bruke tjenesten samtykker du til innsamling og bruk av informasjon i samsvar med denne personvernerklæringen.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Tolkning og definisjoner</h2>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Tolkning</h3>
                <p>
                  Ordene der første bokstav er stor, har betydninger som defineres under følgende forhold. Følgende definisjoner skal ha samme betydning uavhengig av om de vises i entall eller flertall.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Definisjoner</h3>
                <p>I denne personvernerklæringen gjelder følgende definisjoner:</p>
                
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>
                    <p><strong>Konto</strong> betyr en unik konto opprettet for deg for å få tilgang til vår tjeneste eller deler av vår tjeneste.</p>
                  </li>
                  <li>
                    <p><strong>Tilknyttet selskap</strong> betyr en enhet som kontrollerer, kontrolleres av eller er under felles kontroll med en part, der “kontroll” betyr eierskap av 50 % eller mer av aksjene, eierinteresser eller andre verdipapirer som gir rett til å stemme for valg av styremedlemmer eller annen ledende myndighet.</p>
                  </li>
                  <li>
                    <p><strong>Selskapet</strong> (referert til som enten “Selskapet”, “Vi”, “Oss” eller “Vår” i denne avtalen) refererer til The Cave Tech, Oslo.</p>
                  </li>
                  <li>
                    <p><strong>Informasjonskapsler (cookies)</strong> er små filer som plasseres på din datamaskin, mobilenhet eller annen enhet av et nettsted, og som inneholder detaljer om din nettleserhistorikk på det nettstedet blant flere bruksområder.</p>
                  </li>
                  <li>
                    <p><strong>Land</strong> refererer til: Norge</p>
                  </li>
                  <li>
                    <p><strong>Enhet</strong> betyr enhver enhet som kan få tilgang til tjenesten, som en datamaskin, en mobiltelefon eller et digitalt nettbrett.</p>
                  </li>
                  <li>
                    <p><strong>Personopplysninger</strong> er enhver informasjon som relaterer seg til en identifisert eller identifiserbar enkeltperson.</p>
                  </li>
                  <li>
                    <p><strong>Tjeneste</strong> refererer til nettstedet.</p>
                  </li>
                  <li>
                    <p><strong>Tjenesteleverandør</strong> betyr enhver fysisk eller juridisk person som behandler dataene på vegne av selskapet. Det refererer til tredjepartsselskaper eller enkeltpersoner som er ansatt av selskapet for å tilrettelegge tjenesten, levere tjenesten på vegne av selskapet, utføre tjenester relatert til tjenesten eller hjelpe selskapet med å analysere hvordan tjenesten brukes.</p>
                  </li>
                  <li>
                    <p><strong>Tredjeparts sosiale medier</strong> refererer til ethvert nettsted eller ethvert sosialt nettverkssted som en bruker kan logge inn på eller opprette en konto for å bruke tjenesten.</p>
                  </li>
                  <li>
                    <p><strong>Bruksdata</strong> refererer til data som samles inn automatisk, enten generert ved bruk av tjenesten eller fra tjenesteinfrastrukturen selv (for eksempel varigheten av et sidebesøk).</p>
                  </li>
                  <li>
                    <p><strong>Nettsted</strong> refererer til The Cave Tech, tilgjengelig fra <a href="https://www.thecavetech.org/" rel="external nofollow noopener" target="_blank" className="text-blue-600 hover:underline">https://www.thecavetech.org/</a></p>
                  </li>
                  <li>
                    <p><strong>Du</strong> betyr den enkeltpersonen som har tilgang til eller bruker tjenesten, eller selskapet, eller annen juridisk enhet som den personen har tilgang til eller bruker tjenesten på vegne av, hvis relevant.</p>
                  </li>
                </ul>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Innsamling og bruk av dine personopplysninger</h2>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Typer data som samles inn</h3>
                
                <h4 className="text-lg font-medium mt-5 mb-2">Personopplysninger</h4>
                <p>
                  Når du bruker vår tjeneste, kan vi be deg om å oppgi visse personlig identifiserbare opplysninger som kan brukes til å kontakte eller identifisere deg. Personlig identifiserbare opplysninger kan inkludere, men er ikke begrenset til:
                </p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>E-postadresse</li>
                  <li>Fornavn og etternavn</li>
                  <li>Telefonnummer</li>
                  <li>Adresse, fylke, postnummer, by</li>
                  <li>Bruksdata</li>
                </ul>
                
                <h4 className="text-lg font-medium mt-5 mb-2">Bruksdata</h4>
                <p>
                  Bruksdata samles inn automatisk når du bruker tjenesten.
                </p>
                <p>
                  Bruksdata kan inkludere informasjon som din enhets internettprotokolladresse (f.eks. IP-adresse), nettlesertype, nettleserversjon, sidene på vår tjeneste som du besøker, tid og dato for ditt besøk, tiden brukt på disse sidene, unike enhetsidentifikatorer og andre diagnostiske data.
                </p>
                <p>
                  Når du får tilgang til tjenesten via eller gjennom en mobilenhet, kan vi samle inn viss informasjon automatisk, inkludert, men ikke begrenset til, type mobilenhet du bruker, din mobile enhets unike ID, IP-adressen til din mobilenhet, ditt mobile operativsystem, type mobil internettleser du bruker, unike enhetsidentifikatorer og andre diagnostiske data.
                </p>
                <p>
                  Vi kan også samle informasjon som din nettleser sender når du besøker vår tjeneste eller når du får tilgang til tjenesten via eller gjennom en mobilenhet.
                </p>
                
                <h4 className="text-lg font-medium mt-5 mb-2">Informasjon fra tredjeparts sosiale medier</h4>
                <p>
                  Selskapet lar deg opprette en konto og logge inn for å bruke tjenesten gjennom følgende tredjeparts sosiale medier:
                </p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>Google</li>
                  <li>Facebook</li>
                  <li>Instagram</li>
                  <li>Twitter</li>
                  <li>LinkedIn</li>
                </ul>
                
                <p>
                  Hvis du bestemmer deg for å registrere deg gjennom eller på annen måte gi oss tilgang til en tredjeparts sosiale medier, kan vi samle inn personopplysninger som allerede er tilknyttet din konto for tredjeparts sosiale medier, som ditt navn, din e-postadresse, dine aktiviteter eller din kontaktliste tilknyttet den kontoen.
                </p>
                <p>
                  Du kan også ha mulighet til å dele ytterligere informasjon med selskapet gjennom din tredjeparts sosiale medier-konto. Hvis du velger å gi slik informasjon og personopplysninger, under registrering eller på annen måte, gir du selskapet tillatelse til å bruke, dele og lagre dem i samsvar med denne personvernerklæringen.
                </p>
                
                <h4 className="text-lg font-medium mt-5 mb-2">Sporingsteknologier og informasjonskapsler</h4>
                <p>
                  Vi bruker informasjonskapsler og lignende sporingsteknologier for å spore aktiviteten på vår tjeneste og lagre visse opplysninger. Sporingsteknologiene som brukes er beacons, tagger og skript for å samle og spore informasjon og for å forbedre og analysere vår tjeneste. Teknologiene vi bruker kan inkludere:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>
                    <strong>Informasjonskapsler eller nettlesercookies.</strong> En informasjonskapsel er en liten fil som plasseres på din enhet. Du kan instruere din nettleser til å avslå alle informasjonskapsler eller til å indikere når en informasjonskapsel sendes. Men hvis du ikke godtar informasjonskapsler, kan det hende du ikke kan bruke visse deler av vår tjeneste. Med mindre du har justert nettleserinnstillingene dine slik at de vil avvise informasjonskapsler, kan vår tjeneste bruke informasjonskapsler.
                  </li>
                  <li>
                    <strong>Web Beacons.</strong> Visse seksjoner av vår tjeneste og våre e-poster kan inneholde små elektroniske filer kjent som web beacons (også referert til som clear gifs, pixel tags og single-pixel gifs) som tillater selskapet å, for eksempel, telle brukere som har besøkt disse sidene eller åpnet en e-post og for annen relatert nettstatistikk (for eksempel registrere populariteten til en bestemt seksjon og verifisere system- og serverintegritet).
                  </li>
                </ul>
                <p>
                  Informasjonskapsler kan være “permanente” eller “midlertidige” informasjonskapsler. Permanente informasjonskapsler forblir på din personlige datamaskin eller mobilenhet når du går offline, mens midlertidige informasjonskapsler slettes så snart du lukker nettleseren din.
                </p>
                <p>
                  Vi bruker både midlertidige og permanente informasjonskapsler for følgende formål:
                </p>
                <ul className="list-disc pl-6 space-y-4 mb-4">
                  <li>
                    <p><strong>Nødvendige informasjonskapsler</strong></p>
                    <p>Type: Midlertidige informasjonskapsler</p>
                    <p>Administrert av: Oss</p>
                    <p>Formål: Disse informasjonskapslene er essensielle for å gi deg tjenester som er tilgjengelige gjennom nettstedet og for å gjøre det mulig for deg å bruke noen av dets funksjoner. De hjelper til med å autentisere brukere og forhindre svindel bruk av brukerkontoer. Uten disse informasjonskapslene kan tjenestene du har bedt om ikke leveres, og vi bruker bare disse informasjonskapslene for å gi deg disse tjenestene.</p>
                  </li>
                  <li>
                    <p><strong>Informasjonskapsel-policy / godkjenningsinformasjonskapsler</strong></p>
                    <p>Type: Permanente informasjonskapsler</p>
                    <p>Administrert av: Oss</p>
                    <p>Formål: Disse informasjonskapslene identifiserer om brukere har akseptert bruken av informasjonskapsler på nettstedet.</p>
                  </li>
                  <li>
                    <p><strong>Funksjonalitetsinformasjonskapsler</strong></p>
                    <p>Type: Permanente informasjonskapsler</p>
                    <p>Administrert av: Oss</p>
                    <p>Formål: Disse informasjonskapslene gjør at vi kan huske valg du gjør når du bruker nettstedet, som å huske dine påloggingsdetaljer eller språkpreferanser. Formålet med disse informasjonskapslene er å gi deg en mer personlig opplevelse og å unngå at du må legge inn preferansene dine på nytt hver gang du bruker nettstedet.</p>
                  </li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Bruk av dine personopplysninger</h3>
                <p>
                  Selskapet kan bruke personopplysninger for følgende formål:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>
                    <p><strong>For å levere og vedlikeholde vår tjeneste</strong>, inkludert å overvåke bruken av vår tjeneste.</p>
                  </li>
                  <li>
                    <p><strong>For å administrere din konto:</strong> å administrere din registrering som en bruker av tjenesten. Personopplysningene du oppgir kan gi deg tilgang til forskjellige funksjonaliteter av tjenesten som er tilgjengelige for deg som en registrert bruker.</p>
                  </li>
                  <li>
                    <p><strong>For utførelse av en kontrakt:</strong> utvikling, etterlevelse og gjennomføring av kjøpskontrakten for produkter, varer eller tjenester du har kjøpt eller av enhver annen kontrakt med oss gjennom tjenesten.</p>
                  </li>
                  <li>
                    <p><strong>For å kontakte deg:</strong> For å kontakte deg via e-post, telefonsamtaler, SMS eller andre tilsvarende former for elektronisk kommunikasjon, som en mobilapplikasjons push-varslinger angående oppdateringer eller informative kommunikasjoner relatert til funksjonaliteter, produkter eller kontraktsmessige tjenester, inkludert sikkerhetsoppdateringer, når det er nødvendig eller rimelig for deres implementering.</p>
                  </li>
                  <li>
                    <p><strong>For å gi deg</strong> nyheter, spesialtilbud og generell informasjon om andre varer, tjenester og arrangementer som vi tilbyr og som ligner på de du allerede har kjøpt eller forespurt om, med mindre du har valgt å ikke motta slik informasjon.</p>
                  </li>
                  <li>
                    <p><strong>For å behandle dine forespørsler:</strong> For å delta i og administrere dine forespørsler til oss.</p>
                  </li>
                  <li>
                    <p><strong>For forretningsoverføringer:</strong> Vi kan bruke din informasjon til å evaluere eller gjennomføre en fusjon, avhending, restrukturering, reorganisering, oppløsning eller annet salg eller overføring av noen eller alle våre eiendeler, enten som en pågående virksomhet eller som del av konkurs, likvidasjon eller lignende prosedyre, der personopplysninger som holdes av oss om våre tjenestebrukere er blant de overførte eiendelene.</p>
                  </li>
                  <li>
                    <p><strong>For andre formål</strong>: Vi kan bruke din informasjon til andre formål, som dataanalyse, identifisering av brukstrender, bestemmelse av effektiviteten av våre reklamekampanjer og for å evaluere og forbedre vår tjeneste, produkter, tjenester, markedsføring og din opplevelse.</p>
                  </li>
                </ul>
                
                <p>
                  Vi kan dele dine personopplysninger i følgende situasjoner:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Med tjenesteleverandører:</strong> Vi kan dele dine personopplysninger med tjenesteleverandører for å overvåke og analysere bruken av vår tjeneste, for å kontakte deg.</li>
                  <li><strong>For forretningsoverføringer:</strong> Vi kan dele eller overføre dine personopplysninger i forbindelse med, eller under forhandlinger om, fusjon, salg av selskapets eiendeler, finansiering eller oppkjøp av hele eller deler av vår virksomhet til et annet selskap.</li>
                  <li><strong>Med tilknyttede selskaper:</strong> Vi kan dele din informasjon med våre tilknyttede selskaper, i hvilket tilfelle vi vil kreve at disse tilknyttede selskapene respekterer denne personvernerklæringen. Tilknyttede selskaper inkluderer vårt morselskap og eventuelle andre datterselskaper, joint venture-partnere eller andre selskaper som vi kontrollerer eller som er under felles kontroll med oss.</li>
                  <li><strong>Med forretningspartnere:</strong> Vi kan dele din informasjon med våre forretningspartnere for å tilby deg visse produkter, tjenester eller kampanjer.</li>
                  <li><strong>Med andre brukere:</strong> når du deler personopplysninger eller på annen måte samhandler i de offentlige områdene med andre brukere, kan slik informasjon ses av alle brukere og kan distribueres offentlig utenfor. Hvis du samhandler med andre brukere eller registrerer deg gjennom en tredjeparts sosiale medier, kan dine kontakter på tredjeparts sosiale medier se ditt navn, profil, bilder og beskrivelse av din aktivitet. På samme måte vil andre brukere kunne se beskrivelser av din aktivitet, kommunisere med deg og se din profil.</li>
                  <li><strong>Med ditt samtykke</strong>: Vi kan utlevere dine personopplysninger til ethvert annet formål med ditt samtykke.</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Oppbevaring av dine personopplysninger</h3>
                <p>
                  Selskapet vil oppbevare dine personopplysninger bare så lenge det er nødvendig for formålene som er angitt i denne personvernerklæringen. Vi vil oppbevare og bruke dine personopplysninger i den grad det er nødvendig for å overholde våre juridiske forpliktelser (for eksempel hvis vi er pålagt å beholde dataene dine for å overholde gjeldende lover), løse tvister og håndheve våre juridiske avtaler og retningslinjer.
                </p>
                <p>
                  Selskapet vil også oppbevare bruksdata for interne analyseformål. Bruksdata oppbevares generelt i en kortere periode, unntatt når disse dataene brukes til å styrke sikkerheten eller for å forbedre funksjonaliteten til vår tjeneste, eller vi er juridisk forpliktet til å oppbevare disse dataene i lengre tidsperioder.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Overføring av dine personopplysninger</h3>
                <p>
                  Din informasjon, inkludert personopplysninger, behandles ved selskapets driftskontorer og på andre steder der partene involvert i behandlingen er lokalisert. Det betyr at denne informasjonen kan overføres til — og vedlikeholdes på — datamaskiner som befinner seg utenfor din stat, provins, land eller annen offentlig jurisdiksjon hvor databeskyttelseslovene kan være annerledes enn de i din jurisdiksjon.
                </p>
                <p>
                  Ditt samtykke til denne personvernerklæringen etterfulgt av din innsending av slik informasjon representerer ditt samtykke til den overføringen.
                </p>
                <p>
                  Selskapet vil ta alle rimelige skritt som er nødvendige for å sikre at dine data behandles sikkert og i samsvar med denne personver

nerklæringen, og ingen overføring av dine personopplysninger vil skje til en organisasjon eller et land med mindre det er tilstrekkelige kontroller på plass, inkludert sikkerheten av dine data og andre personopplysninger.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Slette dine personopplysninger</h3>
                <p>
                  Du har rett til å slette eller be om at vi hjelper til med å slette personopplysningene som vi har samlet inn om deg.
                </p>
                <p>
                  Vår tjeneste kan gi deg muligheten til å slette visse opplysninger om deg fra tjenesten.
                </p>
                <p>
                  Du kan oppdatere, endre eller slette informasjonen din når som helst ved å logge inn på din konto, hvis du har en, og besøke kontoadministrasjonsdelen som lar deg administrere dine personopplysninger. Du kan også kontakte oss for å be om tilgang til, korrigere eller slette personopplysninger du har gitt til oss.
                </p>
                <p>
                  Vær oppmerksom på at vi kan trenge å beholde visse opplysninger når vi har en juridisk forpliktelse eller lovlig grunnlag for det.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Utlevering av dine personopplysninger</h3>
                
                <h4 className="text-lg font-medium mt-5 mb-2">Forretningstransaksjoner</h4>
                <p>
                  Hvis selskapet er involvert i en fusjon, oppkjøp eller salg av eiendeler, kan dine personopplysninger overføres. Vi vil gi beskjed før dine personopplysninger overføres og blir underlagt en annen personvernerklæring.
                </p>
                
                <h4 className="text-lg font-medium mt-5 mb-2">Rettshåndhevelse</h4>
                <p>
                  Under visse omstendigheter kan selskapet være pålagt å utlevere dine personopplysninger hvis det kreves av lov eller som svar på gyldige forespørsler fra offentlige myndigheter (f.eks. en domstol eller et offentlig organ).
                </p>
                
                <h4 className="text-lg font-medium mt-5 mb-2">Andre juridiske krav</h4>
                <p>
                  Selskapet kan utlevere dine personopplysninger i den tro at slik handling er nødvendig for å:
                </p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>Overholde en juridisk forpliktelse</li>
                  <li>Beskytte og forsvare rettighetene eller eiendommen til selskapet</li>
                  <li>Forebygge eller undersøke mulig forseelse i forbindelse med tjenesten</li>
                  <li>Beskytte den personlige sikkerheten til brukere av tjenesten eller offentligheten</li>
                  <li>Beskytte mot juridisk ansvar</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Sikkerhet for dine personopplysninger</h3>
                <p>
                  Sikkerheten til dine personopplysninger er viktig for oss, men husk at ingen metode for overføring over internett eller metode for elektronisk lagring er 100 % sikker. Mens vi streber etter å bruke kommersielt akseptable midler for å beskytte dine personopplysninger, kan vi ikke garantere deres absolutte sikkerhet.
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Personvern for barn</h2>
                <p>
                  Vår tjeneste henvender seg ikke til personer under 13 år. Vi samler ikke bevisst inn personlig identifiserbar informasjon fra noen under 13 år. Hvis du er en forelder eller verge og du er klar over at ditt barn har gitt oss personopplysninger, vennligst kontakt oss. Hvis vi blir oppmerksomme på at vi har samlet inn personopplysninger fra noen under 13 år uten verifikasjon av foreldresamtykke, tar vi skritt for å fjerne den informasjonen fra våre servere.
                </p>
                <p>
                  Hvis vi trenger å stole på samtykke som rettslig grunnlag for behandling av informasjonen din og ditt land krever samtykke fra en forelder, kan vi kreve din forelders samtykke før vi samler inn og bruker den informasjonen.
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Lenker til andre nettsteder</h2>
                <p>
                  Vår tjeneste kan inneholde lenker til andre nettsteder som ikke drives av oss. Hvis du klikker på en tredjeparts lenke, vil du bli dirigert til den tredjeparts nettsted. Vi anbefaler sterkt at du gjennomgår personvernerklæringen til hvert nettsted du besøker.
                </p>
                <p>
                  Vi har ingen kontroll over og påtar oss intet ansvar for innholdet, personvernreglene eller praksisene til tredjeparts nettsteder eller tjenester.
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Endringer i denne personvernerklæringen</h2>
                <p>
                  Vi kan oppdatere vår personvernerklæring fra tid til annen. Vi vil varsle deg om eventuelle endringer ved å publisere den nye personvernerklæringen på denne siden.
                </p>
                <p>
                  Vi vil informere deg via e-post og/eller en fremtredende melding på vår tjeneste, før endringen trer i kraft og oppdatere “sist oppdatert” datoen øverst i denne personvernerklæringen.
                </p>
                <p>
                  Du rådes til å gjennomgå denne personvernerklæringen periodisk for eventuelle endringer. Endringer i denne personvernerklæringen er effektive når de publiseres på denne siden.
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Kontakt oss</h2>
                <p>
                  Hvis du har spørsmål om denne personvernerklæringen, kan du kontakte oss:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Ved å besøke denne siden på vårt nettsted: <a href="https://www.thecavetech.org/kontakt-oss" rel="external nofollow noopener" target="_blank" className="text-blue-600 hover:underline">https://www.thecavetech.org/kontakt-oss</a>
                  </li>
                </ul>

                <div className="mt-10 pt-6 border-t border-gray-200">
                  <Link href="/kontakt-oss" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                    <PageIcons name="email" directory="profileIcons" size={20} alt="" className="mr-2" />
                    Kontakt oss med spørsmål om personvern
                  </Link>
                </div>
              </article>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}