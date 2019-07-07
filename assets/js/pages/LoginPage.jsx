import React, { useContext, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import AuthAPI from '../services/authAPI';


const LoginPage = ({ history }) => {

    const { setIsAuthenticated } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const  [error, setError] = useState("");

    //Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;

        setCredentials({...credentials, [name]: value});
    };

    //Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true); 
            history.replace("/clients");
        } catch(error) {
            setError(
                "Aucun compte ne possède cette adresse email ou alors les informations ne correspondent pas !"
            );
        }
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