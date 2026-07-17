import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { CertificateCard } from "./CertificateCard";
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import { fetchContentCollection } from "../utils/contentApi";

export const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCertificates() {
      try {
        const response = await fetchContentCollection("certificates");

        if (!isMounted) {
          return;
        }

        setCertificates(response);
        setErrorMessage("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage("Unable to load certificates right now.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCertificates();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="certificate" id="certificates">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn": ""}>
                <h2 className="section-heading">Certificates</h2>
                <p className="section-lead">The certificates you see in this section are a testament to my achievements and dedication to learning and skill development. Each certificate I have received has been awarded after rigorous testing and evaluation, with a focus on enhancing the knowledge and skills essential in various fields.</p>
                {isLoading && <p>Loading certificates...</p>}
                {!isLoading && errorMessage && <p className="danger">{errorMessage}</p>}
                {!isLoading && !errorMessage && certificates.length === 0 && (
                  <p>No certificates added yet.</p>
                )}
                <Row className="certificate-container">
                  {
                    !isLoading && !errorMessage && certificates.map((certificate) => {
                      return (
                        <Col key={certificate.id} xs={12} sm={6} lg={4} className="card-grid-item">
                          <CertificateCard
                            title={certificate.title}
                            description={certificate.description}
                            imgUrl={certificate.imageUrl}
                          />
                        </Col>
                      )
                    })
                  }
                </Row>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
