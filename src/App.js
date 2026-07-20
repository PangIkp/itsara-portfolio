import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Certificates } from './components/Certificates';
import { Activities } from './components/Activities';
import { ContentManager } from "./components/ContentManager";
import { logoutAdmin } from "./utils/contentApi";

function HomePage() {
  return (
    <>
      <NavBar/>
      <Banner/>
      <Skills/>
      <Projects/>
      <Certificates/>
      <Activities/>
      <Contact/>
      <Footer/>
    </>
  );
}

function ManagePage() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  async function handleManageLogout() {
    await logoutAdmin().catch(() => null);
    setIsAdminAuthenticated(false);
  }

  return (
    <div className="manage-page">
      <NavBar
        isAdminAuthenticated={isAdminAuthenticated}
        onManageLogout={handleManageLogout}
      />
      <ContentManager
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminAuthChange={setIsAdminAuthenticated}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/manage" element={<ManagePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
