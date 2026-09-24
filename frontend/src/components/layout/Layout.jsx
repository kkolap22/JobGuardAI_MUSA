import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900">
      <Header />

      <main className="min-h-[calc(100vh-160px)]">
        {children}
      </main>

      <Footer />
    </div>
  );
}