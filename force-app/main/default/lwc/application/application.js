import { LightningElement, track } from 'lwc';
import { createRecord,updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import APPLICATION_OBJECT from '@salesforce/schema/Application__c';
import TIN_FIELD from '@salesforce/schema/Application__c.Taxpayer_Identifier_Number_TIN__c';
import PRACTICE_SITE_NAME_FIELD from '@salesforce/schema/Application__c.Practice_Site_Name__c';
import PRACTICE_DBA_NAME_FIELD from '@salesforce/schema/Application__c.Practice_DBA_Name__c';
import ADDRESS_FIELD from '@salesforce/schema/Application__c.Address__c';
import CITY_FIELD from '@salesforce/schema/Application__c.City__c';
import STATE_FIELD from '@salesforce/schema/Application__c.State__c';
import COUNTY_FIELD from '@salesforce/schema/Application__c.County__c';
import ZIP_FIELD from '@salesforce/schema/Application__c.Zip_Code__c';
import PRACTICE_SITE_PHONE_FIELD from '@salesforce/schema/Application__c.Phone_Number__c';
import PRACTICE_SITE_FAX_FIELD from '@salesforce/schema/Application__c.Fax_Number__c';
import IS_OWNED_BY_LARGER_ORG_FIELD from '@salesforce/schema/Application__c.Is_Owned_By_Larger_Org__c';
import ORGANIZATION_NAME_FIELD from '@salesforce/schema/Application__c.Organization_Name__c';
import ORGANIZATION_ADDRESS1_FIELD from '@salesforce/schema/Application__c.Organization_Address__c';
import ORGANIZATION_CITY_FIELD from '@salesforce/schema/Application__c.Organization_City__c';
import ORGANIZATION_COUNTY_FIELD from '@salesforce/schema/Application__c.Organization_Country__c';
import ORGANIZATION_STATE_FIELD from '@salesforce/schema/Application__c.Organization_State__c';
import ORGANIZATION_ZIP_FIELD from '@salesforce/schema/Application__c.Organization_Zip_Code__c';
import ORGANIZATION_PRIMARY_CONTACT_FIELD from '@salesforce/schema/Application__c.Organization_Primary_Contact_Name__c';
import ORGANIZATION_PRIMARY_CONTACT_TITLE_FIELD from '@salesforce/schema/Application__c.Organization_Primary_Contact_Title__c';
import ORGANIZATION_PRIMARY_CONTACT_PHONE_FIELD from '@salesforce/schema/Application__c.Organization_Primary_Contact_Phone__c';
import ORGANIZATION_PRIMARY_CONTACT_EMAIL_FIELD from '@salesforce/schema/Application__c.Organization_Primary_Contact_Email__c';
import ORGANIZATION_PROVIDERS_FIELD from '@salesforce/schema/Application__c.Organization_Name__c';
import TERMS_CONDITIONS_ACCEPTED_FIELD from '@salesforce/schema/Application__c.Accept_all_TC__c';
import INDEPENDENT_PRACTICE_OWNERSHIP_TYPE from '@salesforce/schema/Application__c.Independent_Practice_Ownership_Type__c';
import INDEPENDENT_PRACTICE_OWNERSHIP_TYPE_OTHER from '@salesforce/schema/Application__c.Independent_Practice_Ownership_Other__c';
import PROVIDERS_AND_FACILITIES from '@salesforce/schema/Application__c.Providers_and_facilities__c';
import PRACTICE_OWNER_FIELD from '@salesforce/schema/Application__c.Name';
import CERTIFYING_INDIVIDUAL_NAME_FIELD from '@salesforce/schema/Application__c.Certifying_Individual_Name__c';
import CERTIFYING_INDIVIDUAL_TITLE_FIELD from '@salesforce/schema/Application__c.Certifying_Individual_Title__c';
import APPLICATION_ID from '@salesforce/schema/Application__c.Id';





export default class PracticeIdentificationForm extends LightningElement {
    @track application = {};
    

    options = [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
    ];
    organizationProviderOptions = [
        { label: 'Cancer or specialty hospitals', value: 'Cancer or specialty hospitals' },
        { label: 'Psychiatric hospital or other mental or behavioral health facility', value: 'Psychiatric hospital or other mental or behavioral health facility' },
        { label: 'Hospital(s) receiving disproportionate share (DSH) payments or uncompensated care payments from Medicare or Medicaid', value: 'Hospital(s) receiving disproportionate share (DSH) payments or uncompensated care payments from Medicare or Medicaid' },
        { label: 'Community health center (other than a federally qualified health center)', value: 'Community health center (other than a federally qualified health center)' },
        { label: 'Skilled nursing facility (SNF)', value: 'Skilled nursing facility (SNF)' },
        { label: 'Inpatient rehabilitation facility (IRF)', value: 'Inpatient rehabilitation facility (IRF)' },
        { label: 'Dialysis facility', value: 'Dialysis facility' },
        { label: 'None of the above', value: 'None of the above' },
    ];
    @track showOrganizationInfo  = false;
    @track showOrganizationInfoOnNext = false;
    @track selectedOthers=false;
    @track showTermsAndCondSection = false;
    @track showMainForm = true;
    @track requiredFieldsMissing = false;
    @track showOwnerShip = true;
    @track showThankYouMessage = false;
    appAccountIdafterInsert = '';

    @track acceptAllTC;
    @track name;
    @track certifyingIndividualName;
    @track certifyingIndividualTitle;

    handleChange(event) {
        this.requiredFieldsMissing = false;
        const fieldName = event.target.fieldName;
        this.application[fieldName] = event.target.value;
        if(fieldName == 'Independent_Practice_Ownership_Type__c' && event.target.value =='Other (specify).'){
            this.selectedOthers = true;
        }
    }

    handleOwnershipChange(event) {
        if(event.target.value =='true'){
            this.showOrganizationInfo  = true;
        }else{
            this.showOrganizationInfo  = false;
        }
        this.application.Is_Owned_By_Larger_Org__c = this.showOrganizationInfo;
    }

    handleOrganizationProvidersChange(event) {
        this.application.Organization_Name__c = event.detail.value.join(';');
    }
    handleTermsConditionsChange(event) {
        this.application.Accept_all_TC__c = event.target.checked;
    }
    handleNext() {
        if(this.showOrganizationInfo == true){
            this.showOrganizationInfoOnNext = true;
        }else if(this.showOrganizationInfo == false){
            this.showTermsAndCondSection = true;
        }
        this.showMainForm = false;
        this.showOwnerShip = false;
        
       
    }
    handleTermsChange(event){
        if(event.target.value = true){
            this.application.Accept_all_TC__c = true;
        }else{
            this.application.Accept_all_TC__c = false;
        }
    }
    handleBack(){
        if(this.showOrganizationInfo == true){
            this.showOrganizationInfoOnNext = true;
        }else if(this.showOrganizationInfo == false) {
            this.showMainForm = true;
        }
        this.showTermsAndCondSection = false;
    }
    handleSubmit() {
        const fields = {};
        if(this.application.Taxpayer_Identifier_Number_TIN__c != null){
            fields[TIN_FIELD.fieldApiName] = this.application.Taxpayer_Identifier_Number_TIN__c;
            this.requiredFieldsMissing = false;
        }else{
            this.requiredFieldsMissing = true;
        }
        if(this.application.Practice_Site_Name__c != null){
            fields[PRACTICE_SITE_NAME_FIELD.fieldApiName] = this.application.Practice_Site_Name__c;
            
        }else{
            
        }
        if(this.application.Practice_DBA_Name__c != null){
            fields[PRACTICE_DBA_NAME_FIELD.fieldApiName] = this.application.Practice_DBA_Name__c;
            
        }else{
            
        }
        if(this.application.Address__c != null){
            fields[ADDRESS_FIELD.fieldApiName] = this.application.Address__c;
            this.requiredFieldsMissing = false;
        }else{
            this.requiredFieldsMissing = true;
        }
        if(this.application.City__c !=null){
            fields[CITY_FIELD.fieldApiName] = this.application.City__c;
            this.requiredFieldsMissing = false;
        }else{
            this.requiredFieldsMissing = true;
        }
        if(this.application.State__c !=null){
            fields[STATE_FIELD.fieldApiName] = this.application.State__c;
            this.requiredFieldsMissing = false;
        }else{
            this.requiredFieldsMissing = true;
        }
        if(this.application.County__c != null){
            fields[COUNTY_FIELD.fieldApiName] = this.application.County__c;
            this.requiredFieldsMissing = false;
        }else{
            this.requiredFieldsMissing = true;
        }
        if(this.application.Zip_Code__c !=null){
            fields[ZIP_FIELD.fieldApiName] = this.application.Zip_Code__c;
            this.requiredFieldsMissing = false;
        }else{
            this.requiredFieldsMissing = true;
        }
        if(this.application.Phone_Number__c !=null){
            fields[PRACTICE_SITE_PHONE_FIELD.fieldApiName] = this.application.Phone_Number__c;
            this.requiredFieldsMissing = false;
        }else{
            this.requiredFieldsMissing = true;
        }
        if(this.application.Fax_Number__c != null){
            fields[PRACTICE_SITE_FAX_FIELD.fieldApiName] = this.application.Fax_Number__c;
            this.requiredFieldsMissing = false;
        }else{
            this.requiredFieldsMissing = true;
        }
        if(this.application.Is_Owned_By_Larger_Org__c != null){
            fields[IS_OWNED_BY_LARGER_ORG_FIELD.fieldApiName] = this.application.Is_Owned_By_Larger_Org__c;
            
        }else{
            
        }
        if(this.application.Independent_Practice_Ownership_Type__c != null){
            fields[INDEPENDENT_PRACTICE_OWNERSHIP_TYPE.fieldApiName] = this.application.Independent_Practice_Ownership_Type__c;
        }else{
            
        }
        
        if(this.selectedOthers == true){
            if(this.application.Independent_Practice_Ownership_Other__c !=null){
                fields[INDEPENDENT_PRACTICE_OWNERSHIP_TYPE_OTHER.fieldApiName]=this.application.Independent_Practice_Ownership_Other__c;
                this.requiredFieldsMissing = false;
            }else{
                this.requiredFieldsMissing = true;
            }
            
        }
       
      
        console.log('fields ' + this.fields);
        const recordInput = { apiName: APPLICATION_OBJECT.objectApiName, fields };
        
        if(this.requiredFieldsMissing != true && this.appAccountIdafterInsert == '' && this.appAccountIdafterInsert != undefined && this.appAccountIdafterInsert !=null){
            createRecord(recordInput)
            .then(appAccount => {
                this.appAccountIdafterInsert =appAccount.id;
                this.requiredFieldsMissing = false;
                if(this.appAccountIdafterInsert != undefined && this.appAccountIdafterInsert !=null){
                    this.handleNext();
                }
                
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating application',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        }else if (this.appAccountIdafterInsert != '' && this.appAccountIdafterInsert != undefined && this.appAccountIdafterInsert !=null){
            if(this.appAccountIdafterInsert != ''){ 
                fields[APPLICATION_ID.fieldApiName] = this.appAccountIdafterInsert;
            }
            const recordInputUpdate = { fields:fields};
            updateRecord(recordInputUpdate)
            .then((updatedNewApp)=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Application updated',
                        variant: 'success'
                    })
                );
                this.requiredFieldsMissing = false;
                if(this.appAccountIdafterInsert != undefined && this.appAccountIdafterInsert !=null){
                    this.handleNext();
                }
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating application',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        }
        
    }
    handleOwnerSubmit(){
        const ownerFields = {};
        if(this.application.Is_Owned_By_Larger_Org__c == true){
            if(this.appAccountIdafterInsert != ''){ 
                ownerFields[APPLICATION_ID.fieldApiName] = this.appAccountIdafterInsert;
            }
            if(this.application.Organization_Name__c != null){
                ownerFields[ORGANIZATION_NAME_FIELD.fieldApiName] = this.application.Organization_Name__c;
                this.requiredFieldsMissing = false;
            }else{
                this.requiredFieldsMissing = true;
            }
            if(this.application.Organization_Address__c !=null){
                ownerFields[ORGANIZATION_ADDRESS1_FIELD.fieldApiName] = this.application.Organization_Address__c;
                this.requiredFieldsMissing = false;
            }else{
                this.requiredFieldsMissing = true;
            }
            if(this.application.Organization_City__c != null){
                ownerFields[ORGANIZATION_CITY_FIELD.fieldApiName] = this.application.Organization_City__c;
                this.requiredFieldsMissing = false;
            }else{
                this.requiredFieldsMissing = true;
            }
            if(this.application.Organization_Country__c !=null){
                ownerFields[ORGANIZATION_COUNTY_FIELD.fieldApiName] = this.application.Organization_Country__c;
                this.requiredFieldsMissing = false;
            }else{
                this.requiredFieldsMissing = true;
            }
            if(this.application.Organization_State__c !=null){
                ownerFields[ORGANIZATION_STATE_FIELD.fieldApiName] = this.application.Organization_State__c;
                this.requiredFieldsMissing = false;
            }else{
                this.requiredFieldsMissing = true;
            }
            if(this.application.Organization_Zip_Code__c !=null){
                ownerFields[ORGANIZATION_ZIP_FIELD.fieldApiName] = this.application.Organization_Zip_Code__c;
                this.requiredFieldsMissing = false;
            }else{
                this.requiredFieldsMissing = true;
            }
            if(this.application.Organization_Primary_Contact_Name__c != null){
                ownerFields[ORGANIZATION_PRIMARY_CONTACT_FIELD.fieldApiName] = this.application.Organization_Primary_Contact_Name__c;
                this.requiredFieldsMissing = true;
            }else{
                this.requiredFieldsMissing = true;
            }
            if(this.application.Organization_Primary_Contact_Title__c !=null){
                ownerFields[ORGANIZATION_PRIMARY_CONTACT_TITLE_FIELD.fieldApiName] = this.application.Organization_Primary_Contact_Title__c;
                this.requiredFieldsMissing = false;
            }else{
                this.requiredFieldsMissing = true;
            }
            if(this.application.Organization_Primary_Contact_Phone__c !=null){
                ownerFields[ORGANIZATION_PRIMARY_CONTACT_PHONE_FIELD.fieldApiName] = this.application.Organization_Primary_Contact_Phone__c;
                this.requiredFieldsMissing = false;
            }else{
                this.requiredFieldsMissing = true;
            }
            if(this.application.Organization_Primary_Contact_Email__c !=null){
                ownerFields[ORGANIZATION_PRIMARY_CONTACT_EMAIL_FIELD.fieldApiName] = this.application.Organization_Primary_Contact_Email__c;
                this.requiredFieldsMissing = false;
            }else{
                this.requiredFieldsMissing = true;
            }
            if(this.application.Organization_Name__c !=null){
                ownerFields[ORGANIZATION_PROVIDERS_FIELD.fieldApiName] = this.application.Organization_Name__c;
                this.requiredFieldsMissing = false;
            }else{
                this.requiredFieldsMissing = true;
            }
            if(this.application.Providers_and_facilities__c !=null){
                ownerFields[PROVIDERS_AND_FACILITIES.fieldApiName]=this.application.Providers_and_facilities__c;
                        this.requiredFieldsMissing = false;
            }else{
                        this.requiredFieldsMissing = true;
            }
    }
        const recordInput = { fields:ownerFields};
       if(this.requiredFieldsMissing != true){
        updateRecord(recordInput)
        .then((updatedApp)=> {
            console.log('updated recordInput JSON' + JSON.stringify(updatedApp));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Application updated',
                    variant: 'success'
                })
            );
            this.showOrganizationInfoOnNext = false;
            this.showMainForm = false;
            this.showTermsAndCondSection = true;
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating application',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
       }
}
    handleOwnerSubmitBack(){
        this.showOrganizationInfoOnNext = false;
        this.showMainForm= true;
    }
    handleTermsSubmit(){
        const termFields = {};
        if(this.appAccountIdafterInsert != ''){ 
            termFields[APPLICATION_ID.fieldApiName] = this.appAccountIdafterInsert;
        }
        if(this.application.Accept_all_TC__c !=null){
            termFields[TERMS_CONDITIONS_ACCEPTED_FIELD.fieldApiName] = this.application.Accept_all_TC__c;
        }else{
            this.requiredFieldsMissing = true;
        }
        if(this.application.Certifying_Individual_Title__c !=null){
            termFields[CERTIFYING_INDIVIDUAL_TITLE_FIELD.fieldApiName] = this.application.Certifying_Individual_Title__c;
        }else{
            this.requiredFieldsMissing = true;
        }
        if(this.application.Certifying_Individual_Title__c !=null){
            termFields[CERTIFYING_INDIVIDUAL_NAME_FIELD.fieldApiName] = this.application.Certifying_Individual_Name__c;
        }else{
            this.requiredFieldsMissing = true;
        }
        const recordInput = { fields:termFields };
if(this.requiredFieldsMissing != true){
    updateRecord(recordInput)
    .then((updatedApp)=> {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Application updated',
                variant: 'success'
            })
        );
        this.application = {};
        this.showTermsAndCondSection = false;
        this.showOrganizationInfoOnNext = false;
        this.showThankYouMessage = true;
    })
    .catch(error => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error creating application',
                message: error.body.message,
                variant: 'error'
            })
        );
    });
}
      
    }
}