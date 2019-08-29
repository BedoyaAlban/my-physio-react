import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapFontAwesome from "@fullcalendar/bootstrap";
import diaryAPI from '../services/diaryAPI';
import { toast } from "react-toastify";
import clientsAPI from '../services/clientsAPI';
import moment from "moment";
import "@fullcalendar/core/main.js";
import "@fullcalendar/daygrid/main.js";
import "@fullcalendar/bootstrap/main.js";
import '../../css/diarypage.css';
import '../../css/main.scss'; // webpack must be configured to do this
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/bootstrap/main.css";

const DiaryPage = ({history, match}) => {

  const [diaries, setDiaries] = useState([]);
  const [clients, setClient] = useState([]);
  const [idDiary, setIdDiary] = useState(0);
  const [modifing, setModifing] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [diary, setDiary] = useState({
    date: "",
    startSession: "",
    endSession: "",
    clients: ""
  });

  const [name, setName] = useState({
    firstName: "",
    lastName: ""
  });
  

  const fetchDiaries = async () => {
    try {
        const datas =  await diaryAPI.findAll();
        var tableau = [];

        for(let data of datas){

          let eventDiaries = [{
            id: data.id,
            title: data.clients.lastName + " " + data.clients.firstName + " : " + data.clients.note, // a property!
            start: new Date(data.startSession), // a property!
            backgroundColor: "rgb(94, 147, 237)",
            borderColor: "rgb(94, 147, 237)",
            textColor: "rgb(0, 0, 0)",
          }]

          tableau.push(eventDiaries);
          if (idDiary.ID === 0) setIdDiary({...idDiary, ID: eventDiaries[0].id});
        }

        setDiaries(tableau);
        
    } catch (error) {
        toast.error("Erreur lors du chargement des rendez-vous !");
    }
  };

  const fetchClients = async () => {
    try {
        const data = await clientsAPI.findAll();
        setClient(data);
        if (!diary.clients) setDiary({...diary, clients: data[0].id });
    } catch (error) {
        toast.error("Une erreur est survenue !");
    }
  };

  const fetchDiary = async id => {
    try {
      const data = await diaryAPI.find(id);
      setDiary({...diary, clients: data.clients.id});
      setName({...name, firstName: data.clients.firstName, lastName: data.clients.lastName});
    } catch (error) {
      toast.error("Une erreur est survenue !");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);
 
  useEffect(() => {
    fetchDiaries();
  }, []);
  
  const formatDate = (str) => moment(str).format('DD/MM/YYYY à HH:mm');

  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    setDiary({ ...diary, [name]: value});
  };

  const handleDateClick =  arg => {

    arg.jsEvent.preventDefault();
    
    if (modifing) {
        var modal3 = document.getElementById("modal3");
        modal3.style.display = "block";

        var dateModified = document.getElementById("date-modified");
        dateModified.innerHTML = "Le " + formatDate(arg.dateStr) + "H ?";
        setDiary({...diary, date: arg.date, startSession: arg.date, endSession: arg.date});
    } else {
      var modal = document.getElementById("modal");
      var subclient = document.getElementById("info");
 
      subclient.innerHTML = "Voulez-vous prendre un rendez-vous le " + formatDate(arg.dateStr) + "H ?";
      modal.style.display = "block";
    
      setDiary({...diary, date: arg.date, startSession: arg.date, endSession: arg.date});
    } 
  };
  
  const handleModificationEvent = async event => {
    event.preventDefault();

    const data = idDiary;

    try {
        await diaryAPI.update(data.ID, diary);
        toast.success("Le rendez-vous a bien été modifié !");
    } catch(error) {
      toast.error("Erreur lors de la modification du rendez-vous !");
    }
  };

  const handleDeleteEvent = async event => {
    event.preventDefault();

    const data = idDiary;

    try {
      await diaryAPI.delete(data.ID);
      toast.success("Le rendez-vous a bien été annulé !");
    } catch (error) {
      toast.error("Erreur lors de la suppression du rendez-vous !");
    }
  };
  
  const handleEventClick = arg => {
    setClicking(true);
    arg.jsEvent.preventDefault();
    setIdDiary({...idDiary, ID: arg.event.id});
    fetchDiary(arg.event.id);

    var diaryInfo = document.getElementById("diary-info");
    var modal2 = document.getElementById("modal2");
    modal2.style.display = "block";

    diaryInfo.innerHTML = "Le " + formatDate(arg.dateStr) + "H";
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await diaryAPI.create(diary);
        toast.success("Le rendez-vous a bien été enregistrée !");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du rendez-vous !");
    }
  };

  const closeModal = (event) => {
    event.preventDefault();

      var closeModal = document.getElementById("modal");
      var diaryInfo = document.getElementById("info");
      diaryInfo.innerHTML= "";
      closeModal.style.display = "none";

      setClicking(false);
  };

  const closeModal2 = (event) => {
    event.preventDefault();

      var closeModal2 = document.getElementById("modal2");
      var subclient = document.getElementById("diary-info");
      subclient.innerHTML= "";
      closeModal2.style.display = "none";
      
      setClicking(false);
  };

  const closeModal3 = (event) => {
    event.preventDefault();

      var closeModal2 = document.getElementById("modal3");
      var dateModified = document.getElementById("date-modified");
      dateModified.innerHTML= "";
      closeModal2.style.display = "none";

      setClicking(false);
  };

  const handleModification = (event) => {
    event.preventDefault();
    
      const data = idDiary;
      fetchDiary(data.ID);
      setModifing(true);
      var modal2 = document.getElementById("modal2");
      modal2.style.display= "none";
      toast.info("Cliquez sur la tranche horaire du prochain rendez-vous pour le modifier.");
  };

  const backAgenda = () => {
    history.go("/diary");
  };

  const handleHover = arg => { 
    
    if(modifing) {

    } else {
    
    arg.jsEvent.preventDefault();
    var showPop = document.createElement("DIV");
    var att = document.createAttribute("id");
    att.value = "popover635692";
    showPop.setAttributeNode(att);
    
    showPop.innerHTML = arg.event.title;

    arg.el.append(showPop);    
    }
  };

  const handleHoverEnd = arg => {

    if (clicking) {

    } else {

      arg.jsEvent.preventDefault();
      var endPop = document.getElementById("popover635692");

    arg.el.removeChild(endPop);
    }
  };
   
  return ( 
    <>
      <div id="modal">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div  className="modal-header">
              <h5 id="info" className="modal-title"></h5>
            </div>
            <form id="submit-client-for-rdv" onSubmit={handleSubmit}>
              <div className="modal-body">
              <label htmlFor="clients" >Sélectionner votre client :</label>
              <select 
                onChange={handleChange}  
                name="clients"  
                id="clients" 
                className={"form-control"}
              >
                {clients.map(client => (
                  <option key={client.id} value={client.id}> 
                      {client.firstName} {client.lastName} 
                  </option>
                ))}
              </select>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">Enregistrer</button>
                <button type="button" id="close" onClick={closeModal} className="btn btn-danger" >Annuler</button>
                <button type="button" onClick={backAgenda} className="btn btn-link">Retour Agenda</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="modal2">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div  className="modal-header">
              <h5 className="modal-title">Rendez-vous de : {name.firstName} {name.lastName}</h5>
            </div>
            <form id="cancel-appointment">
              <div id="diary-info" className="modal-body"></div>
              <div className="modal-footer">
                <button type="button" id="modify-appointment" onClick={handleModification} className="btn btn-primary">Modifier</button>
                <button type="submit" id="mouse-event" onClick={handleDeleteEvent} className="btn btn-success">Supprimer</button>
                <button type="button" onClick={closeModal2} className="btn btn-danger" >Annuler</button>
                <button type="button" onClick={backAgenda} className="btn btn-link">Retour Agenda</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    
      <div id="modal3">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div  className="modal-header">
              <h5 id="info" className="modal-title">Modifier le rendez-vous de {name.firstName} {name.lastName}</h5>
            </div>
            <form id="submit-client-for-rdv" onSubmit={handleModificationEvent}>
              <div className="modal-body" id="date-modified"></div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">Modifier</button>
                <button type="button" id="close-modal3" onClick={closeModal3}  className="btn btn-danger" >Annuler</button>
                <button type="button" onClick={backAgenda} className="btn btn-link">Retour Agenda</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div id="diary-content">
        <FullCalendar 
          defaultView="timeGridWeek" 
          header={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
          }} 
          height="auto"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrapFontAwesome, 'bootstrap' ]}
          themeSystem= 'bootstrap'
          timeZone="local"
          locale="fr"
          allDaySlot={false}
          weekends={true} 
          minTime="08:00:00"
          maxTime="20:00:00"
          weekNumbers={true}
          bootstrapFontAwesome={true}
          slotDuration='00:30:00'
          eventSources={diaries}
          eventDurationEditable={true}
          duration="00:30:00"
          forceEventDuration={true}
          defaultTimedEventDuration="00:30:00"
          nowIndicator={true} 
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventMouseEnter={handleHover}
          eventMouseLeave={handleHoverEnd}
        />
      </div>
    </>
  );
}
 
export default DiaryPage;
