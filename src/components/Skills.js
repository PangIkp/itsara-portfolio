import { Container, Row, Col } from "react-bootstrap";
import meter1 from "../assets/img/developer.png";
import meter2 from "../assets/img/uxui.png";
import meter3 from "../assets/img/data.png";
import meter4 from "../assets/img/critical.png";
import meter5 from "../assets/img/marketing.png";
import meter6 from "../assets/img/management.png";
import meter7 from "../assets/img/team.png";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import arrow1 from "../assets/img/arrow1.svg";
import arrow2 from "../assets/img/arrow2.svg";
import colorSharp from "../assets/img/color-sharp.png";

export const Skills = () => {
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

  return (
    <section className="skill" id="skills">
      <div className="container">
        <div className="row">
          <div className="">
            <div className="skill-bx wow zoomIn">
              <h2>Skills</h2>
              <div className="col-12" style={{display: "flex", justifyContent: "center", alignContent: "",}}>
                <div style={{display: "flex", marginBottom: "20px", marginTop: "10px", columnGap: "10px", flexWrap: "wrap", justifyContent: "center"}}>
           
                    <img
                      src={require("../assets/img/python.png")}
                      alt="Python"
                      style={{ height: "30px", width: "30px"}}
                    />
                
                    <img
                      src={require("../assets/img/java.webp")}
                      alt="Java"
                      style={{ height: "35px", width: "35px" }}
                    />
                  
                    <img
                      src={require("../assets/img/csharp.png")}
                      alt="C#"
                      style={{ height: "30px", width: "30px" }}
                    />
                 
                    <img
                      src={require("../assets/img/net.png")}
                      alt=".Net"
                      style={{ height: "27px", width: "27px" }}
                    />
                 
                    <img
                      src={require("../assets/img/html.png")}
                      alt="Html"
                      style={{ height: "30px", width: "30px" }}
                    />
                 
                    <img
                      src={require("../assets/img/type.webp")}
                      alt="TypeScript"
                      style={{ height: "27px", width: "27px" }}
                    />
                 
                    <img
                      src={require("../assets/img/sql.png")}
                      alt="SQL"
                      style={{ height: "30px", width: "30px" }}
                    />
                
                    <img
                      src={require("../assets/img/tailwind.png")}
                      alt="TailwindCSS"
                      style={{ height: "27px", width: "27px" }}
                    />
                
                    <img
                      src={require("../assets/img/react.png")}
                      alt="React"
                      style={{ height: "27px", width: "27px" }}
                    />
                
                    <img
                      src={require("../assets/img/figma.png")}
                      alt="Figma"
                      style={{ height: "27px", width: "27px" }}
                    />
                 
                    <img
                      src={require("../assets/img/powerbi.png")}
                      alt="PowerBi"
                      style={{ height: "27px", width: "27px" }}
                    />
                 
                </div>
              </div>

              <Carousel
                responsive={responsive}
                infinite={true}
                className="owl-carousel owl-theme"
              >
                <div className="item">
                  <img src={meter1} alt="web developer"  />
                  <h5>Web Development</h5>
                </div>
                <div className="item">
                  <img src={meter2} alt="UX/UI Designe" />
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
      <img className="background-image-left" src={colorSharp} alt="Image" />
    </section>
  );
};
