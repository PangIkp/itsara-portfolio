import { Container, Row, Col } from "react-bootstrap";
import actImg1 from "../assets/img/ms.jpg";
import actImg2 from "../assets/img/busi.jpg";
import actImg3 from "../assets/img/twcss.jpg";
import actImg4 from "../assets/img/hackathon.jpg";
import actImg5 from "../assets/img/buminihack.JPG";
import { ActivityCard } from "./ActivityCard"; // นำเข้า ActivityCard

export const Activities = () => {   
  const activities = [
    { title: "Code; Without Barriers Meetup Bangkok", description: "This event was organized by Microsoft (Thailand) in collaboration with the Thai Programmer Association. It provided an opportunity for women in the technology field to meet and share experiences with speakers from Microsoft, LSEG, Coraline, and Women Techmakers Bangkok.", imgUrl: actImg1 },
    { title: "Macro Business Simulation Competition", description: "Participated in the MBS (Macro Business Simulation) competition, which is a cloud-based platform that simulates a business environment and generates financial reports every quarter. This provided an opportunity to learn about management and business simulation.", imgUrl: actImg2 },
    { title: "Code in The Wind #2", description: "Participated in a Tailwind CSS skill competition, aimed at allowing frontend developers to showcase their skills and practice using new tools together while learning valuable techniques from experts.", imgUrl: actImg3 },
    { title: "Chimnovate Hackathon 2022", description: "Participated in the Chimnovate Hackathon 2022, with the challenge: Revitalizing Thailand's Gastrodiplomacy through Building & Scaling Virtual Restaurants in the USA, or Creating a Thai restaurant brand to grow exponentially with technology, while promoting the country's brand and soft power through Thai cuisine.", imgUrl: actImg4 },
    { title: "3rd Place – BU Mini Hackathon 2025", description: "I led the development of the Style Your Cake web application, which secured 3rd place in the competition. Additionally, I participated in a workshop that provided valuable insights into business, further enhancing my skills in both technical and business domains. It was a great learning experience and an excellent opportunity for growth.", imgUrl: actImg5 },

  ];

  return (
    <section className="activity" id="activities">
      <Container>
        <Row>
          <Col className="text-center">
            <h2>Activities</h2>
            <p>The activities presented in this section reflect my continuous engagement and growth in diverse areas of interest. Each activity showcases not only my passion for learning but also my dedication to applying practical skills in real-world scenarios, contributing to both personal and professional development. <br></br>** Please hover at my acivity to see details. **</p>
          </Col>
        </Row>
        <Row className="justify-content-center">
          {activities.map((activity, index) => (
            <Col key={index} xs={12} className="d-flex justify-content-center">
              <ActivityCard
                title={activity.title}
                description={activity.description}
                imgUrl={activity.imgUrl}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};
