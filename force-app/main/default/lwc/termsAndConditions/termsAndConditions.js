import { LightningElement, api, wire, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import APPLICATION_OBJECT from '@salesforce/schema/Application__c';
import ACCEPT_ALL_TC_FIELD from '@salesforce/schema/Application__c.Accept_all_TC__c';
import NAME_FIELD from '@salesforce/schema/Application__c.Name';
import CERTIFYING_INDIVIDUAL_NAME_FIELD from '@salesforce/schema/Application__c.Certifying_Individual_Name__c';
import CERTIFYING_INDIVIDUAL_TITLE_FIELD from '@salesforce/schema/Application__c.Certifying_Individual_Title__c';

export default class UpdateApplication extends LightningElement {
    @api recordId;
    @track acceptAllTC;
    @track name;
    @track certifyingIndividualName;
    @track certifyingIndividualTitle;

    handleAcceptAllTCChange(event) {
        this.acceptAllTC = event.target.checked;
    }

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleCertifyingIndividualNameChange(event) {
        this.certifyingIndividualName = event.target.value;
    }

    handleCertifyingIndividualTitleChange(event) {
        this.certifyingIndividualTitle = event.target.value;
    }

    updateApplication() {
        const fields = {};
        fields[ACCEPT_ALL_TC_FIELD.fieldApiName] = this.acceptAllTC;
        fields[NAME_FIELD.fieldApiName] = this.name;
        fields[CERTIFYING_INDIVIDUAL_NAME_FIELD.fieldApiName] = this.certifyingIndividualName;
        fields[CERTIFYING_INDIVIDUAL_TITLE_FIELD.fieldApiName] = this.certifyingIndividualTitle;
        const recordInput = {fields};

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Application updated',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating application',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}