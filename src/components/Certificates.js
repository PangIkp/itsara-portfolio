import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { CertificateCard } from "./CertificateCard";
import certImg1 from "../assets/img/chimnovate.png";
import certImg2 from "../assets/img/bapwa.png";
import certImg3 from "../assets/img/business.png";
import certImg4 from "../assets/img/cloud.jpg";
import certImg5 from "../assets/img/certipython.jpg";
import certImg6 from "../assets/img/certpython&mat.jpg";
import certImg7 from "../assets/img/certfirst.jpg";
import certImg8 from "../assets/img/certrapid.jpg";
import certImg9 from "../assets/img/certux.jpg";
import certImg10 from "../assets/img/certservice.jpg";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Certificates = () => {

  const certificates = [
    {
      title: "Mobile Application",
      description: "develop an application for ordering manga books with Net MAUI.",
      imgUrl: certImg1,
    },
    {
      title: "Online Whiteboard",
      description: "serve as a project manager and front - end developer for an online whiteboard project.",
      imgUrl: certImg2,
    },
    {
      title: "Mobile Application",
      description: "developer a food delivery application for milk tea shops.",
      imgUrl: certImg3,
    },
    {
      title: "Web Application",
      description: "develop a 2D homemade cake web application to assess user satisfaction.",
      imgUrl: certImg4,
    },
    {
      title: "Web Application",
      description: "served as project manager in developing the La Ferly Clinic web application to manage data in clinic.",
      imgUrl: certImg5,
    },
    {
      title: "Data Analysis",
      description: "Interned at R&DBI as a Data Analyst and created Adventure work dashboards for presentations to clients.",
      imgUrl: certImg6,
    },
    {
      title: "Data Analysis",
      description: "Interned at R&DBI as a Data Analyst and created Adventure work dashboards for presentations to clients.",
      imgUrl: certImg7,
    },
    {
      title: "Data Analysis",
      description: "Interned at R&DBI as a Data Analyst and created Adventure work dashboards for presentations to clients.",
      imgUrl: certImg8,
    },
    {
      title: "Data Analysis",
      description: "Interned at R&DBI as a Data Analyst and created Adventure work dashboards for presentations to clients.",
      imgUrl: certImg9,
      },
    {
      title: "Data Analysis",
      description: "Interned at R&DBI as a Data Analyst and created Adventure work dashboards for presentations to clients.",
      imgUrl: certImg10,
    },
  ];

  return (
    <section className="certificate" id="certificates">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn": ""}>
                <h2 style={{marginBottom: "20px"}}>Certificates</h2>
                <p>The certificates you see in this section are a testament to my achievements and dedication to learning and skill development. Each certificate I have received has been awarded after rigorous testing and evaluation, with a focus on enhancing the knowledge and skills essential in various fields.</p>
                {/* <Tab.Container id="certificates-tabs" defaultActiveKey="first"> */}
                  {/* <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                    <Nav.Item>
                      <Nav.Link eventKey="first">Tab 1</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">Tab 2</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="third">Tab 3</Nav.Link>
                    </Nav.Item>
                  </Nav> */}
                  {/* <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}> */}
                    {/* <Tab.Pane eventKey="first"> */}
                      <Row>
                        {
                          certificates.map((certificate, index) => {
                            return (
                              <CertificateCard
                                key={index}
                                {...certificate}
                                />
                            )
                          })
                        }
                      </Row>
                    {/* </Tab.Pane> */}
                    {/* <Tab.Pane eventKey="section">
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem explicabo excepturi id illo molestiae blanditiis, eligendi dicta officiis asperiores delectus quasi inventore debitis quo.</p>
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem explicabo excepturi id illo molestiae blanditiis, eligendi dicta officiis asperiores delectus quasi inventore debitis quo.</p>
                    </Tab.Pane> */}
                  {/* </Tab.Content> */}
                {/* </Tab.Container> */}
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      {/* <img className="background-image-right" src={colorSharp2}></img> */}
    </section>
  )
}
