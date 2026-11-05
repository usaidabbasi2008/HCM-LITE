"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button, Card, ErrorText, Input, Spinner } from "@/components/ui";

export default function HrUsers() {
  const [users, setUsers] = useState(null);
  const [f, setF] = useState({ name: "", email: "", tempPassword: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const load = () => api("/api/users").then(setUsers).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  async function create(e) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/users", { method: "POST", body: f });
      setF({ name: "", email: "", tempPassword: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function act(uid, action, tempPassword) {
    setError("");
    try {
      await api(`/api/users/${uid}`, { method: "PATCH", body: { action, tempPassword } });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!users) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">HR Logins</h1>

      <Card>
        <form onSubmit={create} className="grid gap-3 md:grid-cols-4 md:items-end">
          <Input label="Name" value={f.name} onChange={set("name")} required />
          <Input label="Email" type="email" value={f.email} onChange={set("email")} required />
          <Input label="Temporary password" value={f.tempPassword} onChange={set("tempPassword")} minLength={6} required />
          <Button>Create HR</Button>
        </form>
        <div className="mt-3">
          <ErrorText>{error}</ErrorText>
        </div>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      u.active ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {u.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="space-x-2 p-3">
                  {u.role !== "admin" && (
                    <>
                      <Button variant="ghost" onClick={() => act(u.id, u.active ? "deactivate" : "activate")}>
                        {u.active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const p = prompt("Naya temporary password (6+ chars):");
                          if (p) act(u.id, "reset", p);
                        }}
                      >
                        Reset
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}