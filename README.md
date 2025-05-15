# TheCaveTech

<details>
  <summary><strong>🚀 Kom i gang</strong></summary>

Hele setup er laget med tanke på testing og ikke deployment, siden bedriften ønsket å deploye selv

<details>
<summary><strong>
🔐 1.Oppsett av OAuth / 3rd-party SSO providere </br> 
**For testing:**
</strong></summary>

#### ✅ Google

1. Gå til: [https://console.cloud.google.com/welcome](https://console.cloud.google.com/welcome)  
   Klikk på **Select a project** og opprett et nytt prosjekt.

2. Gå til: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)  
   Klikk på **Create credentials** → Velg **OAuth client ID**

   - **Application type:** Web Application  
   - **Navn:** Valgfritt navn for klienten  
   - **Authorized redirect URIs (for testing):**
     - `http://localhost:3000/api/auth/callback/google`
     - `http://localhost:1337/api/connect/google/callback`

3. Gå til: [https://console.cloud.google.com/auth/branding](https://console.cloud.google.com/auth/branding)  
   Her kan du konfigurere samtykkesiden (**OAuth consent screen**).  
   Følgende er **ikke nødvendig for testing**, men **kreves ved deployment**:

   - Applikasjonsnavn  
   - Brukerstøtte-e-post  
   - Applikasjonslogo (valgfritt)  
   - Personvernerklæring og bruksvilkår  
   - Autoriserte domener som:
     - `https://www.thecavetech.org`
     - Domenenavn brukt i redirect URIs

---

#### ✅ Facebook

1. Gå til: [https://developers.facebook.com/](https://developers.facebook.com/)  
   Opprett en ny app for OAuth.

2. Følg guiden:  
   [Learning Strapi Authentication Flows with the Facebook Provider](https://strapi.io/blog/learning-strapi-authentication-flows-with-the-facebook-provider)

3. **Testing lokalt med Ngrok:**  
   - Kjør `ngrok http 3000` for å generere en offentlig URL.  
   - Bruk denne som redirect URI i Facebook Developer Portal, f.eks:  
     `https://abc123.ngrok.io/api/auth/callback/facebook`  
   - Ved deployment, bytt ut med produksjons-URL:  
     `https://dittdomene.no/api/auth/callback/facebook`

---

#### ⚠️ Microsoft

- **Ikke testet**, da det krever bankkort for prøveperiode.  
- Koden er implementert **universelt** og bør fungere med Microsoft og andre providere som Google og Facebook.

---

### ⚙️ Konfigurasjon i Strapi

1. Gå til **Strapi Admin Panel**
2. Gå til **Innstillinger**
3. Under **Users & Permissions Plugin**, velg **Providers**
4. Velg ønsket OAuth-provider
5. Fyll inn:
   - **Client ID** og **Client Secret** fra tidligere steg (Google/Facebook)
6. Legg til følgende redirect URLs:

   - Google: `http://localhost:3000/api/auth/callback/google`  
   - Facebook: `http://localhost:3000/api/auth/callback/facebook`

7. For Microsoft: Redirect URL genereres automatisk i Strapi

<details>
  <summary><strong>🖼️ Vis bilde</strong></summary>

  ![Skjermbilde](/ImagesForReadme/StrapiAddOauth.png)

  > 🔄 Husk å oppdatere **Authorized redirect URIs** når applikasjonen deployes, slik at de peker til riktig produksjons-URL.

</details>
</details>


<details>
<summary><strong>
🔐 2.Oppsett av Sendgrid </br> 
**For testing:**
</strong></summary>
1. Enable emain on strapi adminpanel
Settings --> Users & persmissons Plugin --> Providers --> Email --> Enable > True -->Save

2. Logg/registrer inn i https://app.sendgrid.com/
3. Create new sender
4. Verifiser email
5. Gå i setting api og lag nøkkel
3. Etter oppsettet i nettsiden lagre api nøkkel i 
.env i 
   SENDGRID_API_KEY=
   Skal være samme som ble skrevet når det ble opprettet det i punkt 3
   DEFAULT_FROM_EMAIL=
   DEFAULT_REPLY_TO_EMAIL=

#SendGrid:Unauthorised Error issue while using SendGrid Email API
https://help.twilio.com/articles/10284917001627
</details>

<details>
<summary><strong>
 3.Instalasjon
</strong></summary>

I både frontend og backend har filer som heter .env.example </br>
0. Lag .env filer både i front og backend og kopier innhholdet fra .env.exaple i .env.

<strong>Backend:</strong> </br>
1. I prosjektes root mappe ligger den i zippa databasefil. 
Unzip den </br>
2. Start MySQL Workbench </br>
3. Gå inn root conection i workbench -> Administration -> Users and Privileges -> Add Account -> 
skriv in DATABASE_USERNAME og DATABASE_PASSWORD= som du har i .env filen i backend mappe </br>
4. I administrative roles velg alt og trukk på apply. </br>
5. Gå til Mysql connections og lag en connection med brukeren navnet/DATABASE_USERNAME i step 3 </br>
6. Gå inn i connection som nettop ble opprettet. </br>
7. Finn frem og trukk på server fra fanen og velg Data </br> 
8. Velg Import from Self-contained og legg til filen fra step 1. </br>
9. I Default Schema to be Imported To velg new og skriv DATABASE_NAME= som du skrev i .env </br>
10. Velg den Schema fra Default Target Schema og trukk på start Import. </br>
11. Refresh Schemas, og Query skriv USE databesenavn fra .env </br>

Gå inn i terminalen i koden og skriv, </br>
12. cd backend </br>
13. npm i </br>
14. Skriv inn url fra terminalen eller hvis du bruker .env filen vår: http://localhost:1337/ </br>
15. Hvis du har brukt vår database filen og får mulighet å lage egen bruker og passord, bruk </br>
Email: test@den.no </br>
Passord: Gokstad1234 </br>






Frontend:
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_STRAPI_STORE_URL=http://localhost:1337

</details>


</details>





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




