import React, { useState, useEffect } from 'react';
import Field from '../components/fomrs/Field';
import Select from '../components/fomrs/Select';
import { Link } from "react-router-dom";
import clientsAPI from '../services/clientsAPI';
import invoicesAPI from '../services/invoicesAPI';
import { toast } from 'react-toastify';
import FormLoader from '../components/laoders/FormLoader';

const InvoicePage = ({ history, match }) => {

    const { id = "new"} = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        client: "",
        status: "INVOICED"
    });

    const [clients, setClients] = useState([]);
    const [editing, setEditing] = useState(false);
    const [errors, setErrors] = useState({
        amount: "",
        client: "",
        status: ""
    });

    const [loading, setLoading] = useState(true);

    const fetchClients = async () => {
        try {
            const data = await clientsAPI.findAll();
            setClients(data);
            setLoading(false);
            if (!invoice.client) setInvoice({...invoice, client: data[0].id });
        } catch (error) {
            toast.error("Une erreur est survenue !");
            history.replace("/invoices");
        }
    };

    const fetchInvoice = async id => {
        try { 
            const { amount, status, client } = await invoicesAPI.find(id);
            setInvoice({ amount, status, client: client.id });
            setLoading(false);
        } catch (error) {
            toast.error("Une erreur est survenue !");
            history.replace("/invoices");
        }
    };
    
    useEffect(() => {
        fetchClients();
    }, []);
    
    useEffect(() => {
        if (id !== "new") {
            fetchInvoice(id);
            setEditing(true);
        }
    }, [id]);

    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setInvoice({ ...invoice, [name]: value});
    };

    const handleSubmit = async event => {
        
        event.preventDefault();

        try {
            if(editing) {
                await invoicesAPI.update(id, invoice);
                toast.success("La facture a bien été modifiée !");
            } else {
                await invoicesAPI.create(invoice);
                toast.success("La facture a bien été enregistrée !");
                history.replace("/factures");
            }
        } catch ({ response }) {
            const { violations } = response.data;

            if (violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });
            setErrors(apiErrors);
            toast.error("Des erreurs dans votre formulaire !");
            }
        }
    };

    return ( 
        <>
            {editing && <h1>Modification d'une facture</h1> || <h1>Création d'une facture</h1>}
            {loading && <FormLoader />}
            {!loading && (<form onSubmit={handleSubmit}>
                <Field 
                    name="amount" 
                    type="number" 
                    placeholder="Montant de la facture" 
                    label="Montant" 
                    onChange={handleChange} 
                    value={invoice.amount}
                    error={errors.amount} 
                />
                <Select 
                    name="client" 
                    label="client" 
                    value={invoice.client} 
                    error={errors.client} 
                    onChange={handleChange}
                >
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.firstName} {client.lastName}
                        </option>
                    ))}
                </Select>
                <Select 
                    name="status" 
                    label="Satut" 
                    value={invoice.status} 
                    error={errors.status} 
                    onChange={handleChange}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/factures" className="btn btn-link">
                        Retour aux factures
                    </Link>
                </div>
            </form>)}
        </>
     );
};
 
export default InvoicePage;