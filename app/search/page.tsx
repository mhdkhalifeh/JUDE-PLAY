import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GameGrid from "./components/GameGrid";
import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        
        {/* Sidebar */}
        <div className="w-[280px] hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <GameGrid />
        </div>

      </div>

      <Footer />
    </main>
  );
}