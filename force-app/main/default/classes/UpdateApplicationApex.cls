public with sharing class UpdateApplicationApex {
    @AuraEnabled
    public static void updateApplication(Id applicationId, Boolean acceptAllTC, String name, String certifyingIndividualName, String certifyingIndividualTitle) {
        Application__c application = [SELECT Id, Accept_all_TC__c, Name, Certifying_Individual_Name__c, Certifying_Individual_Title__c FROM Application__c WHERE Id = :applicationId];
        application.Accept_all_TC__c = acceptAllTC;
        //application.Name = name;
        application.Certifying_Individual_Name__c = certifyingIndividualName;
        application.Certifying_Individual_Title__c = certifyingIndividualTitle;
        update application;
    }


    @AuraEnabled(cacheable=true)
    public static List<Application_Provider__c> getApplicationProviders(Id applicationId) {
        return [SELECT Id, Address__c, City__c, Country__c, Email__c, First_Name__c, Last_Name__c,Specialty__c, NPI__c, Phone_Number__c, Name, State__c, TIN__c, Zip_Code__c FROM Application_Provider__c WHERE Application__c = :applicationId WITH SECURITY_ENFORCED];
    }

    
}