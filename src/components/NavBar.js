import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from '../assets/img/itsara.png';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon4 from '../assets/img/nav-icon4.png';
import { Link, useLocation } from "react-router-dom";

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const isManagePage = location.pathname === "/manage";

  useEffect(() => {
    if (isManagePage) {
      setScrolled(true);
      setActiveLink("");
      return undefined;
    }

    const sections = ["home", "skills", "projects", "certificates", "activities"];

    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      const scrollPosition = window.scrollY + 140;
      let currentSection = "home";

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);

        if (
          section &&
          scrollPosition >= section.offsetTop &&
          scrollPosition < section.offsetTop + section.offsetHeight
        ) {
          currentSection = sectionId;
        }
      });

      setActiveLink(currentSection);
    };

    const onHashChange = () => {
      const hashValue = window.location.hash.replace("#", "");

      if (sections.includes(hashValue)) {
        setActiveLink(hashValue);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [isManagePage]);

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
    setExpanded(false);
  };

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      className={`${scrolled ? "scrolled" : ""} ${isManagePage ? "manage-navbar" : ""}`.trim()}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Logo" style={{height: "38px", width: "600px"}}/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded((prevState) => !prevState)}>
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          {!isManagePage && (
            <Nav className="ms-auto">
              <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
              <Nav.Link href="#skills" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>Skills</Nav.Link>
              <Nav.Link href="#projects" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>Projects</Nav.Link>
              <Nav.Link href="#certificates" className={activeLink === 'certificates' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('certificates')}>Certificates</Nav.Link>
              <Nav.Link href="#activities" className={activeLink === 'activities' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('activities')}>Activities</Nav.Link>

            </Nav>
          )}
          <span className="navbar-text">
            <div className="social-icon">
              {/* <a href="#"><img src={navIcon1} alt="" /></a> */}
              <a href="https://www.linkedin.com/in/itsara-klongklaew-20880635b/" target="_blank" rel="noreferrer"><img src={navIcon1} alt="linkin"/></a>
              <a href="https://github.com/PangIkp" target="_blank" rel="noreferrer"><img src={navIcon4} alt="github"/></a>
            </div>
            {isManagePage ? (
              <Link to="/" onClick={() => setExpanded(false)}>
                <button className="vvd"><span>Back Home</span></button>
              </Link>
            ) : (
              <a href="#connect">
                <button className="vvd"><span>Let’s Connect</span></button>
              </a>
            )}
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
