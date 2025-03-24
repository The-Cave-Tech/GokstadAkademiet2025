import { NextResponse } from "next/server";
import { getAuthCookie } from "@/lib/utils/cookie";

export async function GET() {
  try {
    const authToken = await getAuthCookie();
    
    return NextResponse.json({ 
      authenticated: !!authToken
    });
  } catch (error) {
    console.error("[API] Auth check - Error:", error);
    
    return NextResponse.json({ 
      authenticated: false,
      error: "Kunne ikke sjekke autentiseringsstatus"
    }, { status: 500 });
  }
}