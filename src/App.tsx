import { Footer, Header } from "@/components/boba";

function App() {

  return (
    <div className="flex flex-col min-h-screen bg-gray-200 dark:bg-dark-gray-600">
      <Header />
      <main className="flex-1 overflow-y-auto p-4">
        <div className="min-h-[calc(100vh-473px)]">

        </div>
      </main>
      <Footer />
    </div>

  );
}

export default App;
