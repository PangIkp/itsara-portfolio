import { useEffect, useState } from "react";
import { Container, Row, Col, Tab} from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import { fetchContentCollection } from "../utils/contentApi";

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        const response = await fetchContentCollection("projects");

        if (!isMounted) {
          return;
        }

        setProjects(response);
        setErrorMessage("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage("Unable to load projects right now.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn": ""}>
                <h2 className="section-heading">Projects</h2>
                <p className="section-lead">These are all the projects I worked on during studies and internships. These projects not only enhanced my technical skills but also gave me a deeper understanding of teamwork, planning, time management, and communication with team members and users. I am confident that these experiences will be immensely beneficial for my future career. <br></br>** Please hover at my project to see details. **</p>
                <Tab.Container id="projects-tabs" defaultActiveKey="first">
                  <Row className="project-container">
                    {isLoading && <p>Loading projects...</p>}
                    {!isLoading && errorMessage && <p className="danger">{errorMessage}</p>}
                    {!isLoading && !errorMessage && projects.length === 0 && (
                      <p>No projects added yet.</p>
                    )}
                    {!isLoading && !errorMessage && projects.map((project) => {
                      return (
                        <ProjectCard
                          key={project.id}
                          title={project.title}
                          description={project.description}
                          imgUrl={project.imageUrl}
                          tools={project.tools}
                          link={project.link}
                        />
                      )
                    })}
                  </Row>
                </Tab.Container>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2} alt="Background decoration"></img>
    </section>
  )
}
