import { useEffect, useState } from "react";
import { Container, Row, Col, Tab } from "react-bootstrap";
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
              <div>
                <h2 className="section-heading">Projects</h2>
                <p className="section-lead">Projects I built during my studies and internships, highlighting both technical skills and real teamwork experience. <br></br>** Please hover at my project to see details. **</p>
                <Tab.Container id="projects-tabs" defaultActiveKey="first">
                  <Row className="project-container content-scroll-grid project-scroll-grid">
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
