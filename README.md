#TheCaveTech

<details>
  <summary><strong>Kom i gang</strong></summary>

<strong>1.Oauth/ 3part SSO providere</strong>
For testing:

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

Her kan det skrives inn linkene, men ikke nødvending for testing/ nødvendig for deployment:
-til samtykkeside, 
-applikasjons personvernerklæring og bruksvilkår,
-domener som er tillatt å bruke i OAuth, inkludert tilbakeredirigerings-URI-er og domener vist på samtykkesiden.




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

