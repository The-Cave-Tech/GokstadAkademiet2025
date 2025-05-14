//Generert med Ai og må byttes med riktig innhold
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import PageIcons from "@/components/ui/custom/PageIcons";

export default function BruksvilkarPage() {
  return (
    <main className="py-12 bg-[#f9f9f9]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <CardHeader className="flex items-center gap-3 bg-primary p-6">
              <div>
                <h1 className="text-section-title-small font-medium text-typographyPrimaryWH">
                  Bruksvilkår
                </h1>
                <p className="text-body-small text-typographyPrimaryWH opacity-90">
                  Sist oppdatert: 14. mai 2025
                </p>
              </div>
            </CardHeader>

            <CardBody className="p-8">
              <article className="prose max-w-none text-typographyPrimary">
                <p className="lead text-lg font-medium mb-6">
                  Velkommen til The Cave Tech. Ved å bruke vår nettside og tjenester godtar du disse bruksvilkårene.
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-3">1. Aksept av vilkår</h2>
                <p>
                  Ved å besøke nettstedet vårt, registrere en konto eller bruke våre tjenester, aksepterer du å være bundet av disse bruksvilkårene og vår personvernerklæring. Hvis du ikke godtar disse vilkårene, ber vi deg om ikke å bruke tjenestene våre.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">2. Brukerkonto</h2>
                <p>
                  For å få tilgang til visse funksjoner på nettstedet vårt, må du registrere en konto. Du er ansvarlig for å holde kontoopplysningene dine oppdaterte og sikre passordet ditt. Du må ikke dele kontoinformasjonen din med andre eller tillate andre å bruke kontoen din. Du er ansvarlig for all aktivitet som skjer under din konto.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">3. Akseptabel bruk</h2>
                <p>
                  Du godtar å bruke våre tjenester bare til lovlige formål og på en måte som ikke krenker andres rettigheter eller begrenser andres bruk av tjenestene. Forbudt atferd inkluderer, men er ikke begrenset til:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Publisering av støtende, krenkende eller ulovlig innhold</li>
                  <li>Forsøk på å få uautorisert tilgang til våre systemer eller brukerkontoer</li>
                  <li>Spredning av skadelig programvare eller utførelse av aktiviteter som kan skade nettstedet</li>
                  <li>Innsamling av brukerdata uten uttrykkelig tillatelse</li>
                  <li>Bruk av tjenestene til kommersielle formål uten vårt samtykke</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">4. Innhold og immaterielle rettigheter</h2>
                <p>
                  Alt innhold som publiseres av The Cave Tech er beskyttet av opphavsrett og andre immaterielle rettigheter. Du kan ikke kopiere, modifisere, distribuere eller på annen måte bruke innholdet uten vårt uttrykkelige samtykke. For innhold du selv publiserer på plattformen, beholder du dine rettigheter, men gir oss en ikke-eksklusiv lisens til å bruke, vise og distribuere innholdet i forbindelse med våre tjenester.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">5. Prosjekter og arrangementer</h2>
                <p>
                  Når du deltar i prosjekter eller arrangementer gjennom The Cave Tech, godtar du å følge eventuelle spesifikke regler for disse aktivitetene. Vi forbeholder oss retten til å nekte deltakelse eller fjerne personer fra aktiviteter hvis de ikke overholder disse reglene.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">6. Nettbutikk og betalinger</h2>
                <p>
                  Kjøp gjennom vår nettbutikk er underlagt disse vilkårene samt eventuelle spesifikke betingelser som vises i kjøpsprosessen. Priser er oppgitt i norske kroner og inkluderer merverdiavgift. Vi forbeholder oss retten til å endre priser og tilgjengelighet av produkter uten varsel. Betalingsinformasjon behandles sikkert gjennom våre betalingspartnere.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">7. Ansvarsfraskrivelse</h2>
                <p>
  Tjenestene våre tilbys “som de er” og “som tilgjengelig”. Vi gir ingen garantier, verken uttrykkelige eller underforståtte, om tjenestenes nøyaktighet, pålitelighet eller egnethet for bestemte formål. Vi er ikke ansvarlige for eventuelle tap eller skader som oppstår som følge av din bruk av våre tjenester.
</p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">8. Ansvarsbegrensning</h2>
                <p>
                  I den grad loven tillater det, skal The Cave Tech ikke være ansvarlig for indirekte, tilfeldige, spesielle, følge- eller straffeskader, inkludert, men ikke begrenset til, tapt fortjeneste, data eller bruk, uavhengig av årsak eller ansvarsgrunnlag.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">9. Endringer i tjenestene og vilkårene</h2>
                <p>
                  Vi forbeholder oss retten til når som helst å endre eller avbryte tjenestene våre, midlertidig eller permanent, med eller uten forvarsel. Vi kan også oppdatere disse bruksvilkårene fra tid til annen. Vesentlige endringer vil bli varslet gjennom nettstedet eller via e-post til registrerte brukere. Din fortsatte bruk av tjenestene etter slike endringer utgjør din aksept av de reviderte vilkårene.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-3">10. Gjeldende lov</h2>
                <p>
                  Disse vilkårene skal styres av og tolkes i samsvar med norsk lov. Eventuelle tvister som oppstår i forbindelse med disse vilkårene eller din bruk av tjenestene skal være underlagt de norske domstolenes eksklusive jurisdiksjon.
                </p>

                <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between">
                  <Link href="/personvern" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                    <PageIcons name="lock" directory="profileIcons" size={20} alt="" className="mr-2" />
                    Personvernerklæring
                  </Link>
                  
                  <Link href="/kontakt-oss" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                    <PageIcons name="email" directory="profileIcons" size={20} alt="" className="mr-2" />
                    Kontakt oss
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