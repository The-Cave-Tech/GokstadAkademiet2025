# TheCaveTech

<details>
    <summary><strong>🚀 Getting Started / Setup</strong></summary>

This setup is designed for testing purposes only, as the company prefers to handle deployment themselves.
<details>
<summary><strong>
1. Installation
</strong></summary>

</br>
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
14. Navigate to the backend URL specified in your frontend `.env`  
15. If using our database file and prompted to create a user, use:  
        - Email: test@den.no  
        - Password: Gokstad1234  
     # OR 
     admin@admin.no </br>
     Admin1234 </br>



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
<summary><strong>
🔐 2. Setting up OAuth / 3rd-party SSO Providers <br>
<strong>For testing:</strong>
</strong></summary>

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
<summary><strong>
🔐 3. Setting up SendGrid <br>
<strong>For testing:</strong>
</strong></summary>

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

<details><summary><strong># How to</strong></summary>
## 🔑 JWT Token Expiry

To change how long JWT tokens are valid:

- **backend/config/plugins.ts**
     - Find: `expiresIn: "7h"`
     - Change `"7h"` to your desired duration (e.g., `"24h"` for 24 hours).

- **lib/util/cookie.ts**
     - Find: `const maxAge = 7 * 60 * 60;`
     - Change `7` to the number of hours you want (e.g., `24 * 60 * 60` for 24 hours).

---

## ✉️ Email Configuration & Templates

### 1. Environment Variables

- Set email-related variables in your backend `.env` file.

### 2. Plugin Configuration

- **backend/config/plugins.ts**
     - Configure your email provider and settings here.

### 3. Email Service & Templates

- **backend/src/service/**
     - All email logic, templates, and text changes are handled here.
     - To update email content or templates, edit the relevant files in this folder.

---

**Tip:**  
For custom email text and templates, always update files in `backend/src/service` to match your requirements.

</details>

<details><summary><strong>#Strapi Admin Panel</strong></summary>
## Strapi Admin Panel

The Strapi Admin Panel is the main interface for managing all content, users, and settings in your application.

---

### 🛠️ Tips

- **ESLint & Tailwind CSS:**  
     If you see "unknown at rule" errors in Tailwind CSS, install the **PostCSS Language Support** extension for VSCode. This improves syntax highlighting and color visualization.

---

### 👤 Admin Roles & Permissions

Strapi uses roles to manage access and permissions:

| Role         | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **Super Admin** | Full access to all system functions. Used for critical system tasks.         |
| **Editor**      | Can manage and publish all content, including content from other users.      |
| **Author**      | Can manage only the content they have created.                              |

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
     1. Select the Collection Type.
     2. Click **+ Add an entry**.
     3. Fill in the fields.
     4. Click **Save** (draft) or **Publish** (live).

- **Edit Entry:**  
     1. Click the entry to edit.
     2. Make changes.
     3. Click **Save** (draft) or **Publish** (live).

#### Publishing Workflow

- **Draft:** Content is saved but not visible to the public.
- **Published:** Content is live and visible on the website.

---


</details>

<details>
    <summary>
        <strong>Contact us guide<strong>
     </summary>
    Kontakt oss
</details>





