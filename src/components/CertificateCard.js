export const CertificateCard = ({ title, description, imgUrl }) => {
  return (
    <div className="cert-imgbx cert-imgbx-plain">
      <img src={imgUrl} alt={title || description || "Certificate"} />
    </div>
  )
}
