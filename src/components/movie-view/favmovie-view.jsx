import PropTypes from "prop-types";
import { Card, Col, Row, Button} from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, Heartbreak, XCircle } from "react-bootstrap-icons";

export const FaveMovieView = ({ movies, user, token, updateUser }) => {
  const { movieId } = useParams();

  const movie = movies.find((m) => m.id === movieId);

  const [isFavorite, setIsFavorite] = useState(user.FaveMovies.includes(movie.id));

  useEffect(() => {
      setIsFavorite(user.FaveMovies.includes(movie.id));
  }, [movieId])

  const addFavorite = () => {
      fetch(`https://myflixmantajbains.herokuapp.com/users/${user.Username}/movies/${movieId}`, {
          method: "POST",
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
              alert("Movie added to favorites");
              setIsFavorite(true);
              updateUser(user);
          }
      })
      .catch(e => {
          alert(e);
      });
  }

  const removeFavorite = () => {
      fetch(`https://myflixmantajbains.herokuapp.com/users/${user.Username}/movies/${movieId}`, {
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
    <Card className="customCard card_body">
      <Link to={`/profile`}>
        <Card.Img src={movie.ImagePath} />
      </Link>
        <Card.Body>
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Text>
            <span className="bold_title">Director: </span>
            <span>{movie.Director.Name}</span>
          </Card.Text>
          <Card.Text>
            <span className="bold_title">Genre: </span>
            <span>{movie.Genre.Name}</span>
          </Card.Text>
          <Card.Text>
            <div className="bold_title">Description: </div>
            <div>{movie.Description}</div>
          </Card.Text>
        </Card.Body>
        <Link to={`/profile`}>
        <Button className="w-100">Back</Button>
        </Link>
        {isFavorite ? 
           <button className="remove_from_faves_mc" onClick={removeFavorite}><XCircle size={45} /></button>
             : <button className="add_to_faves" onClick={addFavorite}><Heart size={45}  /></button>
        }      
    </Card>
  );
};



  //PropTypes for the MovieView

FaveMovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string,
    Description: PropTypes.string,
    Genre: PropTypes.shape({
      Name: PropTypes.string,
    }).isRequired,
    Director: PropTypes.shape({
      Name: PropTypes.string
    }).isRequired,
  }).isRequired,
};