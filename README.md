# TheCaveTech

<details>
    <summary><strong>🚀 Getting Started / Setup</strong></summary>

This setup is designed for testing purposes only, as the company prefers to handle deployment themselves.
<details>
<summary><strong>
1. Installation
</strong></summary>

# <strong>Til sensor</strong>
Du kan hoppe over steg 0
</br>
Both frontend and backend have `.env.example` files.  
0. Create `.env` files in both frontend and backend folders and copy the contents from `.env.example` into `.env`.


# database filen innheolder kun data ikke bilder


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
Her trenges det bare å kopiere innholdet fra .env.example over til .env

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

<details><summary><strong># How to use Strapi</strong></summary>
# Plugins.ts
#
</details>

<details><summary><strong># How to use Strapi</strong></summary></details>

<details><summary><strong># How pages work</strong></summary></details>

<details><summary><strong># Universal components</strong></summary></details>


**Strapi Admin Panel** – The main admin panel for content management on the site, allowing you to manage all content, users, and settings for your application.

- To remove ESLint feedback about "unknown at rule" errors in Tailwind CSS, install the PostCSS Language Support extension for VSCode. This extension helps with syntax highlighting and can be enabled or disabled as needed for color visualization.

**Admin Roles in the System**
Admin roles, their functions, and best practices for managing permissions in the system.
Role Types and Areas of Responsibility
Superadmin has full access to all system functions and is only used for critical system tasks.
How to Change Roles:
To change roles in the system, follow these steps:

1 Log in to the Strapi administration panel
2 Go to "Settings" in the side menu
3 Select "Roles" under the USERS & PERMISSIONS PLUGIN section
4 You will now see a list of available roles
5 Click on the role you want to modify
6 This will open the permissions list where you can change permissions for the different plugins and functions
7 Remember to click "Save" after making changes to activate the new permissions.






