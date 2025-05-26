# TheCaveTech

## Om dette prosjektet
Denne webapplikasjonen er utviklet for et makerspace, hvor organisasjonen The Cave Tech viser frem prosjektene og produktene sine til et lukket miljø bestående av venner og bekjente. Plattformen brukes til å arrangere arrangementer, dele faglig innhold gjennom en blogg, samt selge sine produkter via en nettbutikk for å generere ekstra inntekter. Prosjektet er publisert som åpen kildekode og kan fungere som en universell plattform som enkelt kan skaleres til andre formål.

### Teknologi og funksjonalitet
Applikasjonen er bygget med Next.js, TypeScript og Tailwind CSS, og bruker Strapi som headless CMS og REST API for backend-funksjonalitet. Innhold administreres gjennom Strapi sitt adminpanel, hvor databaserelasjoner opprettes automatisk ved tilføyelse av innhold. Webapplikasjonen inkluderer et eget dashboard der medlemmer av The Cave Tech kan administrere prosjekter, arrangementer og blogginnlegg. Strapi-adminpanelet brukes primært til å håndtere produkter i nettbutikken, administrere innhold og utvikle ny funksjonalitet.


#### Rolletilgang
Administratorer har full kontroll i Strapi og kan administrere prosjekter, arrangementer, blogginnlegg og brukerinformasjon. Autentisering skjer via lokal eller tredjeparts pålogging. Vanlige brukere kan også bidra med blogginnlegg.

##### Status
Plattformen har foreløpig ikke et fullverdig CRM-system, men alle kontaktmeldinger og brukerdata lagres i databasen og er tilgjengelige via Strapi sitt administrasjonspanel. Kjøpshistorikk er delvis implementert. Betalingsløsningen er for øyeblikket hardkodet og krever videre utvikling. I det interne administrasjonspanelet mangler det støtte for arkivering, og bruken av WYSIWYG-editor mot Strapi er utfordrende grunnet formateringsforskjeller – dette krever også videreutvikling. Blogg skal være koblet opp mot en bruker, denne delen er ikke implementert. For nå så kan bare admin legge til blogg innlegg via Strapi og eget panel - videreutviklingen her skal også være en legg til knapp på blogg siden som bruker ContentForm komponenten for å få tilgang til universalt skjema for content.

##### Tech Stack
Frontend: Next.js, TypeScript, Tailwind CSS  
Backend: Strapi (Headless CMS)  
Database: Compatible with Strapi (MySQL)

1. Beskrive prosjektet ok
2. Installasjon ok
3. Strapi guide ok
4. Nettside guide -tilpasse
5. Kode guide/ hvordan bruke universelle komponenter 
eksemp. PageIcons- hvordan bruke page icons
6. Hva som gjenstår (Known issues)

<details><summary><strong>🚀 Getting Started / How to install</strong></summary>
<br>
This setup is designed for testing purposes only, as the company prefers to handle deployment themselves.<br><br>

<details>
<summary>
1. Installation
</summary>

<br/>
Both frontend and backend have `.env.example` files.  
0. Create `.env` files in both frontend and backend folders and copy the contents from `.env.example` into `.env`.

# The database file contains only data, not images.

# <strong>Backend:</strong>

1. In the project root, you'll find a zipped database file.  
  Unzip it.
2. Start MySQL Workbench
3. Go to your root connection in Workbench → Administration → Users and Privileges → Add Account →  
  Enter `DATABASE_USERNAME` and `DATABASE_PASSWORD` as specified in your backend `.env` file
4. In Administrative Roles, select all and click Apply
5. Go to MySQL Connections and create a connection with the username from step 3
6. Enter the connection you just created
7. From the menu, select Server → Data Import
8. Choose "Import from Self-contained File" and select the file from step 1
9. For "Default Schema to be Imported To", choose "New" and enter `DATABASE_NAME` as in your `.env`
10. Select the schema from "Default Target Schema" and click Start Import
11. Refresh Schemas, and in Query, write `USE "database_name_from_env"` (e.g., `USE thecavetech`)

# <strong>Frontend:</strong>

Here, you just need to copy the contents from .env.example into .env.

After setting up `.env` in the root folder (where `.env.example` is):

**Run:**

#Backend
In your terminal:  
12. `cd backend`  
13. `npm i`  
14. `npm run develop`  
15. Navigate to the backend URL specified in your frontend `.env`  
16. If using our database file and prompted to create a user, use:

