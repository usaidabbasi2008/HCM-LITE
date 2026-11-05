import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { HttpError } from "@/lib/guard";
import { logAudit } from "./audit";

const DEFAULT_SETTINGS = {
  officeStart: "09:00",
  graceMinutes: 15,
  halfDayHours: 5,
  weekend: ["Sat", "Sun"],
  officeLat: null,
  officeLng: null,
  radiusMeters: 150,
};

export async function isSetupDone() {
  return (await adminDb.doc("settings/company").get()).exists;
}

export async function firstSetup({ companyName, name, email, password }) {
  if (!companyName || !name || !email || !password || password.length < 6)
    throw new HttpError(422, "Saari fields chahiye (password kam az kam 6 chars)");

  const ref = adminDb.doc("settings/company");
  try {
    await ref.create({ companyName, ...DEFAULT_SETTINGS, createdAt: FieldValue.serverTimestamp() });
  } catch {
    throw new HttpError(409, "Setup pehle hi ho chuka hai");
  }

  try {
    const u = await adminAuth.createUser({ email, password, displayName: name });
    await adminDb.doc(`users/${u.uid}`).set({
      name,
      email,
      role: "admin",
      active: true,
      mustChangePassword: false,
      createdAt: FieldValue.serverTimestamp(),
    });
    return { uid: u.uid };
  } catch (e) {
    await ref.delete();
    throw new HttpError(400, e.message);
  }
}

// Admin => HR banaye. HR => employee banaye (Part 3 mein use hoga)
export async function createLogin(actor, { name, email, tempPassword, role, extra = {} }) {
  const allowed = actor.role === "admin" ? ["hr"] : actor.role === "hr" ? ["employee"] : [];
  if (!allowed.includes(role)) throw new HttpError(403, `${actor.role} ye role nahi bana sakta`);
  if (!name || !email || !tempPassword || tempPassword.length < 6)
    throw new HttpError(422, "name, email, tempPassword (6+) chahiye");

  let u;
  try {
    u = await adminAuth.createUser({ email, password: tempPassword, displayName: name });
  } catch (e) {
    throw new HttpError(400, e.message);
  }

  await adminDb.doc(`users/${u.uid}`).set({
    name,
    email,
    role,
    active: true,
    mustChangePassword: true,
    createdBy: actor.uid,
    createdAt: FieldValue.serverTimestamp(),
    ...extra,
  });
  await logAudit({ actor, action: "create", entity: "user", entityId: u.uid, after: { name, email, role } });
  return { uid: u.uid };
}

export async function setActive(actor, uid, active) {
  const ref = adminDb.doc(`users/${uid}`);
  const before = (await ref.get()).data();
  if (!before) throw new HttpError(404, "User nahi mila");
  if (before.role === "admin") throw new HttpError(403, "Admin ko deactivate nahi kar sakte");

  await ref.update({ active });
  await adminAuth.updateUser(uid, { disabled: !active });
  await logAudit({
    actor,
    action: active ? "activate" : "deactivate",
    entity: "user",
    entityId: uid,
    before: { active: before.active },
    after: { active },
  });
}

export async function resetPassword(actor, uid, tempPassword) {
  if (!tempPassword || tempPassword.length < 6) throw new HttpError(422, "tempPassword (6+) chahiye");
  const ref = adminDb.doc(`users/${uid}`);
  if (!(await ref.get()).exists) throw new HttpError(404, "User nahi mila");

  await adminAuth.updateUser(uid, { password: tempPassword });
  await ref.update({ mustChangePassword: true });
  await logAudit({ actor, action: "reset_password", entity: "user", entityId: uid });
}