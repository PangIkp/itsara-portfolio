import { Col } from "react-bootstrap";

export const ProjectCard = ({ title, description, imgUrl, tools, link }) => {
  const cardContent = (
    <>
      <img src={imgUrl} alt={title} />
      <div className="proj-txtx">
        <h4>{title}</h4>
        <span>{description}</span>
        {tools && <h3>{tools}</h3>}
      </div>
    </>
  );

  return (
    <Col size={12} sm={6} lg={4} className="card-grid-item">
      <div className={`proj-imgbx${link ? " proj-imgbx-linked" : ""}`}>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="proj-card-link"
            aria-label={`${title} opens project website in a new tab`}
          >
            <span className="proj-link-tooltip">Open project website</span>
            {cardContent}
          </a>
        ) : (
          <div className="proj-card-link">{cardContent}</div>
        )}
      </div>
    </Col>
  )
}
