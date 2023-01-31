import { LightningElement, track,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchFiles from '@salesforce/apex/Fileuploadcttrl.fetchFiles';
export default class Fileupload extends LightningElement {
    @api recordId = 'a01DS00000HH16xYAD';
    @track lstAllFiles;
    @track isFirstUpload = true;
    @track uploaded = false;
    @track errorMessage = '';
    get acceptedFormats() {
        return ['.pdf','.png','.jpg','.xls','.xlsx'];
    }
    columnHeader = ['ID', 'FirstName', 'LastName', 'Email' ];

    handleUploadFinished(event) {
        if (this.isFirstUpload) {
            this.errorMessage = 'NPI and TIN missing for certain providers. Please make sure all the details are available for all the providers';
            //alert(this.errorMessage);
            this.isFirstUpload = false;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while uploading Expanded Demographics file',
                    message: this.errorMessage,
                    variant: 'error'
                })
            );
        } else {
            const file = event.detail.files[0];
            this.uploaded = true;
            //alert('File uploaded successfully');

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Expanded Demographics file is successfully uploaded',
                    message: this.errorMessage,
                    variant: 'success'
                })
            );
        }
        this.connectedCallback();
    }
 
    connectedCallback() {
        fetchFiles({recordId:this.recordId})
        .then(result=>{
            this.lstAllFiles = result; 
            this.errorMessage = undefined;
        }).catch(error=>{
            this.lstAllFiles = undefined; 
            this.errorMessage = error;
        })
    }

    exportContactData(){
        // Prepare a html table
        let doc = '<table>';
        // Add styles for the table
        doc += '<style>';
        doc += 'table, th, td {';
        doc += '    border: 1px solid black;';
        doc += '    border-collapse: collapse;';
        doc += '}';          
        doc += '</style>';
        // Add all the Table Headers
        doc += '<tr>';
        this.columnHeader.forEach(element => {            
            doc += '<th>'+ element +'</th>'           
        });
        doc += '</tr>';
        // Add the data rows
      /*  this.conatctData.forEach(record => {
            doc += '<tr>';
            doc += '<th>'+record.Id+'</th>'; 
            doc += '<th>'+record.FirstName+'</th>'; 
            doc += '<th>'+record.LastName+'</th>';
            doc += '<th>'+record.Email+'</th>'; 
            doc += '</tr>';
        }); */
        doc += '</table>';
        var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
        let downloadElement = document.createElement('a');
        downloadElement.href = element;
        downloadElement.target = '_self';
        // use .csv as extension on below line if you want to export data as csv
        downloadElement.download = 'Data.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click();
    }
}