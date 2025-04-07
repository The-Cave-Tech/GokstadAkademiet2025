/* import { GetServerSideProps } from "next";
import ContentGrid from "@/components/dashboard/events/ContentGrid";

interface ContentListPageProps {
  contentType: string;
}

export default function ContentListPage({ contentType }: ContentListPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{contentType}</h1>
      <ContentGrid contentType={contentType} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { contentType } = params as { contentType: string };

  // Validate that contentType is valid
  const validTypes = ["projects", "activities", "blogs"];
  if (!validTypes.includes(contentType)) {
    return {
      notFound: true,
    };
  }

  return {
    props: { contentType },
  };
}; */
