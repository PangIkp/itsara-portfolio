export const ActivityCard = ({ title, description, imgUrl }) => {
    return (
      <div className="act-imgbx">
        <img src={imgUrl} alt={title} />
        <div className="act-txtx">
          <p className="act-kicker">Activity</p>
          <h4>{title}</h4>
          <span>{description}</span>
        </div>
      </div>
    )
}
