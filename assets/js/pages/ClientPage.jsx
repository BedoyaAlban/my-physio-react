import React, { useState, useEffect } from 'react';
import Field from '../components/fomrs/Field';
import { Link } from "react-router-dom";
import clientsAPI from "../services/clientsAPI";


const ClientPage = ({match, history} ) => {

    const { id ="new"} = match.params;

    const [client, setClient] = useState({
        lastName: "",
        firstName: "",
        email: "",
        numberPhone: "",
        adressNumber: "",
        adressName: "",
        adressCity: "",
        zipCode: "",
        securitySocialNumber: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        numberPhone: "",
        adressNumber: "",
        adressName: "",
        adressCity: "",
        zipCode: "",
        securitySocialNumber: ""
    });

    const [editing, setEditing] = useState(false);

    //Récupération du client en fonction de l'identifiant
    const fetchClient = async id => {
        try {
            const {firstName, 
                lastName, 
                email, 
                numberPhone, 
                adressCity, 
                adressName, 
                adressNumber, 
                zipCode, 
                securitySocialNumber} 
                = await clientsAPI.find(id);

            setClient({ 
                firstName, 
                lastName, 
                email, 
                numberPhone, 
                adressCity, 
                adressName, 
                adressNumber, 
                zipCode, 
                securitySocialNumber 
            });
        }catch(error) {
            history.replace("/clients");
        }
    };

    //Chargement du client si besoin au chargement du composant ou au changement de l'identifiant
    useEffect(() => {
        if(id !== "new") {
            setEditing(true);
            fetchClient(id);
        }
    }, [id]);

    //Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setClient({ ...client, [name]: value});
    };

    //Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            if (editing) {
                 await clientsAPI.update(id, client);
            } else {
                await clientsAPI.create(client);
                history.replace("/clients");
            }

            setErrors({});
        } catch({ response }) {
            const { violations } = response.data;
            if (violations) {
                const apiErrors = {};
                violations.foreach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            }
        }
    };


    return ( 
    <>
        {(!editing && <h1>Création d'un client</h1>) || (<h1>Modification du client</h1>)}

        <form onSubmit={handleSubmit}>
            <Field 
                name="lastName" 
                label="Nom de famille" 
                placeholder="Nom de famille du client" 
                value={client.lastName}
                onChange={handleChange}
                error={errors.lastName}
            />
            <Field 
                name="firstName" 
                label="Prénom" 
                placeholder="Prénom du client"
                value={client.firstName}
                onChange={handleChange}
                error={errors.firstName}
            />
            <Field 
                name="email" 
                label="Email" 
                placeholder="Adresse email du client" 
                type="email"
                value={client.email}
                onChange={handleChange}
                error={errors.email}
            />
            <Field 
                name="numberPhone" 
                label="Numéro de téléphone" 
                placeholder="Numéro de téléphone du client" 
                value={client.numberPhone}
                onChange={handleChange}
                error={errors.numberPhone}
            />
            <Field 
                name="adressNumber" 
                label="Numéro de l'adresse" 
                placeholder="Numéro de l'adresse du client" 
                type="number" 
                value={client.adressNumber}
                onChange={handleChange}
                error={errors.adressNumber}
            />
            <Field 
                name="adressName" 
                label="Nom de l'adresse" 
                placeholder="Nom de l'adresse du client" 
                value={client.adressName}
                onChange={handleChange}
                error={errors.adressName}
            />
            <Field 
                name="adressCity" 
                label="Ville" 
                placeholder="Nom de la ville de l'adresse du client"
                value={client.adressCity}
                onChange={handleChange}
                error={errors.adressCity}
            />
            <Field 
                name="zipCode" 
                label="Code Postal" 
                placeholder="Code postal du client" 
                value={client.zipCode}
                onChange={handleChange}
                error={errors.zipCode}
            />
            <Field 
                name="securitySocialNumber" 
                label="Numéro de sécurité sociale " 
                placeholder="Numéro de sécurité sociale du client" 
                type="number"
                value={client.securitySocialNumber} 
                onChange={handleChange}
                error={errors.securitySocialNumber}
            />

            <div className="form-group">
                <button type="submit" className="btn btn-success">Enregistrer</button>
                <Link to="/clients" className="btn btn-link">Retour à la liste</Link>
            </div>
        </form> 
    </>);
}
 
export default ClientPage;