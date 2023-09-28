import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const MovieCard = ({ movie, onAddToFavorites }) => {
    const handleAddToFavorites = () => {
        onAddToFavorites(movie.id);
    };

    return (
        <Card
            as={Link}
            to={`/movies/${encodeURIComponent(movie.id)}`}
            className="text-decoration-none h-100"
        >
            <Card.Img variant="top" src={movie.image} />
            <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
            </Card.Body>
        </Card>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        genre: PropTypes.shape({
            name: PropTypes.string,
            description: PropTypes.string
        }),
        director: PropTypes.shape ({
            name: PropTypes.string,
            bio: PropTypes.string,
            birthYear: PropTypes.string,
            deathYear: PropTypes.string
        }),
        image: PropTypes.string.isRequired,
        year: PropTypes.string,
        rating: PropTypes.string
    }).isRequired//,
    // addToFavorites: PropTypes.func.isRequired
};