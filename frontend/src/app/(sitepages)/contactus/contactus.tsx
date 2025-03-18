import { useState, useEffect } from "react";
import { getStrapiData } from "@/data/services/strapiApiData";
import { validateField, validateForm } from "@/lib/utils/validateForm"; // ✅ Import validering

const KontaktOss = () => {
  const [formData, setFormData] = useState({
    navn: "",
    telefon: "",
    epost: "",
    melding: "",
  });

  const [errors, setErrors] = useState({
    telefon: "",
    epost: "",
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
        setContactInfo({
          adresse: data?.data?.Address || "Ikke tilgjengelig",
          telefon: data?.data?.Phone || "Ikke tilgjengelig",
          epost: data?.data?.Email || "Ikke tilgjengelig",
        });
      } catch (error) {
        console.error("Failed to fetch contact info", error);
      }
    }
    fetchContactInfo();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // ✅ Kjør validering fra validateForm.ts
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm(formData); // ✅ Kjør validering
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) {
      return; // Stopper hvis det er feil
    }

    const { navn, telefon, epost, melding } = formData;

    const mailtoLink = `mailto:aslan.khatuev@outlook.com?subject=Ny melding fra kontaktskjema&body=
    Navn: ${encodeURIComponent(navn)}
    %0D%0A
    Telefon: ${encodeURIComponent(telefon)}
    %0D%0A
    E-post: ${encodeURIComponent(epost)}
    %0D%0A
    Melding: ${encodeURIComponent(melding)}`;

    window.location.href = mailtoLink;

    setFormData({
      navn: "",
      telefon: "",
      epost: "",
      melding: "",
    });

    setErrors({
      telefon: "",
      epost: "",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-20 bg-gray-100 min-h-screen">
      <div className="flex flex-col lg:flex-row items-start w-full max-w-5xl gap-12">
        <div className="w-full lg:w-1/2 bg-white p-10 rounded-lg shadow-lg">
          <h2 className="text-3xl mb-6 font-bold text-blue-700">
            Kontaktinformasjon
          </h2>
          <p className="mb-5 text-lg">
            <strong>Adresse:</strong> {contactInfo.adresse}
          </p>
          <p className="mb-5 text-lg">
            <strong>Telefon:</strong> {contactInfo.telefon}
          </p>
          <p className="mb-5 text-lg">
            <strong>E-post:</strong> {contactInfo.epost}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-1/2 bg-white p-10 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl mb-8 font-bold text-blue-700">
            Kontaktskjema
          </h2>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <label htmlFor="navn" className="block mb-2 text-lg">
                Navn
              </label>
              <input
                type="text"
                id="navn"
                name="navn"
                value={formData.navn}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg text-lg"
                required
              />
            </div>

            <div className="flex-1">
              <label htmlFor="telefon" className="block mb-2 text-lg">
                Telefon
              </label>
              <input
                type="tel"
                id="telefon"
                name="telefon"
                value={formData.telefon}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg text-lg"
                required
              />
              {errors.telefon && (
                <p className="text-red-500 text-sm">{errors.telefon}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="epost" className="block mb-2 text-lg">
              E-post
            </label>
            <input
              type="email"
              id="epost"
              name="epost"
              value={formData.epost}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg text-lg"
              required
            />
            {errors.epost && (
              <p className="text-red-500 text-sm">{errors.epost}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="melding" className="block mb-2 text-lg">
              Melding
            </label>
            <textarea
              id="melding"
              name="melding"
              value={formData.melding}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg text-lg h-40"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Send Melding
          </button>
        </form>
      </div>
    </div>
  );
};

export default KontaktOss;
