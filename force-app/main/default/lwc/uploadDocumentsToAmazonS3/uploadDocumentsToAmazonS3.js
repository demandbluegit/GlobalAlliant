import { LightningElement, track,api,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchFiles from '@salesforce/apex/Fileuploadcttrl.fetchFiles';
import getPdfDownloadLink from '@salesforce/apex/S3Controller.getPdfDownloadLink';

export default class Fileupload extends LightningElement {
    @api recordId = 'a01DS00000HH16xYAD';
    @track lstAllFiles;
    @track isFirstUpload = true;
    @track uploaded = false;
    @track errorMessage = '';
    columnHeader = ['ENTITY_ID', 'MBI', 'First_Name', 'Last_Name','Current_Street','Current_City','Current_State','Current_Zip','Sex_Assigned_At_Birth','Sex_Orientation','Sex_Orientation_OS','Gender_Identity','Gender_Identity_OS','Race','Ethnicity_Base','Ethnicity_Expanded_1','Ethnicity_Expanded_2','Ethnicity_Expanded_3','Ethnicity_Expanded_4' ];
    excelExpandedDemographicDataDownloadTemplate;
    get acceptedFormats() {
        return ['.xls','.xlsx'];
    }
    
pdfDownloadLink;

 
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
        });
        getPdfDownloadLink() 
        .then(data => {
            console.log('pdfDownloadLink: ' + data);
            this.pdfDownloadLink = data;
        
    });
    }


 /*   @wire(getPdfDownloadLink, {})
    getPdfLink({ error, data }) {
        if (data) {
            console.log('excelExpandedDemographicDataDownloadTemplate: ' + data);
            this.excelExpandedDemographicDataDownloadTemplate = data;
            this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: this.excelExpandedDemographicDataDownloadTemplate
            }
            });
        } else {
            if(error){
                console.log('error: ', error);
            }
        }
    } */
    @wire(getPdfDownloadLink, {})
    getPdfLink({ error, data }) {
        if (data) {
            console.log('pdfDownloadLink: ' + data);
            this.pdfDownloadLink = data;
        } else {
            if(error){
                console.log('error: ', error);
            }
        }
    }
    exportDemographicsData(){
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
        downloadElement.download = 'DemographicTemplate.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click();
    }
}