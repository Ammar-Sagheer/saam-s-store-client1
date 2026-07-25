import { Roboto } from "next/font/google";
import "@/app/_styles/globals.css";
import { Toaster } from "react-hot-toast";
import AppChrome from "@/app/_components/layout/AppChrome";
import { siteConfig } from "@/app/_lib/siteConfig";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: siteConfig.metaTitle,
  description: siteConfig.metaDescription,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Toaster
          position="top-center"
          gutter={8}
          containerStyle={{
            top: 20,
            left: 0,
            right: 0,
            margin: "0 auto",
            maxWidth: "100%",
            padding: "0 16px",
          }}
          toastOptions={{
            duration: 2500,
            style: {
              background: "#fff",
              color: "#333",
              border: "1px solid rgba(0,0,0,0.06)",
              padding: "10px 16px",
              borderRadius: "12px",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.06)",
              maxWidth: "fit-content",
              width: "auto",
              margin: "0 auto",
              fontSize: "14px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            },
            success: {
              style: {
                borderLeft: "4px solid #28a745",
                borderRadius: "10px",
              },
            },
            error: {
              style: {
                borderLeft: "4px solid #e63946",
                borderRadius: "10px",
              },
            },
          }}
        />
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
