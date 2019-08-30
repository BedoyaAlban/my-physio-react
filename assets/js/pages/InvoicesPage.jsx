import moment from "moment";
import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/invoicesAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ExportInvoices from "../components/ExportInvoices.js";
import '../../css/invoicespage.css';
import TableLoader from "../components/laoders/TableLoader";

const STATUS_CLASSES = {
    PAID: "success",
    INVOICED: "primary",
    CANCELLED: "danger"
};

const STATUS_LABELS = {
    PAID: "Payée",
    INVOICED: "Facturée",
    CANCELLED: "Annulée"
};



const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const itemsPerPage = 10;
    const [loading, setLoading] = useState(true);

    //récupération des factures auprès de l'API
    const fetchInvoices = async () => {
        try {
            const data =  await InvoicesAPI.findAll();
            setInvoices(data);
            setLoading(false);
        } catch (error) {
            toast.error("Erreur lors du chargement des factures !");
        }
    };

    //Charger les factures au chargement du composant
    useEffect(() => {
        fetchInvoices();
    }, []);

    // Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);

    // Gestion de la recherche 
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };
    //La gestion de la suppression
    const handleDelete = async id => {
        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await InvoicesAPI.delete(id);
            toast.success("La facture a bien été supprimée");
        } catch (error) {
            toast.error("Une erreur est survenue !");
            setInvoices(originalInvoices);
        }
    };
    //Gestion du format de date
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');
    //Gestion de la racherche
    const filteredInvoices = invoices.filter(
        i => 
            i.client.firstName.toLowerCase().includes(search.toLowerCase()) || 
            i.client.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().includes(search.toLowerCase()) || 
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase()) ||
            formatDate(i.sentAt).toString().includes(search) 
            
    );
    //Pagination des données
    const paginatedInvoices = Pagination.getData(
        filteredInvoices, 
        currentPage, 
        itemsPerPage
    );
    //Affichage de la popup
    const popover = () => {
        var popover = document.getElementById("popover226302");
        popover.style.display = "block";
    };
    //Masquer la popup
    const hidePopover = () => {
        var popover = document.getElementById("popover226302");
        popover.style.display = "none";
    } 

    return ( 
    <>
        <div className="d-flex justify-content-between align-items-center">
            <h1>Liste des factures</h1>
            <Link className="btn btn-primary" to="/factures/new">Créer une facture</Link>
        </div>
       
        <div className="form-group">
                <input 
                    type="text" 
                    onChange={handleSearch} 
                    value={search} 
                    className="form-control" 
                    placeholder="Rechercher par Numéro, Client, Date d'envoi, Statut, Montant "
                />
        </div>
        <table className="table table-hover">
            <thead>
                <tr className="responsive">
                    <th className="text-center">Numéro</th>
                    <th className="text-center">Client</th>
                    <th className="text-center">Date d'envoi</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Montant</th>
                    <th></th>
                </tr>
            </thead>
            {!loading && (<tbody className="responsive">
            {paginatedInvoices.map(invoice => 
                <tr className="responsive" key={invoice.id}>
                    <td className="text-center">{invoice.chrono}</td>
                    <td className="text-center">
                        <Link to={"/clients/" + invoice.client.id}>
                            {invoice.client.firstName} {invoice.client.lastName}
                        </Link>
                    </td>
                    <td className="text-center">{formatDate(invoice.sentAt)}</td>
                    <td className="text-center">
                        <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                    </td>
                    <td className="text-center">{invoice.amount.toLocaleString()}€</td>
                    <td className="text-center">
                        <Link 
                            to={"/factures/" + invoice.id } 
                            className="btn btn-sm btn-primary mr-1">
                                Editer
                        </Link>
                        <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => handleDelete(invoice.id)}
                            >
                            Supprimer
                        </button>
                    </td>
                </tr> 
                )}
            </tbody>)}
        </table>
        {loading && <TableLoader />}
        {paginatedInvoices.length > 0 && (<div className="row responsive">
            <Pagination 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
                onPageChanged={handlePageChange} 
                length={filteredInvoices.length}
            />
            <div id="export-invoices">
                <div id="button-export-invoices" onMouseOver={() => popover()} onMouseLeave={() => hidePopover()}>
                    <ExportInvoices />
                </div>
                <div className="popover fade show bs-popover-top" role="tooltip" id="popover226302" x-placement="top">
                    <div className="arrow" id="popover-export"></div>
                    <div className="popover-body">Exporter vos factures sous fichier Excel.</div>
                </div>
            </div>
        </div>)}
        
    </> 
    );
}
 
export default InvoicesPage;