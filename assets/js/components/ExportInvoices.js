import * as React from 'react';
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import invoicesAPI from '../services/invoicesAPI';
import moment from "moment";


const FormatDate = (str) => moment(str).format('DD/MM/YYYY');

class ExportInvoices extends React.Component {
    _exporter;
    export = () => {
        this._exporter.save();
        
    };

    constructor () {
        super(); 
        this.state = { data: []};
    }

    async componentDidMount () {
        const responses = await invoicesAPI.findAll();
        const fillData = [];
        
        for (let response of responses) {
            let invoices = {
                chrono: response.chrono,
                client: response.client,
                amount: response.amount,
                sentAt: FormatDate(response.sentAt),
            }
            fillData.push(invoices);
        }

        this.setState({ data: fillData});
    }
    
    render() {
        return (

            <div>
                <button className="btn btn-primary" id="export" onClick={this.export}>Export to Excel</button>
                <ExcelExport
                    data={this.state.data}
                    fileName="Factures.xlsx"
                    ref={(exporter) => { this._exporter = exporter; }}
                    filterable={true}
                >
                    <ExcelExportColumn field="chrono" title="Numéro" />
                    <ExcelExportColumn field="client.lastName" title="Nom" />
                    <ExcelExportColumn field="client.firstName" title="Prénom" />
                    <ExcelExportColumn field="sentAt" title="Date" />
                    <ExcelExportColumn field="amount" title="Montant" />
                </ExcelExport>
            </div>
        );
    }
}

export default ExportInvoices;   