import React from 'react';

const Navbar = (props) => {
    return ( 
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#">My-Physio</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
  
        <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/#/clients">Clients</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Calendrier</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#/factures">Factures</a>
                </li>
            </ul>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <a href="#" className="btn btn-outline-warning">Inscription</a>
                </li>
                <li className="nav-item">
                    <a href="#" className="btn btn-success">Connexion</a>
                </li>
                <li className="nav-item">
                    <a href="" className="btn btn-danger">Déconnexion</a>
                </li>
            </ul>
        </div>
  </nav> );
}
 
export default Navbar;