import { useEffect, useState } from "react";
import meter1 from "../assets/img/developer.png";
import meter2 from "../assets/img/uxui.png";
import meter3 from "../assets/img/data.png";
import meter4 from "../assets/img/critical.png";
import meter5 from "../assets/img/marketing.png";
import meter6 from "../assets/img/management.png";
import meter7 from "../assets/img/team.png";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import colorSharp from "../assets/img/color-sharp.png";
import { fetchContentCollection } from "../utils/contentApi";

const defaultTechStackIcons = [
  { id: "skill-001", name: "Python", imageUrl: "/images/skills/python.png", width: 30, height: 30 },
  { id: "skill-002", name: "Java", imageUrl: "/images/skills/java.webp", width: 35, height: 35 },
  { id: "skill-003", name: "C#", imageUrl: "/images/skills/csharp.png", width: 30, height: 30 },
  { id: "skill-004", name: ".NET", imageUrl: "/images/skills/net.png", width: 27, height: 27 },
  { id: "skill-005", name: "HTML", imageUrl: "/images/skills/html.png", width: 30, height: 30 },
  { id: "skill-006", name: "TypeScript", imageUrl: "/images/skills/type.webp", width: 27, height: 27 },
  { id: "skill-007", name: "SQL", imageUrl: "/images/skills/sql.png", width: 30, height: 30 },
  { id: "skill-008", name: "Tailwind CSS", imageUrl: "/images/skills/tailwind.png", width: 27, height: 27 },
  { id: "skill-009", name: "React", imageUrl: "/images/skills/react.png", width: 27, height: 27 },
  { id: "skill-010", name: "Figma", imageUrl: "/images/skills/figma.png", width: 27, height: 27 },
  { id: "skill-011", name: "Power BI", imageUrl: "/images/skills/powerbi.png", width: 27, height: 27 },
];

export const Skills = () => {
  const [skills, setSkills] = useState(defaultTechStackIcons);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    let isMounted = true;

    async function loadSkills() {
      try {
        const response = await fetchContentCollection("skills");

        if (!isMounted) {
          return;
        }

        setSkills(response.length > 0 ? response : defaultTechStackIcons);
        setErrorMessage("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setSkills(defaultTechStackIcons);
        setErrorMessage("");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="skill" id="skills">
      <div className="container">
        <div className="row">
          <div className="">
            <div className="skill-bx wow zoomIn">
              <h2 className="section-heading">Skills</h2>
              <div className="col-12" style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "20px",
                    marginTop: "10px",
                    columnGap: "10px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {skills.map((icon) => (
                    <img
                      key={icon.id}
                      src={icon.imageUrl}
                      alt={icon.name}
                      style={{ width: `${icon.width || 27}px`, height: `${icon.height || 27}px` }}
                    />
                  ))}
                </div>
              </div>
              {isLoading && <p>Loading skills...</p>}
              {!isLoading && errorMessage && <p className="danger">{errorMessage}</p>}

              <Carousel
                responsive={responsive}
                infinite={true}
                className="owl-carousel owl-theme"
              >
                <div className="item">
                  <img src={meter1} alt="web developer" />
                  <h5>Web Development</h5>
                </div>
                <div className="item">
                  <img src={meter2} alt="UX/UI Designer" />
                  <h5>UX/UI Designer</h5>
                </div>
                <div className="item">
                  <img src={meter3} alt="Data Analyst" />
                  <h5>Data Analyst</h5>
                </div>
                <div className="item">
                  <img src={meter4} alt="Critical Thinking" />
                  <h5>Critical Thinking</h5>
                </div>
                <div className="item">
                  <img src={meter5} alt="Marketing" />
                  <h5>Marketing</h5>
                </div>
                <div className="item">
                  <img src={meter6} alt="Project Management" />
                  <h5>Project Management</h5>
                </div>
                <div className="item">
                  <img src={meter7} alt="Teamwork" />
                  <h5>Teamwork</h5>
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <img className="background-image-left" src={colorSharp} alt="Background decoration" />
    </section>
  );
};
