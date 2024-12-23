import { AppContextProvider } from "@/context/AppContext";
import "./globals.css";
import Header from "@/components/Header";
import { AuthContextProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Ai-Survey",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className='h-dvh w-full bg-gray-100 relative'
      >
        <AppContextProvider>
          <AuthContextProvider>
            <Toaster position="top-center" />
            {children}
          </AuthContextProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
