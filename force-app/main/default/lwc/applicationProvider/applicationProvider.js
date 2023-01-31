import { LightningElement, api, wire ,track} from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { createRecord } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import APPLICATION_PROVIDER_OBJECT from '@salesforce/schema/Application_Provider__c';
//import APPLICATION_PROVIDER_FIELDS from '@salesforce/schema/Application_Provider__c.{Address__c,Application__c,City__c,Country__c,CreatedById,Email__c,First_Name__c,LastModifiedById,Last_Name__c,NPI__c,Phone_Number__c,Name,Specialty__c,State__c,TIN__c,Zip_Code__c}';
import getApplicationProviders from '@salesforce/apex/ApplicationProviderController.getApplicationProviders';
//import getCountryPicklistValues from '@salesforce/apex/ApplicationProviderController.getCountryPicklistValues';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import saveFile from '@salesforce/apex/ApplicationProviderController.saveFile';
import getPdfDownloadLink from '@salesforce/apex/ApplicationProviderController.getPdfDownloadLink';
import getApplicationLastCreated from '@salesforce/apex/ApplicationProviderController.getApplicationLastCreated';


const columns = [
{ label: 'National Provider Identifier (NPI)', fieldName: 'NPI__c'},
{ label: 'National Provider Identifier (NPI)', fieldName: 'NPI__c'},
{ label: 'Taxpayer Identification Number (TIN)', fieldName: 'TIN__c'},
{ label: 'FirstName', fieldName: 'First_Name__c' },
{ label: 'LastName', fieldName: 'Last_Name__c'},
{ label: 'Specialty', fieldName: 'Specialty__c'}

];

const actions = [
{ label: 'View', name: 'view' },
{ label: 'Edit', name: 'edit' },
{ label: 'Delete', name: 'delete' }
];

export default class ApplicationProviderList extends NavigationMixin(LightningElement) {
@api recordId;
@wire(CurrentPageReference) pageRef;
@wire(getObjectInfo, { objectApiName: APPLICATION_PROVIDER_OBJECT })
objectInfo;
@wire(getApplicationProviders, { applicationId: '$recordId' })
applicationProviders;
//@wire(getCountryPicklistValues, { objectApiName: APPLICATION_PROVIDER_OBJECT, fieldApiName: 'Country__c' })
countryPicklistValues;
modalOpen = false;
selectedApplicationProvider;
newApplicationProvider = {};
@api recordid;
@track columns = columns;
@track data;
@track fileName = '';
@track fileUploadedFlag=false;
@track UploadFile = 'Insert Application Provider';
@track showLoadingSpinner = false;
@track isTrue = false;
@track applicationProviderRecord={};
@track applicationProviderId;
@track applicationIdLastCreated;
@track specialityOptions=[{'label':'Internal medicine','value':'Internal medicine'},{'label':'General medicine','value':'General medicine'},{'label':'Geriatric medicine','value':'Geriatric medicine'},{'label':'Family medicine','value':'Family medicine'},{'label':'Hospice','value':'Hospice'},{'label':'Palliative medicine','value':'Palliative medicine'}];
@track stateOptions=[{'label':'AL','value':'AL'},{'label':'AK','value':'AK'},{'label':'CA','value':'CA'},{'label':'CO','value':'CO'},{'label':'CT','value':'CT'},{'label':'FL','value':'FL'},{'label':'GA','value':'GA'},{'label':'IN','value':'IN'},{'label':'LA','value':'LA'},{'label':'PA','value':'PA'},{'label':'TX','value':'TX'},{'label':'NY','value':'NY'},{'label':'WA','value':'WA'}];
@track dataColumns = [{
label: 'FirstName',
fieldName: 'First_Name__c',
type: 'text',
sortable: true
},
{
label: 'LastName',
fieldName: 'Last_Name__c',
type: 'text',
sortable: true
},
{
label: 'National Provider Identifier (NPI)',
fieldName: 'NPI__c',
type: 'text',
sortable: true
},
{
label: 'Taxpayer Identification Number (TIN)',
fieldName: 'TIN__c',
type: 'text',
sortable: true
},
{
label: 'Specialty',
fieldName: 'Specialty__c',
type: 'text',
sortable: true
},
{
type: 'action',
typeAttributes: {
    rowActions: actions,
    menuAlignment: 'right'
}
}

];
selectedRecords;
filesUploaded = [];
file;
fileContents;
fileReader;
content;
MAX_FILE_SIZE = 1500000;
columnHeader = ['FirstName','LastName','National Provider Identifier (NPI)','Taxpayer Identification Number (TIN)','Specialty','Address','State','City','Country','Zip Code','Phone Number'];
connectedCallback(){
getApplicationLastCreated()
.then(result => {
    this.applicationIdLastCreated=result;
})
.catch(error => {
    this.error = error;
    this.contacts = undefined;
});
getPdfDownloadLink() 
    .then(data => {
        this.pdfDownloadLink = data;
    
});
}

handleAddProvider() {
this.newApplicationProvider = {
    Application__c: this.recordId
};
this.modalOpen = true;
}

createApplicationProvider() {
    this.applicationProviderRecord.Application__c=this.applicationIdLastCreated;
    const fields = this.applicationProviderRecord;
    let isValid = true;
    let inputFields = this.template.querySelectorAll('.validate');
    inputFields.forEach(inputField => {
        if(!inputField.checkValidity()) {
            inputField.reportValidity();
            isValid = false;
        }
    });
    if(isValid){
    createRecord({apiName: APPLICATION_PROVIDER_OBJECT.objectApiName, fields})
    .then((applicationProvider) => {
    this.applicationProviderId=applicationProvider.id;
    getApplicationProviders({applicationId:applicationProvider.id})
    .then(result => {
        this.data=result;
    })
    this.dispatchEvent(
    new ShowToastEvent({
    title: 'Success',
    message: 'Application Provider created',
    variant: 'success'
    })
    );
    this.modalOpen = false;
    
    })
    .catch(error => {
    this.dispatchEvent(
    new ShowToastEvent({
    title: 'Error creating application provider',
    message: error.body.message,
    variant: 'error'
    })
    );
    });
}
    }
    handleCancel() {
        this.modalOpen = false;
    }
    
