import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import profile from "../assets/img/profile3.jpg";
import { ArrowRightCircle } from "react-bootstrap-icons";
import { Nav } from "react-bootstrap";
import "animate.css";
import TrackVisibility from "react-on-screen";
import "tailwindcss/tailwind.css";

const TO_ROTATE = ["Web Developer", "Data Analyst", "UX/UI Designer"];

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const period = 2000;

  useEffect(() => {
    const tick = () => {
      let i = loopNum % TO_ROTATE.length;
      let fullText = TO_ROTATE[i];
      let updatedText = isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1);

      setText(updatedText);

      if (isDeleting) {
        setDelta((prevDelta) => prevDelta / 2);
      }

      if (!isDeleting && updatedText === fullText) {
        setIsDeleting(true);
        setDelta(period);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setLoopNum((prevLoopNum) => prevLoopNum + 1);
        setDelta(500);
      }
    };

    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [delta, text, isDeleting, loopNum]);

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="aligh-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  <span className="tagline text-white">
                    Welcome to my Portfolio
                  </span>
                  <h1>
                    {`I'm Itsara`}{" "}
                    <span
                      className="txt-rotate"
                      dataPeriod="1000"
                      data-rotate='[ "Web Developer", "Data Analyst", "UX/UI Designer" ]'
                    >
                      <span className="wrap">{text}</span>
                    </span>
                  </h1>
                  <p>
                    Hi there! 👋 I’m Itsara, but you can call me Pangjee. I’m a
                    curious and enthusiastic learner, always excited to dive
                    into new experiences. I thrive in environments where
                    everyone is passionate about what they do, as it sparks both
                    personal and professional growth. Right now, I’m immersing
                    myself in the world of web development and am looking for a
                    team that fosters hands-on learning, collaboration, and
                    continuous self-improvement.
                  </p>
                  <Nav.Link href="#connect">
                    <button onClick={() => console.log("connect")}>
                      Let’s Connect <ArrowRightCircle size={25} />
                    </button>
                  </Nav.Link>
                </div>
              )}
            </TrackVisibility>
          </Col>
          <Col xs={10} md={7} xl={5} className="profile-session">
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__zoomIn" : ""
                  }
                >
                  <img
                    src={profile}
                    alt="Header Img"
                    style={{ marginLeft: "90px", width: "350px" }}
                  />
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
