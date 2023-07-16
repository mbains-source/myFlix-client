import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Card } from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

export const MovieView = ({ movies, user, setUser, token }) => {
    const { movieId } = useParams();
    const [ isFavorite, setIsFavorite ] = useState(false);

    useEffect(() => {
       const isFavorited = user.FavoriteMovies.includes(movieId)
       setIsFavorite(isFavorited)
    }, []);

    const removeFavorite = () => {
        fetch(`https://myflixmantajbains.herokuapp.com/users/${user.Username}/${movieId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            if (response.ok) {
                return response.json()
            }
        }).then((data) => {
            setIsFavorite(false);
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
        })
    };

    const addToFavorite = () => {
        fetch(`https://myflixmantajbains.herokuapp.com/users/${user.Username}/${movieId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            if (response.ok) {
                return response.json()
            }
        }).then((data) => {
            setIsFavorite(true);
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
        })
    }

    const movie = movies.find((m) => m.id === movieId);

    return (
        <Card className="mt-1 mb-1 h-100 bg-secondary text-white" >
            <Card.Img variant="top" src={movie.image}/>
            <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>Description: {movie.description}</Card.Text>
                <Card.Text>Director: {movie.director.name}</Card.Text>
                <Card.Text>Bio: {movie.director.bio}</Card.Text>
                <Card.Text>Genre: {movie.genre.name}</Card.Text>
                <Card.Text>Description: {movie.genre.description}</Card.Text>
            </Card.Body>

            {isFavorite ? (
                <Button onClick={removeFavorite}>Remove from favorites</Button>
            ) : (
                <Button onClick={addToFavorite}>Add to favorites</Button>
            )}

            <Link to={"/"}>
            <Button>Back</Button>
            </Link>
        </Card>
    )
}