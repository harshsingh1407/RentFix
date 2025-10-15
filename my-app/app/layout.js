import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "RentFix - Tenant and Landlord Issue Management",
  description: "Manage rental issues between tenants and landlords",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto w-full py-10 px-4 sm:px-6 lg:px-8">
            {children}
        </main>
        <footer className="mt-auto bg-gray-800 text-white py-6 border-t border-gray-700 text-sm shadow-inner">
    <div className="container mx-auto px-4 text-center">
        <p className="mb-3 text-gray-300 flex flex-col space-y-3 justify-center items-center sm:flex-row sm:space-y-0 sm:space-x-6">
            <span className="text-base font-bold text-white tracking-wide transition duration-300 transform hover:scale-105">
                Harsh Praveen Singh
            </span>
            <a 
                href="https://github.com/harshsingh1407" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-base font-semibold text-white transition duration-300 transform hover:scale-105"
                aria-label="GitHub Profile"
            >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.832 9.504.5.092.682-.217.682-.483 0-.237-.008-.884-.015-1.745-2.785.602-3.37-.168-3.37-.168-.454-1.157-1.11-1.474-1.11-1.474-.908-.619.069-.606.069-.606 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.903.829.092-.64.357-1.088.644-1.334-2.22-.251-4.555-1.116-4.555-4.94 0-1.091.39-1.984 1.029-2.684-.103-.251-.446-1.272.098-2.642 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.7.11 2.5.321 1.91-1.294 2.75-1.026 2.75-1.026.546 1.37.202 2.39.098 2.642.64.7 1.029 1.593 1.029 2.684 0 3.832-2.339 4.681-4.566 4.92.359.313.674.921.674 1.856 0 1.334-.012 2.41-.012 2.748 0 .267.18.577.688.484C18.137 20.218 21 16.467 21 12.017 21 6.484 16.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span>GitHub</span>
            </a>
            <a 
                href="https://www.linkedin.com/in/harshsingh1407/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-base font-semibold text-white transition duration-300 transform hover:scale-105"
                aria-label="LinkedIn Profile"
            >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V8h3v11zM6.5 6.73A1.73 1.73 0 015 5a1.73 1.73 0 013.46 0 1.73 1.73 0 01-1.96 1.73zM20 19h-3v-5.6c0-1.3-.23-1.54-1.22-1.54-.95 0-1.13.73-1.54V19h-3V8h3v1.65c.44-.84 1.6-1.54 3.03-1.54 2.19 0 3.84 1.48 3.84 4.63V19z" />
                </svg>
                <span>LinkedIn</span>
            </a>
            
        </p>

        <p className="text-gray-500 mt-2 text-xs">
            &copy; {new Date().getFullYear()} RentFix. All rights reserved.
        </p>
    </div>
</footer>
      </body>
    </html>
  );
}