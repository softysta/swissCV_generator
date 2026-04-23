import ClassicTemplate from "@/components/cv/templates/ClassicTemplate";
import ModernTemplate from "@/components/cv/templates/ModernTemplate";
import { TCVContent } from "@/types/cvContent.tye";

interface CVPreviewPageProps {
  searchParams: Promise<{ template?: string; data?: string; token?: string }>;
}

export default async function CVPreviewPage(props: CVPreviewPageProps) {
  const searchParams = await props.searchParams;
  const template = searchParams.template || "classic";
  const token = searchParams.token;
  const dataParam = searchParams.data;

  let cvData: TCVContent;

  if (token) {
    // PDF generation path — fetch data from server by token
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    try {
      const res = await fetch(`${baseUrl}/api/generate-pdf?token=${token}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        return <div>Token not found or expired</div>;
      }
      cvData = await res.json();
    } catch (e) {
      console.error("Failed to fetch CV data by token:", e);
      return <div>Failed to load CV data</div>;
    }
  } else if (dataParam) {
    // Browser preview path — data is in the URL
    try {
      cvData = JSON.parse(dataParam);
    } catch (e) {
      console.error("Failed to parse CV data:", e);
      return <div>Invalid data</div>;
    }
  } else {
    return <div>No data</div>;
  }

  return (
    <div style={{ margin: 0, padding: 0, background: "white" }}>
      {template === "modern" ? (
        <ModernTemplate data={cvData} />
      ) : (
        <ClassicTemplate data={cvData} />
      )}
    </div>
  );
}