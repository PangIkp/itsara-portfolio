export const CertificateCard = ({ title, description, imgUrl }) => {
  return (
    <div className="cert-imgbx">
      <img src={imgUrl} alt={title || description || "Certificate"} />
      <div className="cert-txtx">
        <p className="cert-kicker">Certificate</p>
        <h4>{title}</h4>
        <span>{description}</span>
      </div>
    </div>
  )
}
