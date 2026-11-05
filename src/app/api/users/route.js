import { NextResponse } from "next/server";
import { withAuth } from "@/lib/guard";
import { createLogin } from "@/services/auth";
import { adminDb } from "@/lib/firebaseAdmin";

export const POST = withAuth(["admin"], async (req, { user }) => {
  const body = await req.json();
  return NextResponse.json(await createLogin(user, { ...body, role: "hr" }), { status: 201 });
});

export const GET = withAuth(["admin"], async () => {
  const snap = await adminDb.collection("users").get();
  return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
});