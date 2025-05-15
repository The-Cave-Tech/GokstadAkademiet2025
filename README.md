#TheCaveTech

<details>
  <summary><strong>Kom i gang</strong></summary>

<strong>1.Oauth/ 3part SSO providere</strong>
<strong>Til testing:<strong>

-----Google-----
1.https://console.cloud.google.com/welcome
Trukk på >Select a project< og opprett et nytt prosjekt.

2.https://console.cloud.google.com/apis/credentials
Trukk på >Create credentials< og velg Oauth client ID:

Application type: Web Application
Navn: Valgfritt navn for klienten

Authorized redirect URIs (for testing):
URIs 1: http://localhost:3000/api/auth/callback/google
URIs 2: http://localhost:1337/api/connect/google/callback

Etter det er opprettet 
3.https://console.cloud.google.com/auth/branding

Her kan det konfigureres detaljene som vises på samtykkesiden (OAuth consent screen). Følgende lenker og innstillinger kan angis, men er ikke nødvendige for testing, mens de er påkrevd for deployment:

Informasjon til samtykkesiden, inkludert applikasjonsnavn, brukerstøtte-e-post og eventuell applikasjonslogo.

Applikasjonens personvernerklæring og bruksvilkår 

Autorisert domene som er tillatt å bruke i OAuth, inkludert domener for tilbakeredirigerings-URI-er (f.eks. domenenavn/api/auth/callback/google) og domener vist på samtykkesiden (f.eks. (https://www.thecavetech.org/)).


-----Facebook-----
1.https://developers.facebook.com/
For å opprette Oauth web
2.https://strapi.io/blog/learning-strapi-authentication-flows-with-the-facebook-provider
Siden applikasjonen ikke er deployet, kjørte jeg Ngrok for å opprette en midlertidig, offentlig tilgjengelig URL som tunneler til min lokale server (f.eks. `http://localhost:3000`). Dette lot meg å teste Facebook OAuth-autentisering lokalt ved å bruke Ngrok-URL-en i stedet for et deployet domene. For eksempel, hvis Ngrok gir meg URL-en `https://abc123.ngrok.io`, kan jeg konfigurere tilbakeredirigerings-URI-er som `https://abc123.ngrok.io/api/auth/callback/facebook` i Facebooks utviklerportal. Når applikasjonen deployes, må jeg oppdatere tilbakeredirigerings-URI-ene til å peke til produksjonsdomenet, for eksempel `domenenavn/api/auth/callback/facebook`.


------Microsoft------
Ikke testet, siden det koster penger, de har prøveperioden som de krever å skrive inn bankdetlajer

Implmentering jeg har gjort i koden skal være universell og skal fungere på microsfot og andre providere som det gjør for google og facebook.


--------Sette opp i Strapi------
1. Gå inn i Strapi Admin Panel
2. Innstillinger
3. Under Users & Permissons Plugin velg Providers
4. Velg Oauth providere 
5. Skriv inn Client ID og Client Secret som vi fikk fra forrige steps hos Google/Facebook
6. Skriv redirect URL til frontenden: 
Google: http://localhost:3000/api/auth/callback/google
Facebook: http://localhost:3000/api/auth/callback/facebook
7. The redirect URL to add in your microsoft application configurations står der automatisk


<details>
  <summary><strong>🖼️ Vis bilde</strong></summary>

  ![Skjermbilde](/ImagesForReadme/StrapiAddOauth.png)

</details>




Når det skal det deployes, må Authorized redirect URIs oppdateres i for å peke til de faktiske URL-ene i det deployede miljøet.




</details>

Oauth/ Auth provider:
Google:



Facebook:



Microsoft:


Email:
Akkurat nå det 


#Setup


#How pages work


#Universal components

#How to use strapi









\*Strapi AdminPanel-The main admin panel for content managing on site.

- Installer PostCSS Language Support vscode extension for å ungå unknown at rule i tailwind: kan enkelt aktiveres og deaktiveres ved visuelt farge bytte

\*Run

cd frontend: npm run dev
cd backend: npm run develop

npm run test - to run test


SendGrid:Unauthorised Error issue while using SendGrid Email API
https://help.twilio.com/articles/10284917001627