- Email: test@den.no
- Password: Gokstad1234

# OR

admin@admin.no  
Admin1234  

#Frontend

In the terminal:

1. `cd frontend`
2. `npm i`
3. `npm run dev`
4. Navigate to the frontend URL specified in your `.env`

**Testing:**

1. `cd frontend`
2. `npm run test` to run tests

</details>
<details>
<summary>
🔐 2. Setting up OAuth / 3rd-party SSO Providers <br>
For testing:
</summary>

# After npm run

#### ✅ Google

1. Go to: [https://console.cloud.google.com/welcome](https://console.cloud.google.com/welcome)  
  Click **Select a project** and create a new project.

2. Go to: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)  
  Click **Create credentials** → Select **OAuth client ID**

  - **Application type:** Web Application
  - **Name:** Any name for your client
  - **Authorized redirect URIs (for testing):**
    - `http://localhost:3000/api/auth/callback/google`
    - `http://localhost:1337/api/connect/google/callback`

3. Go to: [https://console.cloud.google.com/auth/branding](https://console.cloud.google.com/auth/branding)  
  Here you can configure the **OAuth consent screen**.  
  The following is **not required for testing**, but **mandatory for deployment**:

  - Application name
  - Support email
  - Application logo (optional)
  - Privacy policy and terms of service
  - Authorized domains such as:
    - `https://www.thecavetech.org`
    - Domains used in redirect URIs

---

#### ✅ Facebook

1. Go to: [https://developers.facebook.com/](https://developers.facebook.com/)  
  Create a new app for OAuth.

2. Follow the guide:  
  [Learning Strapi Authentication Flows with the Facebook Provider](https://strapi.io/blog/learning-strapi-authentication-flows-with-the-facebook-provider)

3. **Testing locally with Ngrok:**
  - Run `ngrok http 3000` to generate a public URL.
  - Use this as the redirect URI in the Facebook Developer Portal, e.g.:  
    `https://abc123.ngrok.io/api/auth/callback/facebook`
  - For deployment, replace with your production URL:  
    `https://yourdomain.com/api/auth/callback/facebook`

---

#### ⚠️ Microsoft

- **Not tested**, as it requires a credit card for the trial period.
- The code is implemented **universally** and should work with Microsoft and other providers like Google and Facebook.

---

### ⚙️ Configuration in Strapi

1. Go to the **Strapi Admin Panel**
2. Navigate to **Settings**
3. Under **Users & Permissions Plugin**, select **Providers**
4. Choose your desired OAuth provider
5. Enter:
  - **Client ID** and **Client Secret** from previous steps (Google/Facebook)
6. Add the following redirect URLs:

  - Google: `http://localhost:3000/api/auth/callback/google`
  - Facebook: `http://localhost:3000/api/auth/callback/facebook`

7. For Microsoft: The redirect URL is generated automatically in Strapi

<details>
   <summary><strong>🖼️ Show Image</strong></summary>

   ![Screenshot](/ImagesForReadme/StrapiAddOauth.png)

   > 🔄 Remember to update **Authorized redirect URIs** when deploying the application so they point to the correct production URL.

</details>
</details>

<details>
<summary>
🔐 3. Setting up SendGrid <br>
For testing:
</summary>

1. Enable email in the Strapi admin panel:  
  Settings → Users & Permissions Plugin → Providers → Email → Enable > True → Save

2. Log in or register at https://app.sendgrid.com/
3. Create a new sender
4. Verify your email
5. Go to API settings and create an API key
6. After setup, save the API key in your `.env` file:
  ```
  SENDGRID_API_KEY=
  DEFAULT_FROM_EMAIL=
  DEFAULT_REPLY_TO_EMAIL=
  ```
  Use the same values as when you created the sender.

**SendGrid: Unauthorized Error issue while using SendGrid Email API**  
[Help Article](https://help.twilio.com/articles/10284917001627)

</details>

</details>

<details><summary><strong>How to</strong></summary>
<br>
<details><summary><strong>Change Global style</strong></summary>

<!-- Desktop (over 1024px) about header -->
--about-main-header: 60px;

### Veiledning for tilpasning av profilsidens design

Denne guiden forklarer hvordan du kan endre farger, fonter, avstander og andre designelementer i appkikasjonen uten å måtte endre koden direkte.

#### Hvor finner du stilene?
Alle globale designinnstillinger er definert som CSS-variabler i :root i filen `src/styles/global.css`. Disse variablene brukes gjennom hele prosjektet for å sikre konsistent styling.

#### Eksmempel på hvordan stylen kan byttes ut

Finn variabelen du vil endre, for eksempel:
```css
--color-primary: #d5bdaf; /* Header and dropdown menus */
```

Bytt ut verdien for å endre fargen globalt:
```css
--color-primary: #007bff; /* Blå */
```

#### Responsivitet
Egne verdier er definert for ulike skjermstørrelser via media queries:

Desktop (over 1024px):
```css
--landing-main-header: 60px;
```

Nettbrett (opptil 1024px):
```css
--landing-main-header: 36px;
```

Mobil (opptil 639px):
```css
--landing-main-header: 30px;
```

Mediaqueries eksempel:
```css
@media (max-width: 1024px) {
   :root {
      --about-main-header: 36px;
   }
}

@media (max-width: 639px) {
<br/> {
      --about-main-header: 30px;
   }
}
```

Videre må du inn i `tailwind.config.ts`:
```ts
theme: {
   extend: {
      fontSize: {
        "about-main-header": "var(--about-main-header)",
      },
   }
}
```

For å bruke denne størrelsen, skriv `text-about-main-header` i classname for tekstelementet.

#### Verdier
- Farger: Bruk hex-koder
- Fonter: Bruk fontnavn tilgjengelig via Google Fonts eller systemfonter (f.eks. "Arial, sans-serif")
- Avstander: Bruk CSS-enheter som rem, px, eller em (f.eks. 1rem, 16px)

</details>

<details><summary><strong>🔑 To change JWT Token Expiry/ how long JWT tokens are valid:</strong></summary>

- **backend/config/plugins.ts**

  - Find: `expiresIn: "7h"`
  - Change `"7h"` to your desired duration (e.g., `"24h"` for 24 hours).

- **lib/util/cookie.ts**
  - Find: `const maxAge = 7 * 60 * 60;`
  - Change `7` to the number of hours you want (e.g., `24 * 60 * 60` for 24 hours).

</details>

<details><summary><strong>✉️ Email Configuration & Templates</strong></summary>

## 1. Environment Variables

- Set email-related variables in your backend `.env` file.
![Screenshot](/ImagesForReadme/EmailEnv.png)

## 2. Plugin Configuration

- **backend/config/plugins.ts**
  - Configure your email provider and settings here.

## 3. Email Service & Templates

- **backend/src/service/**
  - All email logic, templates, and text changes are handled here.
  - To update email content or templates, edit the relevant files in this folder.

---

**Tip:**  
For custom email text and templates, always update files in `backend/src/service` to match your requirements.
</details>

<details><summary><strong>Reusable universal components</strong></summary>
<details><summary><strong>PageIcons</strong></summary>

`PageIcons`-komponenten brukes til å hente og vise SVG-ikoner fra `public/`-mappen der det er behov for det i prosjektet.  
📁 Plassering i prosjektet: `//frontend/src/components/ui/custom/PageIcons.tsx`  

- Dersom ikonet ikke lastes inn, vises en fallback med teksten **"Icon not available"**.  
- `alt`-teksten er viktig for tilgjengelighet (skjermlesere). Hvis `isDecorative` er satt til `true`, utelates `alt`.  
- SVG-filen må ligge i `public/[directory]/`-mappen.

### Eksempel på bruk:
1. **Importer komponenten der den skal brukes:**
```tsx
import PageIcons from "@/components/ui/custom/PageIcons";
```

2. Velg plassering der ikonet ligger i public mappen og navnet på ikonet. Der etter kan det velges str og alt tekst som det ønskes <br>
```tsx
<PageIcons name="lock" directory="profileIcons" size={18} alt="Låst" />
```
</details>


<details><summary><strong>SiteLogo</strong></summary>

SiteLogo er dynamisk komponent som henter og viser logoer (header eller footer) som er lagret i Strapi-backenden.  

📍 **Filplassering:**  
`/frontend/src/components/ui/SiteLogo.tsx`

### Eksempel på bruk:

1. **Strapi adminpanel:**
Under singletypen `SiteLogo`, last opp loge i feltene `HeaderLogo` og `FooterLogo`.

2.  **Importer komponenten der den skal brukes:**
```tsx
import { SiteLogo } from "@/components/ui/SiteLogo";
```

3. **For header logo (default)**
```tsx
<SiteLogo style={{ width: "auto", height: "45px" }} />
```

 **For footer logo**
 ```tsx
<SiteLogo type="footer" style={{ width: "auto", height: "45px" }} />
```
</details>


<details>
   <summary>📇 ContentCard</summary>

The `ContentCard` is a universal card component used throughout the application to display different types of content—such as projects, events, blogs, and products—in a consistent and visually appealing way.

#### How it works

- The same `ContentCard` component is used for all content types.
- An **adapter** (for example, `cardAdapter`) transforms the data for each content type (project, event, blog, product) into a format that the `ContentCard` understands.
- This makes it easy to add new content types or update the card design in one place, and have the changes reflected everywhere.

#### Example usages

**Displaying a list of projects:**

```tsx
import { UniversalCard } from "@/components/pageSpecificComponents/dashboard/contentManager/ContentCard";
import { adaptProjectToCardProps } from "@/lib/adapters/cardAdapter";

// Inside your component render:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {projects.map((project) => (
   <UniversalCard
    key={project.id}
    {...adaptProjectToCardProps(project, handleProjectClick)}
   />
  ))}
</div>;
```

**Displaying a list of events:**

```tsx
import { UniversalCard } from "@/components/pageSpecificComponents/dashboard/contentManager/ContentCard";
import { adaptEventToCardProps } from "@/lib/adapters/cardAdapter";

// Inside your component render:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {events.map((event) => (
   <UniversalCard
    key={event.id}
    {...adaptEventToCardProps(event, handleEventClick)}
   />
  ))}
</div>;
```

</details>
<details>
   <summary>🔎 SearchBar</summary>

The `SearchBar` is a universal component used throughout the application to help users quickly find relevant content, such as projects, events, blogs, or products. It provides a simple and consistent search experience on all pages where searching is needed. This can also easily change your search logic since now it's mostly really basic searching.

#### How it works

- The `SearchBar` displays a text input where users can type their search query.
- As the user types, the search query is updated in real time.
- Optionally, a search button can be shown for submitting the search (for example, by pressing Enter or clicking the button).
- The component is flexible and can be used for any type of content by simply passing the current search query and a function to update it.

#### Example usage

**Using the SearchBar in a page or component:**

1. Import SearchBar component and
```tsx
import { SearchBar } from "@/components/ui/SearchBar";
import { useState } from "react";
```

2. Set up your state and handler for searching
```tsx
export default function ExamplePage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Optional: handle search submit
  const handleSearch = (query: string) => {
   // Perform search logic here
   console.log("Searching for:", query);
  };
```

3. Use SearchBar component in your return with right functionality for your page
```tsx
  return (
   <div>
    <SearchBar
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      placeholder="Search projects or events"
      onSearch={handleSearch}
    />
    {/* Render your filtered content here */}
   </div>
  );
}
```

</details>
<details>
    <summary>🔀 SortDropdown</summary>

The `SortDropdown` is a universal component that lets users easily sort lists of content, such as projects, events, blogs, or products. It provides a consistent and user-friendly way to choose how items are ordered on any page.

#### How it works

- The `SortDropdown` displays a dropdown menu with different sorting options (for example: newest first, oldest first, alphabetical).
- When the user selects an option, the list updates to show the content in the chosen order.
- The component is flexible and can be used for any type of content by passing in the available sort options and a function to update the sort state.

#### Example usage

**Using the SortDropdown in a page or component:**

```tsx
import { SortDropdown } from "@/components/ui/SortDropdown";
import { useState } from "react";
```
2. Add variables for options of sorting, create your function and initialize the state with a default state if wanted
```tsx
const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
];

