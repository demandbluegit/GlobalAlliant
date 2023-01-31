public with sharing class UpdateApplicationController {
@AuraEnabled
public static void UpdateApplicationController(Id applicationId, Boolean acceptAllTC, String practiceParticipantName, String certifyingIndividualName, String certifyingIndividualTitle) {
    Application__c application = [SELECT Id FROM Application__c WHERE Id = :applicationId];
    application.Accept_all_TC__c = acceptAllTC;
    application.Name = practiceParticipantName;
    application.Certifying_Individual_Name__c = certifyingIndividualName;
    application.Certifying_Individual_Title__c = certifyingIndividualTitle;
    update application;
}
}