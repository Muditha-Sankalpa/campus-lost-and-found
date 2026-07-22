import React from "react";

const IMAGE_BASE = import.meta.env.REACT_APP_IMAGE_URL || "http://localhost:5000";

const ItemCard = ({ item, showModeration, onEdit, onDelete, showActions }) => {
  const coverImage = item.images && item.images.length > 0 ? `${IMAGE_BASE}${item.images[0]}` : null;

  return (
    <div className="card">
      {coverImage && (
        <img
          src={coverImage}
          alt={item.title}
          style={{ width: "100%", height: 140, objectFit: "cover", marginBottom: 8 }}
        />
      )}
      <h3 style={{ margin: "4px 0" }}>{item.title}</h3>
      <p style={{ margin: "4px 0", fontSize: 13 }}>{item.description}</p>
      <p style={{ margin: "4px 0", fontSize: 13 }}>
        <b>Category:</b> {item.category} | <b>Location:</b> {item.location}
      </p>
      <p style={{ margin: "4px 0", fontSize: 13 }}>
        <b>Status:</b> {item.status}
      </p>

      {showModeration && (
        <p className={`status-${item.moderationStatus}`} style={{ margin: "4px 0", fontSize: 13 }}>
          <b>Moderation:</b> {item.moderationStatus}
          {item.moderationNote ? ` — ${item.moderationNote}` : ""}
        </p>
      )}

      {showActions && (
        <div style={{ marginTop: 8 }}>
          <button onClick={() => onEdit(item)}>Edit</button>{" "}
          <button onClick={() => onDelete(item._id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