export default function ExamplePage() {
  const [sort, setSort] = useState("newest");
```
3. Use the SortDropdown in your return with needed props from component and give the values on your page
```tsx
  return (
    <div>
      <SortDropdown
        sort={sort}
        setSort={setSort}
        options={sortOptions}
        placeholder="Sort by"
      />
      {/* Render your sorted content here */}
    </div>
  );
}
```
</details>
<details>
    <summary>↻ LoadingSpinner</summary>

The `LoadingSpinner` is a universal component that shows a spinning animation while the app is loading data. It helps users understand that something is happening in the background and improves the user experience by providing visual feedback.

#### How it works

- The `LoadingSpinner` displays a spinning circle to indicate that content is loading.
- You can choose different sizes (small, medium, large) to fit different parts of your app.
- The spinner can be reused anywhere you need to show a loading state, such as when fetching projects, events, or blog posts.

#### Example usage

**Using the LoadingSpinner in a page or component:**

1. Import LoadingSpinner component
```tsx
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
```
2. Use component inside the component or page you want it used on to show loading state
```tsx
export default function ExamplePage({ isLoading }) {
  return (
    <div>
      {isLoading ? (
        <LoadingSpinner size="medium" />
      ) : (
        <div>Your loaded content here</div>
      )}
    </div>
  );
}
```
</details>
<details>
    <summary>Card</summary>

The `Card` component is a universal building block used throughout the application to display content in a clean, organized, and visually appealing way. It provides a consistent layout for different types of information, such as projects, events, blogs, or products.

#### How it works

- The `Card` component wraps content in a styled box with rounded corners and a shadow, making information easy to read and visually separated from other elements.
- It can be combined with `CardHeader`, `CardBody`, and `CardFooter` subcomponents to organize content into sections (for example: image at the top, details in the middle, actions at the bottom).
- The card is flexible and can be used for any type of content by simply placing your content inside the card sections.

#### Example usage

**Using the Card component in a page or component:**

1. Import the Card component and its subcomponents
```tsx
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
```
2. Use the card on page or component wanted. Component also have different styling and props you can implement (Look at component)
```tsx
export default function ExamplePage() {
  return (
    <Card>
      <CardHeader>
        <h3>Project Title</h3>
      </CardHeader>
      <CardBody>
        <p>This is a short description of the project or content.</p>
      </CardBody>
      <CardFooter>
        <button>Read more</button>
      </CardFooter>
    </Card>
  );
}
```
</details>
<details>
    <summary>✏️ TipTapEditor</summary>

The `TipTapEditor` is a universal rich text editor component used throughout the application for writing and editing content, such as blog posts, project descriptions, or event details. It provides a user-friendly interface for adding formatted text, images, and links.

#### How it works

- The `TipTapEditor` allows users to write and format text with options like bold, italic, headings, lists, and links.
- Users can easily upload and insert images directly into their content.
- The editor supports text alignment and image alignment (left, center, right).
- It is flexible and can be used for any type of content that requires rich text editing.

#### Example usage

**Using the TipTapEditor in a form or page:**

1. Import editor component on where to use it
```tsx
import TipTapEditor from "@/components/ui/TipTapEditor";
```
2. Import useState and use it in created function
```tsx
import { useState } from "react";

