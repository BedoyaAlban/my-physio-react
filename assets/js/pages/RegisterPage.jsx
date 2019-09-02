import React, { useState } from 'react';
import Field from '../components/fomrs/Field';
import { Link } from "react-router-dom";
import userAPI from "../services/usersAPI";
import { toast } from 'react-toastify';
//Composant RegisterPage
const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName:"",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName:"",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    //Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({ ...user, [name]: value});
    };

    //Gestion de la soumission du formulaire d'inscription
    const handleSubmit = async event => {
        event.preventDefault();

        const apiErrors = {};
        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "Votre confirmation de mot de passe n'est pas conforme à votre mot de passe";
            setErrors(apiErrors);
            toast.error("Il ya des erreurs dans votre formulaire !");
            return;
        }

        try {
            await userAPI.register(user);
            setErrors({});
            toast.success("Vous êtes désormais inscrit, vous pouvez vous connecter !");
            history.replace("/login");
        } catch (error) {
            const { violations } = error.response.data;

            if (violations) {
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
            toast.error("Il ya des erreurs dans votre formulaire !");
        }

    };


    return ( 
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field 
                    name="firstName" 
                    label="°Prénom" 
                    placeholder="Votre Prénom" 
                    error={errors.firstName} 
                    value={user.firstName}
                    onChange={handleChange} 
                />
                <Field 
                    name="lastName" 
                    label="°Nom de famille" 
                    placeholder="Votre nom de famille" 
                    error={errors.lastName} 
                    value={user.lastName}
                    onChange={handleChange} 
                />
                <Field 
                    name="email" 
                    label="°Adresse email" 
                    type="email"
                    placeholder="Votre adresse email" 
                    error={errors.email} 
                    value={user.email}
                    onChange={handleChange} 
                />
                <Field 
                    name="password" 
                    label="°Mot de passe" 
                    type="password"
                    placeholder="Votre mot de passe" 
                    error={errors.password} 
                    value={user.password}
                    onChange={handleChange} 
                />
                <Field 
                    name="passwordConfirm" 
                    label="°Confirmation de mot de passe"
                    type="password" 
                    placeholder="Confirmez votre mot de passe" 
                    error={errors.passwordConfirm} 
                    value={user.passwordConfirm}
                    onChange={handleChange} 
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je m'inscris</button>
                    <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
                </div>
            </form>
        </>
     );
};
 
export default RegisterPage;