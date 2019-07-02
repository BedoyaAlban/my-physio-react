import React, { useEffect, useState} from 'react';
import axios from "axios";
import Pagination from "../components/Pagination";


const ClientsPageWithPagination = props => {

    const [clients, setClients] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/clients?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            .then(response => {
                setClients(response.data["hydra:member"]);
                setTotalItems(response.data["hydra:totalItems"]);
                setLoading(false);
            })
            .catch(error => console.log(error.response));
    }, [currentPage]);

    const handleDelete = id => {
        const originalClients = [...clients]

        setClients(clients.filter(clients => clients.id !== id))

        axios
            .delete("http://127.0.0.1:8000/api/clients/" + id)
            .then(response => console.log("ok"))
            .catch(error => {
                setClients(originalClients);
                console.log(error.response);
            });
    };

    const handlePageChange = page => {
        setCurrentPage(page);
        setLoading(true);
    };

    
    const paginatedClients = Pagination.getData(
        clients, 
        currentPage, 
        itemsPerPage
    );

    return (
        <>
            <h1>Liste des clients</h1>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id.</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                    <tr>
                        <td>Chargement...</td>
                    </tr>)}
                    {!loading &&
                    clients.map(clients => 
                        <tr key={clients.id}>
                        <td>{clients.id}</td>
                        <td>
                            <a href="#">{clients.firstName} {clients.lastName}</a>
                        </td>
                        <td>{clients.email}</td>
                        <td className="text-center">
                            <span className="badge badge-primary">{clients.invoices.length}</span>
                        </td>
                        <td className="text-center">{clients.totalAmount.toLocaleString()}€</td>
                        <td>
                            <button 
                                onClick={() => handleDelete(clients.id)}
                                disabled={clients.invoices.length > 0}
                                className="btn btn-sm btn-danger">Supprimer
                            </button>
                        </td>
                        <td></td>
                    </tr> )}
                    
                </tbody>
            </table>

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems} onPageChanged={handlePageChange} />
        </>
    );
};
 
export default ClientsPageWithPagination;