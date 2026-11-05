import { NextResponse } from "next/server";
import { withAuth } from "@/lib/guard";
import { setActive, resetPassword } from "@/services/auth";

export const PATCH = withAuth(["admin"], async (req, { user, params }) => {
  const { uid } = await params;
  const { action, tempPassword } = await req.json(); // "deactivate" | "activate" | "reset"
  if (action === "reset") await resetPassword(user, uid, tempPassword);
  else await setActive(user, uid, action === "activate");
  return NextResponse.json({ ok: true });
});