import * as React from 'react';
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import ClientsAPI from '../services/clientsAPI';



class ExportClients extends React.Component {
    _exporter;
    export = () => {
        this._exporter.save();
        
    };

    constructor () {
        super(); 
        this.state = { data: []};
    }

    async componentDidMount () {

        const responses = await ClientsAPI.findAll();
        const fillData = [];
        
        for (let response of responses) {
            let clients = {
                lastName: response.lastName,
                firstName: response.firstName,
                numberInvoices: response.invoices.length,
                totalAmount: response.totalAmount,
            }
            fillData.push(clients);
        }

        this.setState({ data: fillData});
    }



    render() {
        return (

            <div>
                <button className="btn btn-primary" id="button-export-clients" onClick={this.export}>Export to Excel</button>
                
                <ExcelExport
                    data={this.state.data}
                    fileName="Client.xlsx"
                    ref={(exporter) => { this._exporter = exporter; }}
                    filterable={true}
                >
                    <ExcelExportColumn field="lastName" title="Nom" />
                    <ExcelExportColumn field="firstName" title="Prénom" />
                    <ExcelExportColumn field="numberInvoices" title="Nb de Factures" />
                    <ExcelExportColumn field="totalAmount" title="Montant Total" />
                </ExcelExport>
            </div>
        );
    }
}

export default ExportClients;   