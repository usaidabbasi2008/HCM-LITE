import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";

export async function logAudit({ actor, action, entity, entityId, before = null, after = null }) {
  await adminDb.collection("auditLogs").add({
    actorUid: actor.uid,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    entity,
    entityId,
    before: before ? JSON.stringify(before) : null,
    after: after ? JSON.stringify(after) : null,
    at: FieldValue.serverTimestamp(),
  });
}