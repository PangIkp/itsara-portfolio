import { Col } from "react-bootstrap";

export const CertificateCard = ({ title, description, imgUrl }) => {
  return (
    <Col size={12} sm={6} md={4}>
      <div className="cert-imgbx">
        <img src={imgUrl} />
      </div>
    </Col>
  )
}