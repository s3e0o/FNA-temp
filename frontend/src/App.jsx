import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50 pt-20">
        <Navbar />
        <Footer />
      </div>
    </>
  );
}

export default App;