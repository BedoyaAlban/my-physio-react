import React, { useState, useEffect } from 'react';
import Field from '../components/fomrs/Field';
import { Link } from "react-router-dom";
import clientsAPI from "../services/clientsAPI";
import { toast } from 'react-toastify';
import moment from "moment";
import '../../css/clientpage.css';
import FormLoader from '../components/laoders/FormLoader';




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
        securitySocialNumber: "",
        note: ""
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
        securitySocialNumber: "",
        note: ""
    });

    const [clientDiaries, setClientDiaries] = useState({});
    const [clientInvoices, setClientInvoices] = useState([]);
    

    const [editing, setEditing] = useState(false);

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

    const [loading, setLoading] = useState(false);

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
                securitySocialNumber,
                note,
                diaries,
                invoices
                } 
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
                securitySocialNumber,
                note
            });
            
            var fillClientDiaries = [];

            for (let diary of diaries) {
                if(Date.parse(diary.startSession) > today) {
                    let appointement = diary.startSession;
                    fillClientDiaries.push(appointement);
                }
            }
            setClientDiaries(fillClientDiaries);
            setClientInvoices(invoices);
            setLoading(false);

        }catch(error) {
            toast.error("Le client n'a pas pu être chargé !");
            history.replace("/clients");
        }
    };

    //Chargement du client si besoin au chargement du composant ou au changement de l'identifiant
    useEffect(() => {
        if(id !== "new") {
            setEditing(true);
            fetchClient(id);
            setLoading(true);
        }
    }, [id]);

    //Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setClient({ ...client, [name]: value});
    };

    //Gestion des changements des inputs pour les integer dans le formulaire
    const handleChangeNumber = ({currentTarget}) => {
        const {name, value} = currentTarget;
        if (value.trim()){
            setClient({ ...client, [name]: parseInt(value)});
        } else {
            setClient({ ...client, [name]: value});
        }
    };

    //Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            setErrors({});
            if (editing) {
                 await clientsAPI.update(id, client);
                 toast.success("Le client a bien été modifié !");
            } else {
                await clientsAPI.create(client);
                toast.success("Le client a bien été créé");
                history.replace("/clients");
            }
        } catch(error) {
            if (error.response.data.violations) {
                const apiErrors= {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
                toast.error("Des erreurs dans votre formulaire");
            }
        }
    };

    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    const formatAppointment = (str) => moment(str).format('DD/MM/YYYY HH:mm');

    const today = Date.now();
        
    return ( 
    <>
        <div className="row">
            <div className={(editing && "col-md-6" || "col-md-12")}>
                {(!editing && <h2>Création d'un client</h2>) || (<h2>Modification du client</h2>)}
                {loading && <FormLoader />}

                {!loading && (<form onSubmit={handleSubmit}>
                    <Field
                        name="lastName" 
                        label="Nom de famille" 
                        placeholder="Nom de famille du client" 
                        value={client.lastName}
                        onChange={handleChange}
                        error={errors.lastName}>
                    </Field>
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
                        type="number"
                        label="Numéro de l'adresse" 
                        placeholder="Numéro de l'adresse du client"  
                        value={client.adressNumber}
                        onChange={handleChangeNumber}
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
                        type="number"  
                        label="Numéro de sécurité sociale "
                        placeholder="Numéro de sécurité sociale du client"  
                        value={client.securitySocialNumber} 
                        onChange={handleChangeNumber}
                        error={errors.securitySocialNumber}
                    />
                    <div className="form-group">
                        <label>Commentaire</label>
                        <textarea 
                            name="note" 
                            placeholder="Note attaché au client" 
                            value={client.note}
                            onChange={handleChange}
                            error={errors.note} className="form-control" id="Textarea" rows="3"
                        />
                    </div>
                    <div className="form-group row">
                        <div id="button-popover">
                        <button disabled={((client.securitySocialNumber === "") && (client.adressNumber === ""))} type="submit" className="btn btn-success">Enregistrer</button>
                        <div 
                            className="popover fade bs-popover-top show" 
                            role="tooltip" 
                            id={(client.adressNumber.length  === 0 && "popover669561" || "hidden")}
                        >
                            <div id="arrow-register" className="arrow"></div>
                            <div className="popover-body">Veuillez remplir les champs du formulaire pour créer un client.</div>
                        </div>
                        </div>
                        <Link to="/clients" className="btn btn-link">Retour à la liste</Link>
                    </div>
                </form>)}
            </div>
            {editing && 
            (<div className="col-md-6">
                <div id="invoices">
                    <h2>Factures :</h2>
                    <table id="table-invoices" className="table table-hover">
                        <thead>
                            <tr>
                                <th>Numéro</th>
                                <th className="text-center">Date d'envoi</th>
                                <th className="text-center">Statut</th>
                                <th className="text-center">Montant</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {clientInvoices.map(invoice => 
                            <tr key={invoice.chrono}>
                                <td>
                                    <Link to={"/factures/" + invoice.id} className="nav-link">{invoice.chrono}</Link>
                                </td>
                                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                                <td className="text-center">
                                    <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                                </td>
                                <td className="text-center">{invoice.amount.toLocaleString()}€</td>
                            </tr> 
                            )}
                        </tbody>
                    </table>
                </div>
                <div id="appointements">
                    <h4>Prochain rendez-vous avec  {client.lastName} {client.firstName} :</h4>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                        {(clientDiaries.length > 0) ? 
                            (clientDiaries.map((diary, index) =>
                                <tr key={index}>
                                    <td><strong>{(formatAppointment(diary))}H</strong></td>
                                </tr>) ) : (<tr>
                                    <td><strong>Vous n'avez pas de rendez-vous prévu.</strong></td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>)}
        </div>
       
    </>);
}
 
export default ClientPage;