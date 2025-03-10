import { useState, useEffect } from "react";
import { getStrapiData } from "@/data/services/strapiApiData";

const KontaktOss = () => {
  const [formData, setFormData] = useState({
    navn: "",
    telefon: "",
    epost: "",
    melding: "",
  });
  const [contactInfo, setContactInfo] = useState({
    adresse: "Laster...",
    telefon: "Laster...",
    epost: "Laster...",
  });

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const data = await getStrapiData("/api/contact-info");
        console.log("Fetched contact info:", data);
        setContactInfo({
          adresse: data?.data?.adresse || "Ikke tilgjengelig",
          telefon: data?.data?.telefon || "Ikke tilgjengelig",
          epost: data?.data?.epost || "Ikke tilgjengelig",
        });
      } catch (error) {
        console.error("Failed to fetch contact info", error);
      }
    }
    fetchContactInfo();
  }, []);

  useEffect(() => {
    console.log("Oppdatert contactInfo:", contactInfo);
  }, [contactInfo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 lg:p-16 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row items-start w-full max-w-4xl gap-8">
        <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-md h-full">
          <h2 className="text-2xl mb-4 font-semibold text-blue-600">
            Kontaktinformasjon
          </h2>
          <p className="mb-4">
            <strong>Adresse:</strong> {contactInfo.adresse}
          </p>
          <p className="mb-4">
            <strong>Telefon:</strong> {contactInfo.telefon}
          </p>
          <p className="mb-4">
            <strong>E-post:</strong> {contactInfo.epost}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-md h-full"
        >
          <h2 className="text-2xl mb-6 font-semibold text-blue-600">
            Kontaktskjema
          </h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="navn" className="block mb-1">
                Navn
              </label>
              <input
                type="text"
                id="navn"
                name="navn"
                value={formData.navn}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>

            <div className="flex-1">
              <label htmlFor="telefon" className="block mb-1">
                Telefonnummer
              </label>
              <input
                type="tel"
                id="telefon"
                name="telefon"
                value={formData.telefon}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="epost" className="block mb-1">
              E-post
            </label>
            <input
              type="email"
              id="epost"
              name="epost"
              value={formData.epost}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="melding" className="block mb-1">
              Melding
            </label>
            <textarea
              id="melding"
              name="melding"
              value={formData.melding}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded h-32"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Send Melding
          </button>
        </form>
      </div>
    </div>
  );
};

export default KontaktOss;
