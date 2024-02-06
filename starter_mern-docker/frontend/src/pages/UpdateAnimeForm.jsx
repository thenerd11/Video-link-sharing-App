import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ... other imports

const UpdateAnime = ({ selectedAnimeId, setIsUpdateFormOpen }) => {
  const [updatedAnimeData, setUpdatedAnimeData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch anime data for the selected ID on form open
    const fetchAnimeData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/anime/${selectedAnimeId}`);
        setUpdatedAnimeData(response.data);
      } catch (error) {
        console.error('Error fetching anime data:', error);
        setErrorMessage('Failed to fetch anime data. Please try again later.');
      }
    };

    if (selectedAnimeId) {
      fetchAnimeData();
    }
  }, [selectedAnimeId]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    // Collect and validate form data
    const formData = {
      title: event.target.title.value,
      description: event.target.description.value,
      // ... other fields
    };

    // Perform validation as needed (e.g., using a validation library)

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/anime/${selectedAnimeId}`, formData);

      if (response.data.success) {
        // Update local state and close form
        setUpdatedAnimeData(response.data.data);
        setIsUpdateFormOpen(false);
        // Optionally, trigger a re-render of the anime list to reflect the update
      } else {
        setErrorMessage('Update failed. Please check the error message and try again.');
      }
    } catch (error) {
      console.error('Error updating anime:', error);
      setErrorMessage('An error occurred while updating the anime.');
    }
  };

  return (
    <div className="update_form">
      <form onSubmit={handleUpdate}>
        {/* Form fields with appropriate labels and values pre-filled from updatedAnimeData */}
        <button type="submit">Save</button>
        <button type="button" onClick={() => setIsUpdateFormOpen(false)}>Cancel</button>
        {errorMessage && <p className="error_message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default UpdateAnime;