export default function ExampleForm() {
  const [content, setContent] = useState("");
}
```
3. Add a return on the function that returns a form with the editor usage and needed props
```tsx
export default function ExampleForm() {
  
  return (
    <form>
      <label htmlFor="editor" className="block mb-2 font-medium">
        Content
      </label>
      <TipTapEditor
        value={content}
        onChange={setContent}
        placeholder="Write your content here..."
      />
      {/* Other form fields and submit button */}
    </form>
  );
}
```
</details>
<details>
    <summary>◀️ BackButton</summary>

The `BackButton` is a universal navigation component that lets users easily go back to the previous page or to a specific route. It helps users navigate the app more intuitively and can be customized to fit different designs and needs.

#### How it works

- The `BackButton` displays a button (optionally with an icon and custom label) that, when clicked, takes the user back to the previous page or to a specified route.
- You can customize the icon, label, size, and style to match your page.
- The button can be used anywhere in the app where you want to provide a clear way for users to go back or navigate.

#### Example usage

**Using the BackButton in a page or component:**

1. Import BackButton component
```tsx
import BackButton from "@/components/ui/BackButton";
```
2. Use component where you want. It has different implementing versions for what you want it to do
```tsx
// Standard back button (goes to previous page)
<BackButton />

// Back button to a specific route
<BackButton route="/dashboard" />

