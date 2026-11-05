"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    (async () => {
      if (user) {
        return router.replace(user.mustChangePassword ? "/change-password" : `/${user.role}`);
      }
      try {
        const res = await fetch("/api/setup");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        router.replace(data.done ? "/login" : "/setup");
      } catch (e) {
        setError(e.message || "Server se jawab nahi aaya, terminal check karein");
      }
    })();
  }, [user, loading, router]);

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  return <Spinner />;
}