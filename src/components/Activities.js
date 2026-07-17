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
            <p className="section-lead">Activities that show my learning journey, teamwork, and hands-on experience beyond the classroom. <br></br>** Please hover at my acivity to see details. **</p>
            {isLoading && <p>Loading activities...</p>}
            {!isLoading && errorMessage && <p className="danger">{errorMessage}</p>}
            {!isLoading && !errorMessage && activities.length === 0 && (
              <p>No activities added yet.</p>
            )}
          </Col>
        </Row>
        <Row className="activity-container justify-content-center">
          {!isLoading && !errorMessage && activities.map((activity) => (
            <Col key={activity.id} xs={12} xl={10} className="card-grid-item activity-grid-item">
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
