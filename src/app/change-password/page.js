"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { changeFirstPassword } from "@/lib/authClient";
import { Button, Card, ErrorText, Input } from "@/components/ui";

export default function ChangePassword() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (pw !== pw2) return setError("Passwords match nahi karte");
    try {
      await changeFirstPassword(pw);
      await refresh();
      router.replace(`/${user.role}`);
    } catch (err) {
      setError(
        err.code === "auth/requires-recent-login"
          ? "Dobara login karein, phir password change karein"
          : err.message
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Naya password set karein</h1>
        <form onSubmit={submit} className="space-y-3">
          <Input label="New password" type="password" minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} required />
          <Input label="Confirm password" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} required />
          <ErrorText>{error}</ErrorText>
          <Button className="w-full">Save</Button>
        </form>
      </Card>
    </div>
  );
}