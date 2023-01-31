import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SendParticipantAgreement extends LightningElement {
    @api recordId;
    pdfDownloadLink
    sendAgreement() {
      pdfDownloadLink='https://demo.docusign.net/Signing/?ti=12de9cd68fd94199a88f524ad7472c8d';
          }
}