Veiledning for tilpasning av profilsidens design
Denne guiden forklarer hvordan du kan endre farger, fonter, avstander og andre designelementer i appkikasjonen uten å måtte endre koden direkte.
Hvor finner du stilene?
Alle designinnstillinger for applikasjoen er definert i filen src/styles/
Hvordan endre stiler?

Eksmempel på hvordan stylen kan byttes ut.


Finn variabelen du vil endre, for eksempel:
--profile-primary: #ff6b6b; (primærfarge for knapper og ikoner)



Erstatt verdien med en ny. For eksempel:
Endre --profile-primary: #ff6b6b; til --profile-primary: #007bff; for en blå farge.



Farger: Bruk hex-koder 
Fonter: Bruk fontnavn tilgjengelig via Google Fonts eller systemfonter (f.eks. "Arial, sans-serif").
Avstander: Bruk CSS-enheter som rem, px, eller em (f.eks. 1rem, 16px).


