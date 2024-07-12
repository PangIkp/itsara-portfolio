import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from '../assets/img/itsara.png';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';
import navIcon3 from '../assets/img/nav-icon3.svg';
import { HashLink } from 'react-router-hash-link';
import {
  BrowserRouter as Router
} from "react-router-dom";

export const NavBar = () => {

  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }

  return (
    <Router>
      <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
        <Container>
          <Navbar.Brand href="/">
            <img src={logo} alt="Logo" style={{height: "38px", width: "600px"}}/>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
              <Nav.Link href="#skills" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>Skills</Nav.Link>
              <Nav.Link href="#projects" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>Projects</Nav.Link>
              <Nav.Link href="#certificates" className={activeLink === 'certificates' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('certificates')}>Certificates</Nav.Link>

            </Nav>
            <span className="navbar-text">
              <div className="social-icon">
                {/* <a href="#"><img src={navIcon1} alt="" /></a> */}
                <a href="https://www.facebook.com/panggylovely/?locale=th_TH" target="_blank"><img src={navIcon2} alt="" /></a>
                <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Fitsara_ikp%3Figsh%3DeWV1bXRtd2NvZm8w%26utm_source%3Dqr%26fbclid%3DIwZXh0bgNhZW0CMTAAAR2kW6dUWHmg2lWubflcDtUHdb4w-5PKBGlhra2WAewh8DXIQOTUVFUA5Wc_aem_gLJbY7T2LdOUWu_0oXdVgw&h=AT3igexX-HgVRG_Jbui3jQiOuKCRRfI_kyXwb_uFAkix36YffkcxvOz1fms2uqiBNh-k8TaCTaSgwxQJ3cbDa_7tepladgG4eodse_8zQkSE7EZPIDbW6IQEgqNeLq5Ji7OGr8fio24" target="_blank"><img src={navIcon3} alt="" /></a>
              </div>
              <HashLink to='#connect'>
                <button className="vvd"><span>Let’s Connect</span></button>
              </HashLink>
            </span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Router>
  )
}
