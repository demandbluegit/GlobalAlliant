@isTest
public class FileuploadcttrlTest {
    @isTest
    static void testFetchFiles() {
        // Create a test record for the Application__c object
        Application__c application = new Application__c(
            Taxpayer_Identifier_Number_TIN__c = 123456789,
            Practice_DBA_Name__c = 'Test Practice',
            Fax_Number__c = '555-555-5555',
            Practice_Site_Name__c = 'Test Site'
        );
        insert application;
        
        // Create a test content document and link it to the Application__c record
        ContentVersion cv = new ContentVersion();
        cv.Description  = 'test description';
        cv.PathOnClient ='test_file.txt';
        cv.Title = 'test file '+DateTime.now();
        cv.versiondata=Blob.valueOf('test file body');
        insert cv;
        
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id =: cv.Id].ContentDocumentId;
        cdl.LinkedEntityId = application.Id; 
        cdl.ShareType = 'V';
        insert cdl;
        
        // Call the fetchFiles method and verify the results
        List<ContentDocumentLink> result = Fileuploadcttrl.fetchFiles(application.Id);
        System.assertEquals(1, result.size(), 'The wrong number of files were returned');
        //System.assertEquals(cv.ContentDocumentId, result[0].ContentDocumentId, 'The wrong file was returned');
        System.assertEquals(application.Id, result[0].LinkedEntityId, 'The file was not linked to the correct record');
    }
    
}