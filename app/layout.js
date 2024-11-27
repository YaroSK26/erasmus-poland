import "./globals.css";export const metadata = {
  title: "ERASMUS AI",
  description: "website about ai ",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
