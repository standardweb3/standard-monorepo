import Script from "next/script";
import "ui/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-zinc-900">
      <head>
        <Script
          defer
          src="/tradingview/charting_library/charting_library.standalone.js"
        />
        <Script defer src="/tradingview/datafeeds/udf/dist/bundle.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
