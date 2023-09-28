import React from 'react';
import { useEffect, useState } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export const ProfileView = ({ user, token, movies, onLoggedOut, updateUser, onRemoveFavorite }) => {
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    // const [email, setEmail] = useState("");
    // const [birthday, setBirthday] = useState("");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [username, setUsername] = useState(user.Username ? user.Username : null);
    const [password, setPassword] = useState(user.Password ? user.Password : null);
    const [email, setEmail] = useState(user.Email ? user.Email : null);
    const [birthday, setBirthday] = useState(user.Birthday ? user.Birthday.substring(0, 10) : null);

    // console.log("profile-view storedUser: ", JSON.stringify(storedUser));

    useEffect(() => {
        fetch(`https://movieapi-me1u.onrender.com/users/${user.Username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then ((response) => response.json())
        .then((data) => {
            setFavoriteMovies(data.FavoriteMovies);
            console.log("Profile-view Returned data", data);
            console.log("Profile-view Returned favorites", data.FavoriteMovies);
        })
        .catch((e) => {
            console.log(e);
            alert("An error occurred");
        });
    }, [token]);

    const handleUpdate = (event) => {
        event.preventDefault();

        const data = {
            Username: username,
            Password: password,
            Email: email,
            Birthday: birthday
        };

        // const data = {};

        // storedUser.Username !== username
        //     ? data.Username = username
        //     : storedUser.Password !== password
        //     ? data.Password = password
        //     : storedUser.Email !== email
        //     ? data.Email = email
        //     : storedUser.Birthday !== birthday
        //     ? data.Birthday = birthday
        //     : alert ("Nothing to change!");

        console.log("profile-view data: ", JSON.stringify(data));

        // Update/Edit Account
        fetch(`https://movieapi-me1u.onrender.com/users/${user.Username}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }).then ((response) => {
            if (response.ok) {
                alert("Update successful!");
                updateUser(user);
                window.location.reload();
            } else {
                alert("Update failed!");
            }
        });
    };

    const deleteAccount = () => {
        fetch(`https://movieapi-me1u.onrender.com/users/${user.Username}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then ((response) => {
            if (response.ok) {
                alert("Account Deleted!");
               onLoggedOut();
            } else {
                alert("Account delete failed!");
            }
        });
    };

    return (
        <>
            <Form onSubmit={handleUpdate}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength="3"
                    />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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
                    <Button variant="primary" type="submit">Update</Button>
                    {/* <Link to={`/signup`}> */}
                        <Button variant="danger" onClick={() => {
                            if (confirm("Are you sure you want to delete your account?")) {
                                deleteAccount();
                            }
                        }}>Delete Account</Button>
                    {/* </Link> */}
                {/* <Button variant="primary" type="submit"> Submit</Button> */}
            </Form>
            <Row>
            <h1 className="text-danger">Favorite Movies</h1>
            {favoriteMovies.length > 0 &&
            movies
                .filter((m) => favoriteMovies.includes(m.id))
                .map((m) => (
                    <>
                    <Col className="mb-10" md={3} key={m.id}>
                        <MovieCard movie={m} />
                        <Button variant="danger" onClick={() => onRemoveFavorite(m.id)}>Remove</Button>
{/*                         <Card className="h-100">
                            <Card.Img variant="top" src={m.image} />
                            <Card.Body>
                                <Card.Title>{m.title}</Card.Title>
                                <Link to={"/profile"}>
                                    <Button variant="danger" onClick={() => onRemoveFavorite(m.id)}>Delete from Favorites</Button>
                                </Link>
                            </Card.Body>
                        </Card> */}
                    </Col>
                </>
                ))} 
            </Row>
        </>
    );
};