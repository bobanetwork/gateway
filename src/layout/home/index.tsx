import { Footer, Header } from "@/components/boba";
import { Outlet } from "react-router-dom";

function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-gray-600">
      <Header />
      <main className="flex-1 overflow-y-auto py-12 px-12 w-full">
        <div className="min-h-[calc(100vh-473px)]">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
