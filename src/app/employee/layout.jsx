import AppShell from "@/components/AppShell";

export default function Layout({ children }) {
  return <AppShell role="employee">{children}</AppShell>;
}