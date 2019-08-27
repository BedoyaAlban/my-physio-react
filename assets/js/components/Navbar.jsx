import React, { useContext } from 'react';
import AuthAPI from "../services/authAPI";
import { NavLink } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { toast } from 'react-toastify';

const Navbar = ({ history }) => {

    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuthenticated(false);
        toast.info("Vous êtes désormais déconnecté!");
        history.push("/login");
    };

    return ( 
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <NavLink className="navbar-brand" to="/myphysio">
            My-Physio
        </NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
       <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav mr-auto">
            {(isAuthenticated &&
                (<li className="nav-item active">
                    <NavLink className="nav-link" to="/home">
                        Home
                    </NavLink>
                </li>))}
                {(isAuthenticated &&
                (<li className="nav-item">
                    <NavLink className="nav-link" to="/clients">
                        Clients
                    </NavLink>
                </li>))}
                {(isAuthenticated &&
                (<li className="nav-item">
                    <NavLink className="nav-link" to="/diary">
                        Calendrier
                    </NavLink>
                </li>))}
                {(isAuthenticated &&
                (<li className="nav-item">
                    <NavLink className="nav-link" to="/factures">
                        Factures
                    </NavLink>
                </li>))}
            </ul>
        
            <ul className="navbar-nav ml-auto">
                {(!isAuthenticated && (
                    <>
                        <li className="nav-item">
                            <NavLink to="/register" className="btn btn-outline-warning">
                                Inscription
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/login" className="btn btn-success">
                                Connexion
                            </NavLink>
                        </li>
                    </>
                )) || (
                <li className="nav-item">
                    <button onClick={handleLogout} className="btn btn-danger">
                        Déconnexion
                    </button>
                </li>
                )}
            </ul>
        </div>
  </nav> );
}
 
export default Navbar;