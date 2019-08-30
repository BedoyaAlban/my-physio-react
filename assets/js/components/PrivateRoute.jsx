import React, { useContext } from 'react';
import { Redirect, Route } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
// Composant Privateroute
const PrivateRoute = ({path, component}) => { 
    // Permet de définir si l'utilisateur est connecté et de vérouiller l'accès si ce n'est pas le cas
    const {isAuthenticated} = useContext(AuthContext);

     return isAuthenticated ? (
        <Route path={path} component={component} />
    ) : (
        <Redirect to="/login" />
    );
};

export default PrivateRoute;