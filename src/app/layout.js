import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = { title: "HCM Lite" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}