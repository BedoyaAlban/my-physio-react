import React from 'react';



//Composant MyPhysio
const MyPhysio = (props) => {

    return ( 
     <>  
        <div className="container">
            <h1 id="title" className="text-center">Bienvenue sur My-Physio!</h1>
            <div className="row">
                <div className="col-lg-4">
                    <div className="card mb-5 mb-lg-0">
                        <h3>Agenda</h3>
                        <i className="far fa-calendar-alt fa-9x"></i>
                        <img className="img-fluid img-thumbnail" src={require('/assets/images/clients.png')} alt=""></img>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card mb-5 mb-lg-0">
                        <h3>Clients</h3>
                        <i className="far fa-list-alt fa-9x"></i>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card mb-5 mb-lg-0">
                        <h3>Factures</h3>
                        <i className="fas fa-list-ul fa-9x"></i>
                    </div>
                </div>
                <div className="col-md-8 mx-auto">
                    <p>My-Physio, l'application qui va simplifier votre gestion!</p>
                    <p>Besoin d'un agenda ? d'un endroit où vous pouvez gérer vos factures ? Retrouver un client ?</p>
                    <p className="text-primary">Rien de plus simple il vous suffit de créer un compte et de vous laisser guider!</p>
                    <p className="mb-0">
                    Vous n'êtes pas encore inscrit ? Rejoignez-nous! 
                    </p>
                </div>
            </div>
        </div>
    </>
    );
}
 
export default MyPhysio;