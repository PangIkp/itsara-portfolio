import { Col } from "react-bootstrap";

export const ActivityCard = ({ title, description, imgUrl }) => {
    return (
      <Col xs={12} className="d-flex justify-content-center">
        <div className="act-imgbx">
          <img src={imgUrl} alt={title} />
          <div className="act-txtx">
            <h4>{title}</h4>
            <span>{description}</span>
          </div>
          
        </div>
      </Col>
    )
}
