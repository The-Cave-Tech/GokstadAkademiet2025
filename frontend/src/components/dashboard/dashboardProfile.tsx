export default async function DashboardProfile() {
  return (
    <section className="w-full mx-auto px-4 py-8">
      <div className="relative h-[40vh] sm:h-64 md:h-80 mb-16 sm:mb-20"></div>
      <div className="flex flex-col sm:items-start items-center gap-4 px-4 sm:px-10">
        <h1 className="text-3xl sm:text-4xl"></h1>
        <p className="text-center sm:text-left">{"No bio available"}</p>
      </div>
    </section>
  );
}
