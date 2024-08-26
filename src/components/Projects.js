import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import projImg1 from "../assets/img/animezone.png";
import projImg2 from "../assets/img/inkinspire.png";
import projImg3 from "../assets/img/mackicha.png";
import projImg4 from "../assets/img/web.png";
import projImg5 from "../assets/img/laferly.png";
import projImg6 from "../assets/img/adventure.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Projects = () => {

  const projects = [
    {
      title: "Mobile Application",
      description: "develop an application for ordering manga books with Net MAUI.",
      imgUrl: projImg1,
    },
    {
      title: "Online Whiteboard",
      description: "serve as a project manager and front - end developer for an online whiteboard project.",
      imgUrl: projImg2,
    },
    {
      title: "Mobile Application",
      description: "developer a food delivery application for milk tea shops.",
      imgUrl: projImg3,
    },
    {
      title: "Web Application",
      description: "develop a 2D homemade cake web application to assess user satisfaction.",
      imgUrl: projImg4,
    },
    {
      title: "Web Application",
      description: "served as project manager in developing the La Ferly Clinic web application to manage data in clinic.",
      imgUrl: projImg5,
    },
    {
      title: "Data Analysis",
      description: "Interned at R&DBI as a Data Analyst and created Adventure work dashboards for presentations to clients.",
      imgUrl: projImg6,
    },
  ];

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn": ""}>
                <h2 style={{marginBottom: "20px"}}>Projects</h2>
                <p>These are all the projects I worked on during studies and internships. These projects not only enhanced my technical skills but also gave me a deeper understanding of teamwork, planning, time management, and communication with team members and users. I am confident that these experiences will be immensely beneficial for my future career.</p>
                <Tab.Container id="projects-tabs" defaultActiveKey="first">
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
                      <Row className="project-container">
                        {
                          projects.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                {...project}
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
                </Tab.Container>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2}></img>
    </section>
  )
}
