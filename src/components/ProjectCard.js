import { Col } from "react-bootstrap";

export const ProjectCard = ({ title, description, imgUrl, tools, link }) => {
  const cardContent = (
    <>
      <img src={imgUrl} alt={title} />
      <div className="proj-txtx">
        <h4>{title}</h4>
        <span>{description}</span>
        <h3>{tools}</h3>
      </div>
    </>
  );

  return (
    <Col size={12} sm={6} md={4}>
      <div className="proj-imgbx">
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            {cardContent}
          </a>
        ) : (
          <div>{cardContent}</div>
        )}
      </div>
    </Col>
  )
}
