import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const Home = () => {
  const [cards, setCards] = useState([]);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // Auto play by default

  const sliderRef = useRef(null);
  const cardsPerPage = 1; // Show one card at a time

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch card data
        const cardResponse = await axios.get('https://vyapti.in/public/cms4/public/Api/17');
        if (cardResponse.status === 200) {
          const data = cardResponse.data.menu_data.list;
          const fetchedCards = Object.values(data);

          // Fetch images based on media_id
          const imageRequests = fetchedCards.map(async (card) => {
            try {
              const imageResponse = await axios.get(
                `https://vyapti.in/public/cms4/public/get_media/${card.media_id}`
              );
              return { media_id: card.media_id, media_url: imageResponse.data };
            } catch (error) {
              console.error(`Error fetching image for media_id ${card.media_id}:`, error);
              return { media_id: card.media_id, media_url: null };
            }
          });

          const imageResults = await Promise.all(imageRequests);
          const imageMap = imageResults.reduce((acc, { media_id, media_url }) => {
            acc[media_id] = media_url;
            return acc;
          }, {});

          setCards(fetchedCards);
          setImages(imageMap);
        } else {
          throw new Error('Failed to fetch card data');
        }
      } catch (error) {
        console.error('Error fetching card data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let slideInterval;

    if (isPlaying) {
      slideInterval = setInterval(() => {
        handleNext();
      }, 3000); // Change slide every 3 seconds
    }

    return () => clearInterval(slideInterval); // Clear interval on component unmount or when isPlaying changes
  }, [isPlaying, currentPage]);

  const handleNext = () => {
    setCurrentPage((prev) => {
      const nextPage = (prev + 1) % cards.length;
      if (sliderRef.current) {
        sliderRef.current.style.transition = "transform 0.5s ease-in-out";
        sliderRef.current.style.transform = `translateX(-${nextPage * (100 / cardsPerPage)}%)`;
      }
      return nextPage;
    });
  };

  const handlePrev = () => {
    setCurrentPage((prev) => {
      const prevPage = prev === 0 ? cards.length - 1 : prev - 1;
      if (sliderRef.current) {
        sliderRef.current.style.transition = "transform 0.5s ease-in-out";
        sliderRef.current.style.transform = `translateX(-${prevPage * (100 / cardsPerPage)}%)`;
      }
      return prevPage;
    });
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Home</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="relative overflow-hidden mx-auto max-w-full">
          <div
            ref={sliderRef}
            className="flex"
            style={{
              width: `${cards.length * 100}%`, // Set width based on number of cards
              transition: "transform 0.5s ease-in-out",
              transform: `translateX(-${currentPage * (100 / cardsPerPage)}%)`,
            }}
          >
            {cards.map((card) => (
              <div
                key={card.menu_id}
                className="flex-shrink-0"
                style={{ width: `${100 / cardsPerPage}%` }}
              >
                {images[card.media_id] ? (
                  <img
                    src={images[card.media_id]}
                    alt={card.menu_name}
                    className="w-full"
                    style={{ height: '70vh', objectFit: 'cover' }} // Adjust height as needed
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ height: '70vh', backgroundColor: '#e0e0e0' }} // Placeholder color
                  >
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          >
            &lt;
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          >
            &gt;
          </button>
          <div className="flex justify-center mt-4">
            <button
              onClick={togglePlay}
              className="bg-green-500 text-white px-6 py-2 rounded mx-2 hover:bg-green-600 transition duration-300"
            >
              {isPlaying ? "Stop" : "Play"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
