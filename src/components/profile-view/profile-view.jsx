import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { UserInfo } from "./user-info";
import { FavoriteMovies } from "./favoritemovies-view";
import UpdateUser from "./update-user";
import "./profile-view.scss";

export const ProfileView = ({user, movies, favoritesMovies, addToFavorites, removeFromFavorites}) => {

  const updateUser = (updatedUser) => {
    fetch(`/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: updatedUser.email,
        name: updatedUser.name,
        birthday: updatedUser.birthday,
        UserName: updatedUser.UserName,
        password: updatedUser.password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUserInfoChange = (updatedUser) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
  };

  return (
    <>
      <h1 style={{ color: '#194545' }}>Profile</h1>
      <Container>
        <Row>
          <Col md={4}>
            {user && (
              <>
                <div className="profile-card">
                  <UserInfo
                    user={user}
                  />
                </div>
                <UpdateUser user={user} handleSubmit={updateUser} />
              </>
            )}
          </Col>
          <Col md={8}>
            <FavoriteMovies
              movies={movies}
              favoritesMovies={favoritesMovies}
              onAddFavorite={addToFavorites}
              onRemoveFavorite={removeFromFavorites}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};