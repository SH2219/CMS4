import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AboutUs = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with a different proxy if needed
        const response = await axios.get('https://ims.ksrtc.in/itbt_startup/public/Api/1');


        setData(response.data);
        console.log('Fetched data:', response.data);
      } catch (error) {
        setError(error);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>About Us</h1>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        !error && <p>Loading data...</p>
      )}
    </div>
  );
};

export default AboutUs;
