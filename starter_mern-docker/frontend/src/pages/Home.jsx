import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UpdateAnime from './UpdateAnimeForm'

function Home() {
  const [anime, setAnime] = useState([]);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [selectedAnimeId, setSelectedAnimeId] = useState(null);
  const [updatedAnimeData, setUpdatedAnimeData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch anime data from backend
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/anime`)
      .then((res) => {
        setAnime(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleUpdateFormOpen = (id) => {
    setSelectedAnimeId(id);
    setIsUpdateFormOpen(true);
    // Pre-fill the form with current anime data
    const selectedAnime = anime.find((anim) => anim._id === id);
    setUpdatedAnimeData(selectedAnime);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/anime/${selectedAnimeId}`,
        updatedAnimeData
      );
      const updatedAnime = response.data;
      setAnime((prevAnime) =>
        prevAnime.map((anim) => anim._id === selectedAnimeId ? updatedAnime : anim)
      );
      setIsUpdateFormOpen(false);
      setErrorMessage(""); // Clear any previous errors
      // Display success message or visual feedback
    } catch (error) {
      console.error("Error updating anime:", error);
      setErrorMessage("Failed to update anime. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      // Confirmation dialog (replace with your implementation)
      const confirmed = await confirm(`Are you sure you want to delete this list?`);
      if (!confirmed) return;

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/anime/${id}`);
      setAnime((prevAnime) => prevAnime.filter((anim) => anim._id !== id));
      // Display confirmation message or visual feedback
    } catch (error) {
      console.error("Error deleting anime:", error);
      // Display error message to the user
    }
  };

  return (
    <main className="container">
       <h1 className="heading">Explore</h1>
      <p className="sub_heading">List of Movies to watch</p>

      <ul className="anim_list">
        {anime.length > 0 &&
          anime.map((anim) => (
            <li key={anim._id} className="anime_card">
              <div className="anime_info">
                <h4>{anim.title}</h4>
                <p>{anim.description}</p>
              </div>
               <div className="anime_link">
                
                <button to={anim.link}>Watch</button>
             <br></br>
      
                <button onClick={() => handleDelete(anim._id)}>Delete</button>
              </div>
            </li>
          ))}
      </ul>

     {/* Update form */}



     
      {errorMessage && <p className="error_message">{errorMessage}</p>}

      {anime.length === 0 && (
        <p className="no_result">Oops, No Movies available</p>
      )}
    </main>
  );
}

export default Home;




              