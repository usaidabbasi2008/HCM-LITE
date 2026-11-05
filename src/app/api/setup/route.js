import { NextResponse } from "next/server";
import { firstSetup, isSetupDone } from "@/services/auth";
import { HttpError } from "@/lib/guard";

function fail(e) {
  console.error(e);
  return NextResponse.json(
    { error: e.message || "Server error" },
    { status: e instanceof HttpError ? e.status : 500 }
  );
}

export async function GET() {
  try {
    return NextResponse.json({ done: await isSetupDone() });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req) {
  try {
    return NextResponse.json(await firstSetup(await req.json()), { status: 201 });
  } catch (e) {
    return fail(e);
  }
}