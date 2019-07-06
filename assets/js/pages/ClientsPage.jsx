import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";
import ClientsAPI from "../services/clientsAPI";



const ClientsPage = props => {

    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    // Permet de récupérer les clients
    const fetchClients = async () => {
        try {
            const data = await ClientsAPI.findAll();
            setClients(data);
        } catch {
            console.log(error.response);
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
            await ClientsAPI.delete(id)
        } catch(error) {
            setClients(originalClients);
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
            c.email.toLowerCase().includes(search.toLowerCase())
    );

    //Pagination des données
    const paginatedClients = Pagination.getData(
        filteredClients, 
        currentPage, 
        itemsPerPage
    );

    return (
        <>
            <h1>Liste des clients</h1>

            <div className="form-group">
                <input 
                    type="text" 
                    onChange={handleSearch} 
                    value={search} 
                    className="form-control" 
                    placeholder="Rechercher ..."
                />
            </div>

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
                    {paginatedClients.map(clients => 
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

            {itemsPerPage < filteredClients.length && 
                <Pagination 
                    currentPage={currentPage} 
                    itemsPerPage={itemsPerPage} 
                    length={filteredClients.length} 
                    onPageChanged={handlePageChange} 
                />}
        </>
    );
};
 
export default ClientsPage;