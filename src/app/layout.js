import { AppContextProvider } from "@/contexts/AppContext";
import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Ai-Survey",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className='h-full w-full bg-gray-100 overflow-y-auto'
      >
        <AppContextProvider>
          <Header />
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
