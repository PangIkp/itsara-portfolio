import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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
  return (
    <div className="manage-page">
      <NavBar/>
      <ContentManager/>
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
