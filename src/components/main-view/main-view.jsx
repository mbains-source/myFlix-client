import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { title } from "process";

export const MainView = () => {
    let storedUser = null;
    const storedUserJSON = localStorage.getItem("user");
    if (storedUserJSON) {
        try {
            storedUser = JSON.parse(storedUserJSON);
        } catch (e) {}
    }

    const storedToken = localStorage.getItem("token");
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredMovies, setFilteredMovies] = useState([]);

    const handleSearch = (event) => {
        const searchQuery = event.target.value.toLowerCase();
        setSearchTerm(searchQuery);

        const filtered = movies.filter((movie) =>
            movie.title.toLowerCase().includes(searchQuery)
        );

        setFilteredMovies(filtered);
    };

    useEffect(() => {
        if (!token) {
            return;
        }

        fetch(`https://myflixmantajbains.herokuapp.com`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data", data);

                const moviesFromApi = data.map((movie) => ({
                    id: movie._id,
                    title: movie.Title,
                    image: movie.ImagePath,
                    description: movie.Description,
                    genre: movie.Genre.Name,
                    director: movie.Director.Name,
                    release: movie.Release,
                }));

                setMovies(moviesFromApi);
                setFilteredMovies(moviesFromApi);
            });
    }, [token]);

    return (
        <BrowserRouter>
            <NavigationBar
                user={user}
                onLoggedOut={() => {
                    setUser(null);
                    setToken(null);
                    localStorage.clear();
                }}
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
                                ) : movies.length === 0 ? (
                                    <Col>The list is empty!</Col>
                                ) : (
                                    <Col md={8}>
                                        <MovieView
                                            movies={movies}
                                            user={user}
                                            username={user.Username}
                                            favoriteMovies={user.FavoriteMovies}
                                        />
                                    </Col>
                                )}
                            </>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <>
                                {!user ? (
                                    <Navigate to="/login" replace />
                                ) : (
                                    <Col md={8}>
                                        <ProfileView
                                            user={user}
                                            movies={movies}
                                        />
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
                                        <Row>
                                            <Col
                                                className="d-flex justify-content-center"
                                                style={{
                                                    marginTop: 90,
                                                    marginBottom: 20,
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    placeholder="Search Movies"
                                                    value={searchTerm}
                                                    onChange={handleSearch}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            {filteredMovies.length === 0 ? (
                                                <Col>The list is empty!</Col>
                                            ) : (
                                                filteredMovies.map((movie) => (
                                                    <Col
                                                        className="mb-4"
                                                        key={movie.id}
                                                        sm={12}
                                                        md={6}
                                                        lg={4}
                                                    >
                                                        <MovieCard
                                                            movie={movie}
                                                        />
                                                    </Col>
                                                ))
                                            )}
                                        </Row>
                                    </>
                                )}
                            </>
                        }
                    />
                </Routes>
            </Row>
        </BrowserRouter>
    );
};