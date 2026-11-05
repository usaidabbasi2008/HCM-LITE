import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "./firebaseAdmin";

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function withAuth(roles, handler) {
  return async (req, ctx) => {
    try {
      const token = req.headers.get("authorization")?.replace("Bearer ", "");
      if (!token) throw new HttpError(401, "Login required");

      const decoded = await adminAuth.verifyIdToken(token);
      const snap = await adminDb.doc(`users/${decoded.uid}`).get();
      const user = snap.data();

      if (!user || !user.active) throw new HttpError(403, "Account inactive");
      if (roles.length && !roles.includes(user.role)) throw new HttpError(403, "Forbidden");

      return await handler(req, { ...ctx, user: { uid: decoded.uid, ...user } });
    } catch (e) {
      const status = e.status || 500;
      if (status === 500) console.error(e);
      return NextResponse.json({ error: e.message || "Server error" }, { status });
    }
  };
}