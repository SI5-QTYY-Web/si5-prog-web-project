import React, {useContext, useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.scss'
import axios, { AxiosError } from "axios";
import {Breadcrumb} from "react-bootstrap";
import { useNavigateNoUpdates } from "../../context/RouterUtils";
import { AuthContext } from "../../context/AuthContext";

function LoginPage() {
  const navigate = useNavigateNoUpdates();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { token, setToken, user, setUser} = useContext(AuthContext);

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  async function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();
    await axios.post(`http://localhost:3333/api/auth/login`, { username: username, password: password })
      .then(res => {
        const token = res.data;
        localStorage.setItem('token', JSON.stringify(token));
        setToken(token);
        localStorage.setItem('user', username);
        setUser(username);

        navigate("/")
      }).catch((err)=>{//TODO regarder code erreur + verif sur signup
        alert('Adresse mail ou mot de passe invalide');
        console.log('Login failed : ', err);
      })
  }

  return(
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="http://localhost:4200">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Login</Breadcrumb.Item>
      </Breadcrumb>
      <div className="Login">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Adresse mail</Form.Label>
            <Form.Control
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Remember me" />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={!validateForm()}>
            Se connecter
          </Button>
          <Button variant="primary" onClick={(e) => navigate(`signup`)}>
            Se créer un compte
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
