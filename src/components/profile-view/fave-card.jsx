import React from "react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { XCircle } from "react-bootstrap-icons";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const FaveCard = ({ movie, myuser, storedToken, updateUser, user}) => {
    const { movieId } = useParams();
    const [isFavorite, setIsFavorite] = useState((movie.id)); 
    const [token, setToken] = useState(storedToken ? storedToken : null);

    console.log(isFavorite)

    const removeFavorite = () => {
        fetch(`https://myflixmantajbains.herokuapp.com/${user.Username}/movies/${movie.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                alert("Failed");
                return false;
            }
        })
        .then(user => {
            if (user) {
                alert("Movie deleted from favorites");
                setIsFavorite(false);
                updateUser(user);
            }
        })
        .catch(e => {
            alert(e);
        });
    }

    return (
      <Card variant="link" className="customCard h-100 movie-card-ani">
       <button className="remove_from_faves_fc" onClick={removeFavorite}><XCircle size={45} /></button>
        <Link to={`/profile/movies/${encodeURIComponent(movie.id)}`}>
          <Card.Img variant="top" src={movie.ImagePath} />
        </Link>
        <Card.Body className="card_body">
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Text>{movie.Genre.Name}</Card.Text>
        </Card.Body>
               
      </Card>
    );
  };