    handleEdit(event) {
        this.selectedApplicationProvider = event.detail;
        this.newApplicationProvider = Object.assign({}, this.selectedApplicationProvider);
        this.modalOpen = true;
    }
    
    handleDelete(event) {
        deleteRecord(event.detail.Id)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Application Provider deleted',
                        variant: 'success'
                    })
                );
                return refreshApex(this.applicationProviders);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting application provider',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
    handleFilesChange(event) {
        if(event.target.files.length > 0) {
            this.filesUploaded = event.target.files;
            this.fileName = event.target.files[0].name;
            this.fileUploadedFlag=true;
            this.uploadHelper();
        }
    }
    
    handleSave() {
        if(this.filesUploaded.length > 0) {
            this.uploadHelper();
        }
        else {
            this.fileName = 'Please select a CSV file to upload!!';
        }
    
    }
    uploadHelper() {
        this.file = this.filesUploaded[0];
        if (this.file.size > this.MAX_FILE_SIZE) {
            return ;
        }
    
        this.showLoadingSpinner = true;
        this.fileReader= new FileReader();
        this.fileReader.onloadend = (() => {
        this.fileContents = this.fileReader.result;
            this.saveToFile();
        });
        this.fileReader.readAsText
        (this.file);
    }
    saveToFile() {
        saveFile({ base64Data: JSON.stringify(this.fileContents), cdbId: this.recordid})
        .then(result => {
            this.data = result;
            this.fileName='';
            this.fileUploadedFlag=false;
            this.isTrue = false;
            this.showLoadingSpinner = false;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message:'Records in '+ this.file.name + ' - inserted Successfully!!!',
                    variant: 'success',
                }),
            );
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while uploading File',
                    message: error.message,
                    variant: 'error',
                }),
            );
    
        });
    
    }
    handleRowActions(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.recordId = row.Id;
        switch (actionName) {
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Application_Provider__c',
                        actionName: 'edit'
                    }
                });
                break;
            case 'delete':
                deleteRecord(row.Id);
                return refreshApex(this.data);
                break;
        }
    }
    handleChangeEvent(event) {
        this.applicationProviderRecord[event.target.name] = event.target.value;
        }

        @wire(getPdfDownloadLink, {})
        getPdfLink({ error, data }) {
            if (data) {
                this.pdfDownloadLink = data;
            } else {
                if(error){
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
        downloadElement.download = 'ProviderTemplate.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click();
    }
}