import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./movie-view.scss";
import Button from "react-bootstrap/Button";
import { ProfileView } from "../profile-view/profile-view";

export const MovieView = ({ user, token, movies, setUser }) => {
  const { movieId } = useParams();
  const [Favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (user?.Favorite?.length && movieId) {
      setFavorite(user.Favorite.includes(movieId));
    }
    // const isFavorited = user.Favorite.includes(movieId);
    // setFavorite(isFavorited);
  }, [user.Favorite, movieId]);

  const addFavorite = () => {
    fetch(
      `https://movieapi-me1u.onrender.com/users/${user.Username}/movies/${movieId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setFavorite(true);
        user.Favorite.push(movieId);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(user);
      });
  };

  const removeFavorite = () => {
    fetch(
      `https://movieapi-me1u.onrender.com/users/${user.Username}/movies/${movieId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setFavorite(false);
        user.Favorite = user.Favorite.filter((id) => id !== movieId);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(user);
      });
  };

  const movie = movies.find((movie) => movie.id === movieId);

  return (
    <div>
      <div>
        <span>
          <img src={movie.ImagePath} width="30%" />
        </span>
      </div>

      <div>
        <span>Title: </span>
        <span> {movie.Title} </span>
      </div>

      <div>
        <span>Description: </span>
        <span> {movie.Description} </span>
      </div>

      <div>
        <span>Genre: </span>
        <span> {movie.Genre} </span>
      </div>

      <div>
        <span>Director: </span>
        <span> {movie.Director} </span>
      </div>

      <div>
        <span>Featured: </span>
        <span> {movie.Featured} </span>
      </div>

      {Favorite ? (
        <Button onClick={removeFavorite}>Remove from favourite movies</Button>
      ) : (
        <Button onClick={addFavorite}>Add to my favorite movies</Button>
      )}

      <Link to={`/`}>
        <Button>Back</Button>
      </Link>
    </div>
  );
};