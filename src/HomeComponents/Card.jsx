// Card.jsx
import React from 'react';

const Card = ({ menu_id, menu_name, menu_category_name, media_id }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <img
        src={`YOUR_MEDIA_URL/${media_id}`}  // Replace with your actual media URL
        alt={menu_name}
        className="mb-4 w-full h-48 object-cover rounded-lg"
      />
      <h3 className="text-lg font-semibold mb-2">{menu_name}</h3>
      <p className="text-gray-700">{menu_category_name}</p>
    </div>
  );
};

export default Card;
