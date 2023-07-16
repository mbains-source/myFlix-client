import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

export const UpdateView = ({ storedToken, user, handleUpdateUser }) => {
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [username, setUsername] = useState(user.Username);
  const [email, setEmail] = useState(user.Email);
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState(user.Birthday);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const updatedUser = { 
      Username: username, 
      Email: email, 
      Password: password, 
      Birthday: birthday 
    };
  
    fetch(`https://myflixmantajbains.herokuapp.com/${user.Username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        handleUpdateUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        setUsername(data.Username);
        setEmail(data.Email);
        setPassword('');
        setBirthday(data.Birthday);
        setShowSuccess(true);
      })
      .catch((error) => {
        setShowError(true);
        setErrorMessage("Error updating user information. Please try again later.");
        console.error(error);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Update User Information</h3>
      {showError && <Alert variant="danger">{errorMessage}</Alert>}
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control type="text" placeholder="Enter new username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Email:</Form.Label>
        <Form.Control type="email" placeholder="Enter new email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formBirthday">
        <Form.Label>Birthday:</Form.Label>
        <Form.Control type="date" placeholder="Enter new birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
      </Form.Group>

      <Button variant="primary" type="submit">
        Update
      </Button>
    </Form>
  );
};