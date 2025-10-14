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
      <body className="bg-white text-gray-900">
        {/* Use the reusable Header component */}
        <Header />
        
        <main className="max-w-6xl mx-auto py-20 p-6">{children}</main>

        <footer className="mt-10 p-4 text-center text-sm text-gray-500 border-t">
          &copy; {new Date().getFullYear()} RentFix. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
