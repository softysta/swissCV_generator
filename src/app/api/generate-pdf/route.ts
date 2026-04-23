import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// In-memory store for CV data (lives for the duration of the request)
const cvDataStore = new Map<string, unknown>();

async function getBrowser() {
  if (process.env.NODE_ENV === "development") {
    const puppeteer = await import("puppeteer");
    return puppeteer.default.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: { width: 794, height: 1123, deviceScaleFactor: 2 },
    });
  }

  const chromium = await import("@sparticuz/chromium-min");
  const puppeteer = await import("puppeteer-core");

  return puppeteer.default.launch({
    args: chromium.default.args,
    defaultViewport: { width: 794, height: 1123, deviceScaleFactor: 2 },
    executablePath: await chromium.default.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar`,
    ),
    headless: true,
  });
}

// GET endpoint — preview page calls this to retrieve CV data by token
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const data = cvDataStore.get(token);
  if (!data) {
    return NextResponse.json(
      { error: "Token not found or expired" },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get("template") || "classic";

  let browser = null;

  try {
    const cvData = await req.json();

    // Store data with a UUID instead of putting it in the URL
    const token = randomUUID();
    cvDataStore.set(token, cvData);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Pass only the small token in the URL
    const previewUrl = `${baseUrl}/cv-preview?template=${template}&token=${token}`;

    browser = await getBrowser();
    const page = await browser.newPage();

    await page.goto(previewUrl, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 800));

    const pdfBuffer = await page.pdf({
      width: "794px",
      height: "1123px",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    // Clean up after PDF is generated
    cvDataStore.delete(token);

    return new NextResponse(Buffer.from(pdfBuffer), {
      
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="CV.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  } finally {
    if (browser) await browser.close();
  }
}
