import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { LanguageContext } from "../LanguageContext";

const Initiative = () => {
  const [cards, setCards] = useState([]);
  const [images, setImages] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // Auto play by default
  const sliderRef = useRef(null);
  const cardsPerPage = 4; // Display 4 cards at a time

  const { language } = useContext(LanguageContext); // Access language from context

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://vyapti.in/public/cms4/public/Api/3"
        );
        if (response.status === 200) {
          const data = response.data.menu_data.list;
          const fetchedCards = Object.values(data);
          setCards([...fetchedCards, ...fetchedCards]); // Clone cards to create an infinite loop effect

          // Fetch images based on media_id
          const imageRequests = fetchedCards.map(async (card) => {
            try {
              const imageResponse = await axios.get(
                `https://vyapti.in/public/cms4/public/get_media/${card.media_id}`
              );

              const media_id = card.media_id;
              const media_url = imageResponse.data;

              return { media_id, media_url };
            } catch (error) {
              console.error(
                `Error fetching image for media_id ${card.media_id}:`,
                error
              );
              return { media_id: card.media_id, media_url: null };
            }
          });

          const imageResults = await Promise.all(imageRequests);
          const imageMap = imageResults.reduce(
            (acc, { media_id, media_url }) => {
              acc[media_id] = media_url;
              return acc;
            },
            {}
          );

          setImages(imageMap);
        } else {
          console.error("Failed to fetch card data");
        }
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };

    fetchData();
  }, []);

  let slideInterval;

  // Auto slide functionality
  useEffect(() => {
    if (isPlaying) {
      slideInterval = setInterval(() => {
        handleNext();
      }, 2000); // Change slide every 2 seconds
    }

    return () => clearInterval(slideInterval); // Clear interval when isPlaying changes or component unmounts
  }, [isPlaying]);

  const handleNext = () => {
    if (sliderRef.current) {
      setCurrentPage((prev) => prev + 1);
      sliderRef.current.style.transition = "transform 0.5s ease-in-out";
      sliderRef.current.style.transform = `translateX(-${
        (currentPage + 1) * (100 / cardsPerPage)
      }%)`;

      // If at the last slide, jump to the start
      if (currentPage === cards.length / 2) {
        setTimeout(() => {
          sliderRef.current.style.transition = "none";
          sliderRef.current.style.transform = "translateX(0)";
          setCurrentPage(0);
        }, 500); // Time should match the transition duration
      }
    }
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      if (currentPage === 0) {
        sliderRef.current.style.transition = "none";
        sliderRef.current.style.transform = `translateX(-${
          (cards.length / 2) * (100 / cardsPerPage)
        }%)`;
        setCurrentPage(cards.length / 2 - 1);
        setTimeout(() => {
          sliderRef.current.style.transition = "transform 0.5s ease-in-out";
          sliderRef.current.style.transform = `translateX(-${
            (currentPage - 1) * (100 / cardsPerPage)
          }%)`;
        }, 20);
      } else {
        sliderRef.current.style.transition = "transform 0.5s ease-in-out";
        sliderRef.current.style.transform = `translateX(-${
          (currentPage - 1) * (100 / cardsPerPage)
        }%)`;
        setCurrentPage((prev) => prev - 1);
      }
    }
  };

  return (
    <div className="bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Initiatives</h1>
      <div className="overflow-hidden relative mx-auto max-w-7xl">
        <div
          ref={sliderRef}
          className="flex"
          style={{
            transition: "transform 0.5s ease-in-out",
            transform: `translateX(-${currentPage * (100 / cardsPerPage)}%)`,
          }}
        >
          {cards.map((card, index) => (
            <div
              key={`${card.menu_id}-${index}`}
              className="bg-white border rounded-lg p-4 mx-3 my-5 shadow-lg flex-shrink-0"
              style={{ width: `${100 / cardsPerPage}%` }}
            >
              {images[card.media_id] ? (
                <img
                  src={images[card.media_id]}
                  alt={card.menu_name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-300 mb-4 flex items-center justify-center rounded">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <h2 className="text-lg font-semibold mb-2">
                {language === "English" ? card.menu_name : card.kn_menu_name || card.menu_name}
              </h2>
              <p className="text-sm text-gray-700 mb-2">
                {language === "English" ? card.menu_desc : card.kn_menu_desc || card.menu_desc}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Media ID: {card.media_id}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between max-w-6xl mx-auto mt-8">
        <button
          onClick={handlePrev}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Next
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-green-500 text-white px-6 py-2 rounded mx-2 hover:bg-green-600 transition duration-300"
        >
          {isPlaying ? "Stop" : "Play"}
        </button>
      </div>
    </div>
  );
};

export default Initiative;
