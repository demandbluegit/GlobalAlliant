public without sharing class SendDocusign {
    @future(callout=true)
    public static void sendDocusign(Id mySourceId) {
        
        dfsle.Envelope myEnvelope = dfsle.EnvelopeService.getEmptyEnvelope(new dfsle.Entity(mySourceId));
        //we will use a Salesforce contact record as a Recipient here
        Contact myContact = [SELECT Id, Name, Email FROM Contact WHERE Name='Global Alliant' LIMIT 1];
        
        //use the Recipient.fromSource method to create the Recipient
        dfsle.Recipient myRecipient = dfsle.Recipient.fromSource(
            myContact.Name, // Recipient name
            myContact.Email, // Recipient email
            null, //Optional phone number
            'Community Cloud User', //Role Name. Specify the exact role name from template
            new dfsle.Entity(myContact.Id)); //source object for the Recipient
        
        //add Recipient to the Envelope
        myEnvelope = myEnvelope.withRecipients(new List<dfsle.Recipient> { myRecipient });
        
        //myTemplateId contains the DocuSign Id of the DocuSign Template
        dfsle.UUID myTemplateId = dfsle.UUID.parse('969f0894-07d2-4e44-9b3b-2c11058d007e');
        
        //create a new document for the Envelope
        dfsle.Document myDocument = dfsle.Document.fromTemplate(
            myTemplateId, // templateId in dfsle.UUID format
            'myTemplate'); // name of the template
        //add document to the Envelope
        dfsle.CustomField myField = new dfsle.CustomField ('text', '##SFApplication__c', 
                                                           mySourceId, null, true, true);
        //add document to the Envelope
        myEnvelope = myEnvelope.withDocuments(new List<dfsle.Document> { myDocument })
            .withCustomFields(new List<dfsle.CustomField> {myField});
        myEnvelope = dfsle.EnvelopeService.sendEnvelope(
            myEnvelope, // The envelope to send
            true); // Send now?
        
    }
}