// Custom design and label
<BackButton 
  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
  iconClassName="mr-2"
>
  Go to Dashboard
</BackButton>

// Without icon
<BackButton showIcon={false} />

// With a different icon
<BackButton iconName="arrow-left" iconDirectory="navIcons" />
```
</details>
</details>
</details>

<details><summary><strong>Strapi Admin Panel</strong></summary>

## Strapi Admin Panel

The Strapi Admin Panel is the main interface for managing all content, users, and settings in your application.

---

### 🛠️ Tips

- **ESLint & Tailwind CSS:**  
   If you see "unknown at rule" errors in Tailwind CSS, install the **PostCSS Language Support** extension for VSCode. This improves syntax highlighting and color visualization.

---

### 👤 Admin Roles & Permissions

Strapi uses roles to manage access and permissions:

| Role            | Description                                                             |
| --------------- | ----------------------------------------------------------------------- |
| **Super Admin** | Full access to all system functions. Used for critical system tasks.    |
| **Editor**      | Can manage and publish all content, including content from other users. |
| **Author**      | Can manage only the content they have created.                          |

#### How to Change Roles

1. Log in to the Strapi admin panel.
2. Go to **Settings** in the sidebar.
3. Under **USERS & PERMISSIONS PLUGIN**, select **Roles**.
4. Click on a role to view or modify its permissions.
5. Adjust permissions as needed.
6. Click **Save** to apply changes.

# For Public users

Choose find and find one on every thing to show content from strapi

# For Admin

Choose every thing

![Screenshot](/ImagesForReadme/StrapiPermisions.png)

#### How to Manage Roles

- To edit an existing role, click the pencil icon next to the role.
- To add a new role, click **+ Add new role** at the top right.
- Configure permissions for different plugins and features.
- Remember to **Save** after making changes.
- We have only implemented </br>
  ![Screenshot](/ImagesForReadme/userRoles.png)

---

### 📦 Content Management

Strapi organizes content into **Collection Types** (multiple entries) and **Single Types** (unique pages).

#### Accessing the CMS

1. Log in to the admin panel.
2. The **Content Manager** dashboard appears.
3. Use the left sidebar to navigate content types.

#### Content Types

- **Collection Types:**

  - Blog: Manage blog posts
  - ContactSubmission: View form submissions
  - Event: Manage events
  - Project: Showcase projects
  - User: Manage user accounts
  - User Profile: Extended user info

- **Single Types:**
  - AboutUs: Company info and team
  - AuthSetting: Authentication settings
  - ContactPage: Contact page config
  - Footer: Website footer content
  - GlobalSetting: Site-wide settings
  - LandingPageHero: Landing page hero section

#### Managing Content

- **View/Edit:**

  - Click a content type in the sidebar.
  - For Collection Types: See a list of entries.
  - For Single Types: Go directly to the editing interface.

- **Create New Entry (Collection Types):**

  1.  Select the Collection Type.
  2.  Click **+ Add an entry**.
  3.  Fill in the fields.
  4.  Click **Save** (draft) or **Publish** (live).

- **Edit Entry:**
  1.  Click the entry to edit.
  2.  Make changes.
  3.  Click **Save** (draft) or **Publish** (live).

#### Publishing Workflow

- **Draft:** Content is saved but not visible to the public.
- **Published:** Content is live and visible on the website.

---

</details>

<details><summary><strong>Application features and how they works</strong></summary>
  
### User Features

- **Activity page**

  - Gives an easy overview of every project and events in a clean card format.
  - Gives users an easy switching between showing project or events with a selector in top right
  - Gives users a way to search for names of projects or events depending of which is shown.
  - Users can click on each activity card to be taken to another page with that cards information
  - Users can filter the activities after status. If you want to see upcoming events, or projects in planning phase.
  - Users can sort between the activities aphabetical, reverse, newest or oldest first. Newest first is set as default.

- **Blog page**

  - Same as activities here users can see all blogs posted on application.
  - Users can also filter, search and sort similar just adapted to blogg posts instead. Here the filter is category based.
  - Users should be able to add blogg with a simple "add new blog" button on top right of container. (Not fully implemented, but has components needed)
  - Users can also by clicking on posts get taken to another page with detailed information about the clicked post.
  - Every blog posts should be connected to a specific user that made the posts (Author), with a way to show that user on the detail page.

- **E-Commerce Shop**

  - Users can easily see all products created by The Cave Tech that they have put on their store. This is shown in a clean grid card format
  - Users can search after products inside the store.
  - Users can filter products they want shown based on categories.
  - Users can sort after newest or oldest products.
  - Users can add product they want to cart by clicking on "Legg til i handlekurv" button on product they want.
  - Users can go to their cart to be taken to another page for showing all products inside their own cart.

- **About us page**

  - Here the users can switch between reading about The Cave Tech history or their team.
  - History will contain information about how The Cave Tech became who they are today. Their journey.
  - Their team will contain information about each member in The Cave Tech.

- **Contact Page**

  - Users can see information about The Cave Tech.
  - Users can contact The Cave Tech using a submit form for submiting a message directly to their mail.

### Admin Features

- **Content Management**

  - Admins can customize content on pages inside Strapi admin panel that is set up with our frontend
  - Admins will also get a custom panel with their userpanel only for admin permissions.
  - Admins will in custom admin panel be able to use functionalities for administrating projects, events and blogs.
  - When choosing what to administrate admins will be taken to a table of chosen content. Here they can add, delete, edit or view details.

- **User Management**

  - Inside Strapi admins will have access to view all different users using their system/application
  - Admins can here delete users that breach terms of service on web application or for other reasons.
  - Admins can change and control permissions for different aspects of application.

### Authentication

- **Login and register**

  - Users can login with local account created for access to The Cave Tech application
  - Users can login with third party providers like google, microsoft or facebook.
  - Logging in with third party providers will create local account connected to provider used.
  - Users will be validated with security validation when creating local account. This helps users create a safe and secure account.
  - Validation on register and login will be live and server based.
  - When creating an account the "create" button will be grayed out and unclickable before all validation is followed.
  - Login and register uses forms for a clean and effective design and user experience.

- **Role-Based Access**
  - Application will have a role based system where you will see and have different actions based on your permissions.
  - Admins will be users with extra persmissions that allow for customization on content for the application.
  - There are different actions that cant be preformed before you have logged into an account. Includes sign up for events and being able to use the CRM functionality.
  - Header will be different depending on logged in status since if not logged in you will not have CRM access at all.

### Data Management

- **Order History** - Track customer purchases (partially implemented)
- **Contact Storage** - All form submissions stored in database
- **User Profiles** - Extended profile information for community members

</details>

<details>
    <summary>
        <strong>About us guide<strong>
            </summary>

           Strapi is a headless CMS (Content Management System) that allows you to manage content independently from frontend presentation. "AboutUs" is set up as a Single Type in your Strapi configuration, meaning it's a single content page with two main components: a history section and a team section.

<strong>Log in to Strapi:<strong>

1. Open your browser and go to your Strapi instance URL (typically something like http://localhost:1337/admin or your custom domain address)
2. Log in with your username and password
   <strong>Navigate to the Content Manager:<strong>
3. On the left side of the screen, you'll find the main navigation menu
4. Click on the "Content Manager" icon (it appears to be the first icon in the menu you're currently on)
   <strong>Find AboutUs under Single Types:<strong>
   In the Content Manager, content is organized into two main categories:

5. "COLLECTION TYPES" - for content types with multiple entries
6. "SINGLE TYPES" - for content types with only one entry
7. Scroll down to the "SINGLE TYPES" section (which has the number "6" next to it, indicating 6 different single types)
8. Under "SINGLE TYPES", find "AboutUs" in the list (marked with a blue arrow in the image)
9. Click on "AboutUs" to open this content type
   <strong>AboutUs editing screen:
10. After clicking on "AboutUs", you'll arrive at the editing screen shown in the image
11. Here you'll see two main sections: "history" and "teamCard" (both are empty with "(0)" indicating no entries)
12. To add content, click on the plus icon (+) or on the text "No entry yet. Click to add one."
</details>

<details>
    <summary><strong>Footer guide<strong></summary>
The Footer configuration allows you to manage website footer content, including business hours and social media (Instagram) information.
        Navigation:

1. You're in the "Footer" section under "SINGLE TYPES" in the left sidebar
2. Footer is highlighted in blue in the menu
3. There's a "Back" button at the top to return to the previous screen

Footer Content Sections:

1. openingHours (0): Empty section with "No entry yet. Click to add one." message and a plus icon
2. instaGram: Contains two fields:

- url: Empty text input field for the Instagram profile URL
- icon: Empty media field with "Click to add an asset or drag and drop one in this area" message and a plus icon

Status:

1. The Footer is marked as "Published" (green label)
2. You can switch between "DRAFT" and "PUBLISHED" versions using the tabs

Action Buttons:

1. In the ENTRY panel on the right:

- "Publish" button: To publish changes
- "Save" button: To save without publishing

To update the Footer content:

1. For opening hours: Click the plus icon to add entries to the openingHours section
   For Instagram:

- Type your Instagram URL in the url field
- Upload an Instagram icon by clicking the plus icon in the icon field
</details>
