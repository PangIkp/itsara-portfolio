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
              <div>
                <h2 className="section-heading">Certificates</h2>
                <p className="section-lead">Certificates that reflect my learning progress and continued focus on building practical skills.</p>
                {isLoading && <p>Loading certificates...</p>}
                {!isLoading && errorMessage && <p className="danger">{errorMessage}</p>}
                {!isLoading && !errorMessage && certificates.length === 0 && (
                  <p>No certificates added yet.</p>
                )}
                <Row className="certificate-container content-scroll-grid certificate-scroll-grid">
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
