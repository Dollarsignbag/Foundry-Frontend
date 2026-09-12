import "./globals.css";
import NavBar from "./components/NavBar";
import Starfield from "./components/Starfield";

export const metadata = {
  title: "The Foundry Network · Built For Men Who Build Real Businesses",
  description: "A private network of construction and real estate operators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Starfield />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
