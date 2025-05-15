# TheCaveTech

<details>
  <summary><strong>🚀 Kom i gang</strong></summary>

### 🔐 1. OAuth / 3rd-party SSO providere  
**Til testing:**

---

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

