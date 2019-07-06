import React, {useState} from 'react';
import axios from "axios";
import ClientsAPI from '../services/clientsAPI';

const LoginPage = (props) => {

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const  [error, setError] = useState("");

    const handleChange = (event) => {
        const value =event.currentTarget.value;
        const name = event.currentTarget.name;

        setCredentials({...credentials, [name]: value});
    };

    const handleSubmit = async event => {
        event.preventDefault();

        try { 
           const token = await axios
            .post("http://127.0.0.1:8000/api/login_check", credentials)
            .then(response => response.data.token);

            setError("");
            //Stockage du token dans le localeStrorage
            window.localStorage.setItem("authToken", token);
            // On prévient axios qu'on a maintenant un header par défaut sur toutes nos futures requetes HTTP
            axios.defaults.headers["Authorization"] = "Bearer " + token;

            const data = await ClientsAPI.findAll();
            console.log(data);
        } catch(error) {
            setError("Aucun compte ne possède cette adresse email ou alors les informations ne correspondent pas !");
        }

        console.log(credentials);
    };

    return ( 
    <>
        <h1>Connexion à l'application</h1>

        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">Adresse email</label>
                <input 
                    value={credentials.username}
                    onChange={handleChange}
                    type="email" 
                    className={"form-control" + (error && " is-invalid")} 
                    id="username"
                    name="username"  
                    placeholder="Adresse email de connexion" 
                />
                {error && <p className="invalid-feedback">{error}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                    value={credentials.password}
                    onChange={handleChange}
                    type="password" 
                    className="form-control" 
                    id="password"
                    name="password"
                    placeholder="Mot de passe"
                />
            </div>
            <button type="submit" className="btn btn-primary">Se Connecter</button>
        </form>
    </> 
);}
 
export default LoginPage;