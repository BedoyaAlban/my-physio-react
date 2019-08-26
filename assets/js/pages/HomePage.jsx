import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import InvoicesAPI from "../services/invoicesAPI";
import {Pie, Bar, HorizontalBar} from 'react-chartjs-2';
import '../../css/homepage.css';


const HomePage = (props) => {

    const [invoiced, setInvoiced] = useState([]);
    const [paid, setPaid] = useState([]);
    const [canceled, setCanceled] = useState([]);

    const [january, setJanuary] = useState([]);
    const [februrary, setFebrurary] = useState([]);
    const [march, setMarch] = useState([]);
    const [april, setApril] = useState([]);
    const [may, setMay] = useState([]);
    const [june, setJune] = useState([]);
    const [july, setJuly] = useState([]);
    const [august, setAugust] = useState([]);
    const [september, setSeptember] = useState([]);
    const [october, setOctober] = useState([]);
    const [november, setNovember] = useState([]);
    const [december, setDecember] = useState([]);

    const [year, setYear] = useState([]);
    const [lastYear, setLastYear] = useState([]);
    const [twoYearsAgo, setTwoYearsAgo] = useState([]);
    

    const fetchInvoices = async () => {
        try {
            const datas =  await InvoicesAPI.findAll();
            var fillInvoiced = [];
            var fillPaid = [];
            var fillCanceled = [];

            for (let data of datas ) {
                if (data.status === "INVOICED") {
                    let invoiceInvoiced = data.status;
                    fillInvoiced.push(invoiceInvoiced); 
                }
                if (data.status === "PAID") {
                    let invoicePaid = data.status;
                    fillPaid.push(invoicePaid);
                }
                if (data.status === "CANCELLED") {
                    let invoiceCanceled = data.status;
                    fillCanceled.push(invoiceCanceled);
                }              
            }
            setCanceled(fillCanceled);
            setPaid(fillPaid);
            setInvoiced(fillInvoiced);

            var fillJanuary = [];
            var fillFebrurary = [];
            var fillMarch = [];
            var fillApril = [];
            var fillMay = [];
            var fillJune = [];
            var fillJuly = [];
            var fillJAugust = [];
            var fillSeptember = [];
            var fillOctober = [];
            var fillNovember = [];
            var fillDecember = [];

            for (let data of datas) {
                let date = new Date(data.sentAt);
                let amount = data.amount;
                if (date.getFullYear() === new Date().getFullYear()) {
                    if (date.getMonth() === 0) {
                    let januaryAmount = amount;
                    fillJanuary.push(januaryAmount);
                    }
                    if (date.getMonth() === 1) {
                        let februraryAmount = amount;
                        fillFebrurary.push(februraryAmount);
                    }
                    if (date.getMonth() === 2) {
                        let marchAmount = amount;
                        fillMarch.push(marchAmount);
                    }
                    if (date.getMonth() === 3) {
                        let aprilAmount = amount;
                        fillApril.push(aprilAmount);
                    }
                    if (date.getMonth() === 4) {
                        let mayAmount = amount;
                        fillMay.push(mayAmount);
                    }
                    if (date.getMonth() === 5) {
                        let juneAmount = amount;
                        fillJune.push(juneAmount);
                    }
                    if (date.getMonth() === 6) {
                        let julyAmount = amount;
                        fillJuly.push(julyAmount);
                    }
                    if (date.getMonth() === 7) {
                        let augustAmount = amount;
                        fillJAugust.push(augustAmount);
                    }
                    if (date.getMonth() === 8) {
                        let septemberAmount = amount;
                        fillSeptember.push(septemberAmount);
                    }
                    if (date.getMonth() === 9) {
                        let octoberAmount = amount;
                        fillOctober.push(octoberAmount);
                    }
                    if (date.getMonth() === 10) {
                        let novemberAmount = amount;
                        fillNovember.push(novemberAmount);
                    }
                    if (date.getMonth() === 11) {
                        let decemberAmount = amount;
                        fillDecember.push(decemberAmount);
                    }
                }    
            }
            setJanuary(fillJanuary);
            setFebrurary(fillFebrurary);
            setMarch(fillMarch);
            setApril(fillApril);
            setMay(fillMay);
            setJune(fillJune);
            setJuly(fillJuly);
            setAugust(fillJAugust);
            setSeptember(fillSeptember);
            setOctober(fillOctober);
            setNovember(fillNovember);
            setDecember(fillDecember);

            var fillActualYear = [];
            var fillYearLess1 = [];
            var fillYearLess2 = [];

            for (let data of datas) {
                let date = new Date(data.sentAt);
                let amount = data.amount;
                if (date.getFullYear() === yearActual) {
                    let actualYearAmount = amount;
                    fillActualYear.push(actualYearAmount);
                }
                if (date.getFullYear() === yearLess1) {
                    let yearLess1Amount = amount;
                    fillYearLess1.push(yearLess1Amount);
                }
                if (date.getFullYear() === yearLess2){
                    let yearLess2Amount = amount;
                    fillYearLess2.push(yearLess2Amount);
                }
            }
            setYear(fillActualYear);
            setLastYear(fillYearLess1);
            setTwoYearsAgo(fillYearLess2);
            
        } catch (error) {
            toast.error("Erreur lors du chargement des factures !");
            
        }
    };

    const sum = (props) => {
       var tot = props.reduce((a, b)=> a + b,0);
       return Math.round(tot);
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const data = {
        labels: [
            'Payée',
            'Facturée',
            'Annulée'
        ],
        datasets: [{
            data: [invoiced.length, paid.length, canceled.length],
            backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
            ],
            hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
            ]
        }]
    };

    const bar = {
        labels: ['Janvier', 
                'Février', 
                'Mars', 
                'Avril', 
                'Mai', 
                'Juin', 
                'Julliet', 
                'Aout', 
                'Septembre', 
                'Octobre', 
                'Novembre', 
                'Décembre'],
        datasets: [
          {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [sum(january), 
                sum(februrary), 
                sum(march), 
                sum(april), 
                sum(may), 
                sum(june), 
                sum(july), 
                sum(august), 
                sum(september), 
                sum(october), 
                sum(november), 
                sum(december)]
          }
        ]
      };

      const yearActual = new Date().getFullYear();

      const yearLess1 = yearActual - 1;

      const yearLess2 = yearActual - 2;


      const barHorizontal = {
        labels: [(yearLess2.toString()), (yearLess1.toString()), (yearActual.toString())],
        datasets: [
          {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [sum(twoYearsAgo), sum(lastYear), sum(year)]
          }
        ]
      };

      



    return ( 
    <>
        
        <div id="doughnut-invoices">
            <h2>Factures</h2>
            <Pie data={data} />
        </div>
        <div id="bar-invoices">
            <h2>Chiffre d'Affaire/Mois</h2>
            <Bar data={bar}/>
        </div>
        <div id="horizontal-bar-invoices">
            <h2>Chiffre d'Affaire/Année</h2>
            <HorizontalBar data={barHorizontal}/>
        </div>

    </>
  );
}
 
export default HomePage;