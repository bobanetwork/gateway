import { Footer, Header } from "@/components/boba";
import { LayoutBackground } from "@/components/boba/LayoutBackground";
import { Outlet } from "react-router-dom";

function Home() {

  return (
    <div className="relative bg-gray-50 dark:bg-dark-gray-600 min-h-screen">
      <LayoutBackground />
      <div className="relative flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto px-2 py-4 md:py-12 md:px-12 w-full">
          <div className="min-h-[calc(100vh-473px)]">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
