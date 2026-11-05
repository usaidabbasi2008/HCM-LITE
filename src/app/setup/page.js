"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, ErrorText, Input } from "@/components/ui";

export default function Setup() {
  const router = useRouter();
  const [f, setF] = useState({ companyName: "", name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    fetch("/api/setup")
      .then((r) => r.json())
      .then(({ done }) => done && router.replace("/login"));
  }, [router]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error);
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Welcome to HCM Lite</h1>
          <p className="text-sm text-slate-500">
            Company aur Admin account setup karein (sirf ek baar).
          </p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <Input label="Company name" value={f.companyName} onChange={set("companyName")} required />
          <Input label="Admin name" value={f.name} onChange={set("name")} required />
          <Input label="Admin email" type="email" value={f.email} onChange={set("email")} required />
          <Input
            label="Password"
            type="password"
            minLength={6}
            value={f.password}
            onChange={set("password")}
            required
          />
          <ErrorText>{error}</ErrorText>
          <Button className="w-full" disabled={busy}>
            {busy ? "Setting up…" : "Create company"}
          </Button>
        </form>
      </Card>
    </div>
  );
}