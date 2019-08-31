import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";
import ClientsAPI from "../services/clientsAPI";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import '../../css/clientspage.css';
import ExportClients from '../components/ExportClients';
import TableLoader from '../components/laoders/TableLoader';



const ClientsPage = props => {

    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    
    // Permet de récupérer les clients
    const fetchClients = async () => {
        try {
            const data = await ClientsAPI.findAll();
            setClients(data);
            setLoading(false);
        } catch {
            toast.error("Impossible de charger les clients");
        }
    };

    

    // Au chargement du composant, on va chercher les clients 
    useEffect(() => {
        fetchClients();
    }, []);

    // Gestion de la suppression d'un client
    const handleDelete = async id => {
        const originalClients = [...clients]

        setClients(clients.filter(clients => clients.id !== id))

        try {
            await ClientsAPI.delete(id);
            toast.success("Le client a bien été supprimé");
        } catch(error) {
            setClients(originalClients);
            toast.error("La suppression du client n'a pas pu fonctionner");
        }

        //ClientsAPI.delete(id)
          //  .then(response => console.log("ok"))
            //.catch(error => {
              //  setClients(originalClients);
               // console.log(error.response);
            //});
    };

    // Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);

    // Gestion de la recherche 
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 10;

    // Filtrage des clients en fonction de la recherche
    const filteredClients = clients.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) || c.totalAmount.toString().includes(search.toLowerCase()) 
    );

    
    //Pagination des données
    const paginatedClients = Pagination.getData(
        filteredClients, 
        currentPage, 
        itemsPerPage
    );

    // Affichage Pop-up
    const popover = () => {
        var popover = document.getElementById("popover226303");
        popover.style.display = "block";
    };
    // Cache la pop-up
    const hidePopover = () => {
        var popover = document.getElementById("popover226303");
        popover.style.display = "none";
    }
       
    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link to="/clients/new" className="btn btn-primary">Créer un client</Link>
            </div>
            
            <div className="form-group">
                <input 
                    type="text" 
                    onChange={handleSearch} 
                    value={search} 
                    className="form-control" 
                    placeholder="Rechercher par Client, Email, Montant Total"
                />
            </div>
            <table className="table table-hover" id="table-responsive-clients">
                <thead className="responsive">
                    <tr className="responsive">
                        <th className="text-center">Client</th>
                        <th className="text-center">Email</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th></th>
                        <th classname="thead-responsive"></th>
                    </tr>
                </thead>
                {!loading && (<tbody className="responsive">
                    {paginatedClients.map(clients => 
                        <tr className="responsive" key={clients.id}>
                        <td className="text-center">
                            <Link to={"/clients/" + clients.id}>
                                {clients.firstName} {clients.lastName}
                            </Link>
                        </td>
                        <td className="text-center">{clients.email}</td>
                        <td className="text-center">
    
                            <span className="badge badge-primary">{clients.invoices.length}</span>
                        </td>
                        <td className="text-center">{clients.totalAmount.toLocaleString()}€</td>
                        <td className="text-center" id="td-button">
                            <button 
                                onClick={() => handleDelete(clients.id)}
                                disabled={clients.invoices.length > 0 || clients.diaries.length > 0}
                                className="btn btn-sm btn-danger">Supprimer
                            </button>
                            <div className="popover fade show bs-popover-right" role="tooltip" id={((clients.invoices.length > 0 || clients.diaries.length > 0) && "popover468793" || "hidden")}>
                                    <div id="arrow-client" className="arrow"></div>
                                    <div className="popover-body">Un client possédant des factures/rendez-vous ne peut pas être supprimé.</div>
                                </div>
                        </td>
                        <td className={((clients.invoices.length > 0 || clients.diaries.length > 0) && "com-responsive" || "hidden")}>Un client possédant des factures/rendez-vous ne peut pas être supprimé.</td>
                    </tr> )}    
                </tbody>)}
            </table>
            {loading && <TableLoader />} 
            {paginatedClients.length > 0 && (<div className="row responsive">
                     <Pagination 
                        currentPage={currentPage} 
                        itemsPerPage={itemsPerPage} 
                        length={filteredClients.length} 
                        onPageChanged={handlePageChange} 
                    />
                <div id="export-clients">
                    <div id="button-export" onMouseOver={() => popover()} onMouseLeave={() => hidePopover()}>
                        <ExportClients />
                    </div>
                    <div className="popover fade show bs-popover-top" role="tooltip" id="popover226303" x-placement="top">
                        <div className="arrow" id="popover-export-clients"></div>
                        <div className="popover-body">Exporter vos clients sous fichier Excel.</div>
                    </div>
                </div>
            </div>)}
        </>
    );
};
 
export default ClientsPage;