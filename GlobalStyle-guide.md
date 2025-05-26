Veiledning for tilpasning av profilsidens design
Denne guiden forklarer hvordan du kan endre farger, fonter, avstander og andre designelementer i appkikasjonen uten å måtte endre koden direkte.
Hvor finner du stilene?
Alle globale designinnstillinger er definert som CSS-variabler i :root i filen src/styles/global.css. Disse variablene brukes gjennom hele prosjektet for å sikre konsistent styling.

Eksmempel på hvordan stylen kan byttes ut.

Finn variabelen du vil endre, for eksempel:
--color-primary: #d5bdaf;/_ Header and dropdown menus _/

Bytt ut verdien for å endre fargen globalt:
--color-primary: #007bff; /_ Blå _/

responsivitet
Egne verdier er definert for ulike skjermstørrelser via media queries:
Desktop (over 1024px):
--landing-main-header: 60px;

Nettbrett (opptil 1024px):
--landing-main-header: 36px;

Mobil (opptil 639px):
--landing-main-header: 30px;

ønskes det å legge til flere font størrelse typer i fremtiden, legges de inn i global.css sin root som f.eks
:root{
/_ Desktop (over 1024px) about header _/
--about-main-header: 60px;

    @media (max-width: 1024px) {
    :root {
        --about-main-header: 36px;
    }


    @media (max-width: 639px) {
    :root {
        --about-main-header: 30px;
    }

}

så må du videre inn i tailwind.config.ts

theme: {
extend: {
fontSize: {
"about-main-header": "var(--about-main-header)",
},

      ønsker du da å bruke denne må du skrive text-about-main-header i classname for tekstelementet

Farger: Bruk hex-koder
Fonter: Bruk fontnavn tilgjengelig via Google Fonts eller systemfonter (f.eks. "Arial, sans-serif").
Avstander: Bruk CSS-enheter som rem, px, eller em (f.eks. 1rem, 16px).