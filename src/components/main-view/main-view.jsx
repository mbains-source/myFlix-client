import { useEffect, useState } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';
import { NavigationBar } from '../navigation-bar/navigation-bar';
import { ProfileView } from '../profile-view/profile-view';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from "react-bootstrap/Form";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);
    const [movies, setMovies] = useState([]);
    const [filter, setFilter] = useState("");

    const updateUser = user => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    };

    const handleAddToFavorites = (movieId) => {
        // Updated user with new favorited movie
        const updatedUser = {
            ...user,
            FavoriteMovies: [...user.FavoriteMovies, movieId]
        };

        // Put request to add movie to favorite list
        fetch(`https://movieapi-me1u.onrender.com/users/${user.Username}/movies/${movieId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then ((response) => {
            if (response.ok) {
                alert("Added Movie to Favorites List!");
            } else {
                alert("Error Adding Movie to Favorites List!");
            }
        });
    };

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
    };

    const deleteFavorite = (movieId) => {
        console.log("Movie ID :", movieId);
        // Delete request to remove movie from favorite list
        fetch(`https://movieapi-me1u.onrender.com/users/${user.Username}/movies/${movieId}`, {
        //     headers: { Authorization: `Bearer ${token}` }
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         console.log("Returned data", data);
        //     })
        //     .catch((error) => {
        //         console.log('Error fetching movies:", error');
        //     });
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then ((response) => {
            if (response.ok) {
                alert("Removed Movie from Favorites!");
                window.location.reload();
            } else {
                alert("Error Removing Movie from Favorites!");
            }
        });
    };

    useEffect(() => {
        if (!token) {
            return;
        }

        fetch("https://movieapi-me1u.onrender.com/movies", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => response.json())
            .then((movies) => {
                const moviesFromApi = movies.map((movie) => {
                    return {
                    id: movie._id,
                    title: movie.Title,
                    description: movie.Description,
                    genre: {
                        name: movie.Genre.Name,
                        description: movie.Genre.Description
                    },
                    director: {
                        name: movie.Director.Name,
                        bio: movie.Director.Bio,
                        birthYear: movie.Director.Birth,
                        deathYear: movie.Director.Death
                    },
                    image: movie.ImagePath,
                    year: movie.ReleaseYear,
                    rating: movie.RottenTomatoes
                    };
                });
                setMovies(moviesFromApi);
            })
            .catch((error) => {
                console.log('Error fetching movies:", error');
            });
    }, [token]);

    return (
        <BrowserRouter>
            <NavigationBar
                user={user}
                onLoggedOut={handleLogout}
            />
            <Row className="justify-content-md-center">
                <Routes>
                    <Route
                        path="/signup"
                        element={
                            <>
                                {user ? (
                                    <Navigate to="/" />
                                ) : (
                                    <Col md={5}>
                                        <SignupView />
                                    </Col>
                                )}
                            </>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <>
                                {user ? (
                                    <Navigate to="/" />
                                ) : (
                                    <Col md={5}>
                                        <LoginView
                                            onLoggedIn={(user, token) => {
                                                setUser(user);
                                                setToken(token);
                                            }}
                                        />
                                    </Col>
                                )}
                            </>
                        }
                    />
                    <Route
                        path="/movies/:movieId"
                        element={
                            <>
                                {!user ? (
                                    <Navigate to="/login" replace />
                                ) : (
                                    <Col md={8}>
                                        <MovieView movies={movies} onAddToFavorites={handleAddToFavorites} />
                                    </Col>
                                )}
                            </>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <>
                                {!user ? (
                                    <Navigate to="/login" replace />
                                ) : (
                                    <>
                                        <Row className="mt-1 mb-1">
                                            <Form.Control
                                                type="text"
                                                placeholder="Search..."
                                                value={filter}
                                                onChange={(e) => setFilter(e.target.value)}
                                            />
                                        </Row>
                                        {movies.length === 0 ? (
                                            <Col>The list is empty!</Col>
                                        ) : (
                                            movies
                                                .filter((movie) => movie.title
                                                    .toLowerCase()
                                                    .includes(filter.toLowerCase())
                                                )
                                                .map((movie) => (
                                                    <Col className="mb-4" key={movie.id} md={3}>
                                                        <MovieCard movie={movie} />
                                                    </Col>
                                                ))
                                        )}
                                    </>
                                )}
                            </>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <>
                                {!user ? (
                                    <Navigate to="/login" replace />
                                ) : (
                                    <Col md={8}>
                                        <ProfileView
                                            user={user}
                                            token={token}
                                            movies={movies}
                                            onLoggedOut={handleLogout}
                                            updateUser={updateUser}
                                            onRemoveFavorite={deleteFavorite}
                                        />
                                    </Col>
                                )}
                            </>
                        }
                    />
                </Routes>
            </Row>
        </BrowserRouter>
    );
};