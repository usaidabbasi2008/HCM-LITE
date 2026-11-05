"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/authClient";
import { Button, Card, ErrorText, Input } from "@/components/ui";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const u = await login(email, password);
      router.replace(u.mustChangePassword ? "/change-password" : `/${u.role}`);
    } catch {
      setError("Email ya password ghalat hai, ya account inactive hai");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <form onSubmit={submit} className="space-y-3">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <ErrorText>{error}</ErrorText>
          <Button className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}