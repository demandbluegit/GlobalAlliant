@isTest
public class S3ControllerTest {
    @isTest
    public static void testUploadDocToS3Server() {
        // Insert a test record to upload
        Account testAccount = new Account(Name='Test Account');
        insert testAccount;
        
        Application__c application = new Application__c(
            //Taxpayer_Identifier_Number_TIN__c = '123-45-6789',
            Practice_DBA_Name__c = 'Test Practice',
            //Name = 'Test Participant',
            Fax_Number__c = '555-555-5555',
            Practice_Site_Name__c = 'Test Site'
        );
        insert application;
        
        Application__c insertedApplication = [SELECT Practice_DBA_Name__c, Name, Fax_Number__c, Practice_Site_Name__c FROM Application__c WHERE Id = :application.Id];
        
        
        //System.assertEquals(application.Taxpayer_Identifier_Number_TIN__c, insertedApplication.Taxpayer_Identifier_Number_TIN__c);
        System.assertEquals(application.Practice_DBA_Name__c, insertedApplication.Practice_DBA_Name__c);
        //System.assertEquals(application.Name, insertedApplication.Name);
        System.assertEquals(application.Fax_Number__c, insertedApplication.Fax_Number__c);
        System.assertEquals(application.Practice_Site_Name__c, insertedApplication.Practice_Site_Name__c);
        
        // Call UploadDocuments method
        //String applicationId = application.Id;
        //service.UploadDocuments(applicationId);
        
        Test.startTest();
        S3Controller.UploadDocToS3Server(application.Id);
        Test.stopTest();
        
        // Assert that the future method was called
        //System.assertEquals(1, [SELECT COUNT() FROM AsyncApexJob WHERE Status='Completed' AND JobType='Future']);
    }
}