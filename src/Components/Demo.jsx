import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Demo = () => {
  const { pageId } = useParams(); // Extract pageId from URL
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState(''); // State for title
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if pageId is '0' and handle it accordingly
    if (pageId === '0') {
      setLoading(false);
      setError(null);
      setContent(null);
      setTitle(''); // Clear title
      return;
    }

    const fetchPageContent = async () => {
      try {
        const response = await axios.get(`https://vyapti.in/public/cms4/public/get_page_content/${pageId}`);
        
        // Log the response to check the structure
        console.log(`Response from API for page_id ${pageId}:`, response.data);
        
        if (response.data && response.data.list && response.data.list.length > 0) {
          setContent(response.data.list[0].content); // Assuming the content is under list[0].content
          setTitle(response.data.list[0].title || 'No Title'); // Assuming the title is under list[0].title
        } else {
          setError('No content found for this page.');
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [pageId]); // Dependency on pageId

  if (error) return <div className="mt-10 text-center text-6xl">{error}</div>;

  return (
    <div className="mt-10 text-center">
      <div className="text-6xl">{title}</div> {/* Display title here */}
      {content && (
        <div
          className="mt-4 text-left"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
};

export default Demo;
