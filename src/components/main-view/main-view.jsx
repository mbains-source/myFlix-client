import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Footer } from "../navigation-bar/footer";

export const MainView = () => {
  // retrieve user and token from localStorage if they exist
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  // set the initial state of user and token based on the retrieved values
  const [user, setUser] = useState(storedUser || null);
  const [token, setToken] = useState(storedToken || null);
  const [movies, setMovies] = useState([]);
  // set the initial state of favMovies based on the user's favorite movies
  const [favMovies, setFavMovies] = useState(user?.FavoriteMovies || []);
  const [filter, setFilter] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genre, setGenres] = useState([]);

  // update the filtered movies list when the movies or filter change
  useEffect(() => {
    if (!token) return; // don't fetch movies if the user is not logged in
    let url = "https://movieapi-me1u.onrender.com/movies";
    if (filter !== "") {
      url += `?genre=${filter}`;
    }
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((movies) => {
        const moviesFromApi = movies.map((movie) => ({
          id: movie._id,
          title: movie.Title,
          image: movie.ImagePath,
          description: movie.Description,
          genre: movie.Genre.Name,
          genreDescription: movie.Genre.Description,
          director: movie.Director,
        }));
        setMovies(moviesFromApi);
        if (filter !== "") {
          const filteredMovies = moviesFromApi.filter(
            (movie) => movie.genre === filter
          );
          setFilteredMovies(filteredMovies);
        } else {
          setFilteredMovies(moviesFromApi);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, filter]);

  // update the favorite movies list when the user changes
  useEffect(() => {
    if (!user) {
      setFavMovies([]);
      return;
    }

    setFavMovies(user.FavoriteMovies || []);
  }, [user]);
  
  // handle logout by resetting user, token, and clearing localStorage
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear(); // This will clear all the items in localStorage
  };

  const addToFav = async (movieId) => {
    // Check if the movie is already in the favorites list
    if (favMovies.includes(movieId)) {
      alert("This movie is already in your favorites list.");
      return;
    }

    try {
      await fetch(
        `https://movieapi-me1u.onrender.com/users/${user.Username}/movies/${movieId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const updatedFavMovies = [...favMovies, movieId];
      setFavMovies(updatedFavMovies);
      updateLocalStorageFavorites(updatedFavMovies);
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error adding the movie to favorites list.");
    }
  };

  const removeFromFav = async (movieId) => {
    // Check if the movie is not in the favorites list
    if (!favMovies.includes(movieId)) {
      alert("This movie is not in your favorites list.");
      return;
    }

    try {
      await fetch(
        `https://movieapi-me1u.onrender.com/${user.Username}/movies/${movieId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const updatedFavMovies = favMovies.filter((id) => id !== movieId);
      setFavMovies(updatedFavMovies);
      updateLocalStorageFavorites(updatedFavMovies);
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error removing the movie from favorites list.");
    }
  };

  const updateLocalStorageFavorites = (updatedFavMovies) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    userData.FavoriteMovies = updatedFavMovies;
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <BrowserRouter>
      <NavigationBar user={user} onLoggedOut={handleLogout} />
      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/"
            element={
              !user ? (
                <>
                  <Col md={4} className="mb-1.5">
                    <LoginView
                      className="form"
                      onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                      }}
                    />
                  </Col>
                  <Col md={1} className="mb-.25" style={{ margin: '50px 0' }}>
                    or
                  </Col>
                  <Col md={4} className="mb-1.5">
                    <SignupView className="form" />
                  </Col>
                </>
              ) : (
                <>
                  <Col xs={12} className="mb-3">
                    <label className="form-label" style={{ color: '#194545', fontWeight: 'bold' }}>Select genre:</label>
                    <select
                      className="form-select"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="">All genres</option>
                      <option value="Family">Family</option>
                      <option value="Comedy">Comedy</option>
                      <option value="Drama">Drama</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Romance">Romance</option>
                    </select>
                  </Col>
                  {filteredMovies.length === 0 ? (
                    <Col xs={12}>
                      <div>The list is empty!</div>
                    </Col>
                  ) : (
                    filteredMovies.map((movie) => (
                      <Col key={movie.id} xs={12} sm={6} md={4} lg={3} className="mb-5">
                        <MovieCard
                          movie={movie}
                          fav={favMovies.includes(movie.id)}
                          onAddToFavorites={(movieId) => addToFav(movieId)}
                          onRemoveFromFavorites={(movieId) => removeFromFav(movieId)}
                          onfilteredMovies={(movieId) => filteredMovies(movieId)}
                        />
                      </Col>
                    ))
                  )}
                </>
              )
            }
          />
          <Route
            path="/movies/:movieId"
            element={
              <MovieView
                movies={movies}
                favoritesMovies={favMovies}
                addToFavorites={addToFav}
                removeFromFavorites={removeFromFav}
              />
            }
          />
          <Route
            path="/users/:Username"
            element={
              <ProfileView
                user={user}
                movies={movies}
                favoritesMovies={favMovies}
                addToFavorites={addToFav}
                removeFromFavorites={removeFromFav}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Row>
      <Footer />
    </BrowserRouter>
  ); 
}