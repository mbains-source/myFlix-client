import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import { MovieCard } from "../movie-card/movie-card";
import { ModalHeader } from "react-bootstrap";
import { MovieView } from "../movie-view/movie-view";

export const ProfileView = ({ user, token, setUser, movies, onLogout }) => {
  const [username, setUsername] = useState(user.Username);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(user.Email);
  const [birthday, setBirthday] = useState(user.Birthday);
  const [showModal, setShowModal] = useState(false);

  const favoriteMovies = movies.filter((movie) => {
    return user.Favorite.includes(movie.id);
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    fetch(
      `https://myflixmbainssource-ac4a0dd1ecf1.herokuapp.com/users/${user.Username}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json(), alert("Update successfully");
        } else {
          alert("Update failed");
        }
      })
      .then((data) => {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
      });
  };

  const handleDeleteUser = () => {
    fetch(
      `https://myflixmbainssource-ac4a0dd1ecf1.herokuapp.com/users/${user.Username}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => {
      if (response.ok) {
        onLogout();
      } else {
        alert("Something went wrong.");
      }
    });
  };

  return (
    <>
      <h1>Profile</h1>
      <Row>
        <Col>
          <h3>Information</h3>
          <div>Username: {user.Username}</div>
          <div>Email: {user.Email}</div>
        </Col>

        <Col>
          <h3>Update Profile</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength="5"
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="8"
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBirthday">
              <Form.Label>Birthday:</Form.Label>
              <Form.Control
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Update now
            </Button>
          </Form>
        </Col>
      </Row>

      <Row>
        <h3>Favorite movies</h3>
        {favoriteMovies.map((movie) => (
          <Col key={movie.id} md={4}>
            <MovieCard movie={movie}></MovieCard>
          </Col>
        ))}
      </Row>

      <Button
        variant="primary"
        className="button-primary"
        onClick={handleShowModal}
      >
        Delete account
      </Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete account</Modal.Title>
        </Modal.Header>
        <Modal.Body>Confirm delete account?</Modal.Body>
        <Modal.Footer>
          <button
            variant="primary"
            className="button-primary"
            onClick={handleDeleteUser}
          >
            Yes
          </button>
          <button
            variant="secondary"
            className="button-primary"
            onClick={handleCloseModal}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};