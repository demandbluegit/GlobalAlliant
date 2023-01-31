trigger ApplicationTrigger on Application__c (after insert) {
    for(Application__c application:trigger.New){
        SendDocusign.sendDocusign(application.Id);
    }
}