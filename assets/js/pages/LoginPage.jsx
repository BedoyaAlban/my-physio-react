import React, { useContext, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import AuthAPI from '../services/authAPI';
import Field from '../components/fomrs/Field';
import { toast } from 'react-toastify';

//Composant LoginPage
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
            toast.success("Vous êtes désormais connecté !");
            history.replace("/home");
        } catch(error) {
            setError(
                "Aucun compte ne possède cette adresse email ou alors les informations ne correspondent pas !"
            );
            toast.error("Une erreur est survenue !");
        }
    };

    return ( 
    <>
        <h1>Connexion à l'application</h1>

        <form onSubmit={handleSubmit}>
            <Field 
                label="°Adresse email" 
                name="username" 
                type="email"
                value={credentials.username} 
                onChange={handleChange} 
                placeholder="Adresse email de connexion" 
                error={error} 
            />
            <Field 
                label="°Mot de passe"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                type="password"  
                error=""
            />
            <button type="submit" className="btn btn-primary">Se Connecter</button>
        </form>
    </> 
);}
 
export default LoginPage;