import React from 'react';

const TestImages = () => {
  const testUrls = [
    'https://vyapti.in/public/cms4/public/uploads/media_to_upload1723123243.png',
    'https://vyapti.in/public/cms4/public/uploads/media_to_upload1723122241.png'
  ];

  return (
    <div>
      <h1>Test Images</h1>
      <div className="flex flex-wrap justify-center">
        {testUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Test Media ${index + 1}`}
            className="h-48 w-auto object-cover border rounded shadow-md"
          />
        ))}
      </div>
    </div>
  );
};

export default TestImages;
