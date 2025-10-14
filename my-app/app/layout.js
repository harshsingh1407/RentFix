// app/layout.js
import "./globals.css";
import Header from "../components/Header"; // ← import your Header component

export const metadata = {
  title: "Rental Complaint App",
  description: "Manage rental issues between tenants and landlords",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        
        {/* Header - Stays fixed */}
        <Header />
        
        {/* Main Content - Pushes the footer to the bottom */}
        <main className="flex-grow max-w-7xl mx-auto w-full py-10 px-4 sm:px-6 lg:px-8">
            {children}
        </main>

        {/* Footer - Remains at the bottom */}
        <footer className="mt-auto p-4 text-center text-sm text-gray-500 border-t bg-white">
          &copy; {new Date().getFullYear()} RentFix. All rights reserved.
        </footer>
      </body>
    </html>
  );
}