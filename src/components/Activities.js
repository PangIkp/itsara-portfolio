import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ActivityCard } from "./ActivityCard";
import { fetchContentCollection } from "../utils/contentApi";

export const Activities = () => {   
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadActivities() {
      try {
        const response = await fetchContentCollection("activities");

        if (!isMounted) {
          return;
        }

        setActivities(response);
        setErrorMessage("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage("Unable to load activities right now.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadActivities();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="activity" id="activities">
      <Container>
        <Row>
          <Col className="text-center">
            <h2 className="section-heading">Activities</h2>
            <p className="section-lead">The activities presented in this section reflect my continuous engagement and growth in diverse areas of interest. Each activity showcases not only my passion for learning but also my dedication to applying practical skills in real-world scenarios, contributing to both personal and professional development. <br></br>** Please hover at my acivity to see details. **</p>
            {isLoading && <p>Loading activities...</p>}
            {!isLoading && errorMessage && <p className="danger">{errorMessage}</p>}
            {!isLoading && !errorMessage && activities.length === 0 && (
              <p>No activities added yet.</p>
            )}
          </Col>
        </Row>
        <Row className="activity-container justify-content-center">
          {!isLoading && !errorMessage && activities.map((activity) => (
            <Col key={activity.id} xs={12} sm={6} lg={4} className="card-grid-item">
              <ActivityCard
                title={activity.title}
                description={activity.description}
                imgUrl={activity.imageUrl}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};
