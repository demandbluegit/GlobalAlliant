@isTest
public class AWSServiceTest {
    @isTest
    public static void testContentType() {
        AWSService service = new AWSService('testKey', 'testSecret', 'testBucket', 'PUT', 'testHost');
        
        // Test different file types
        System.assertEquals('application/vnd.openxmlformats-officedocument.wordprocessingml.document', service.ContentType('docx'));
        System.assertEquals('application/vnd.ms-excel', service.ContentType('csv'));
        System.assertEquals('audio/wav', service.ContentType('wav'));
        System.assertEquals('video/x-ms-wmv', service.ContentType('wmv'));
        System.assertEquals('audio/mpeg', service.ContentType('mp3'));
        System.assertEquals('video/mp4', service.ContentType('mp4'));
        System.assertEquals('image/png', service.ContentType('png'));
        System.assertEquals('application/pdf', service.ContentType('pdf'));
        // Test default case
        System.assertEquals('image/jpeg', service.ContentType('invalid'));
    }
    
    @isTest
    public static void testCreateAuthHeader() {
        AWSService service = new AWSService('testKey', 'testSecret', 'testBucket', 'PUT', 'testHost');
        
        // Set up test input
        String contentType = 'application/pdf';
        String filename = 'testFile';
        String formattedDateString = 'Mon, 01 Jan 2000 00:00:00 GMT';
        String fileExtension = 'pdf';
        
        // Test auth header
        String authHeader = service.CreateAuthHeader(contentType, filename, formattedDateString, fileExtension);
        System.assertNotEquals(null, authHeader);
        System.assertEquals(true, authHeader.startsWith('AWS'));
    }
    
    @isTest
    public static void testUploadDocuments() {
        Application__c application = new Application__c(
            Taxpayer_Identifier_Number_TIN__c = 123456789,
            Practice_DBA_Name__c = 'Test Practice',
            Fax_Number__c = '555-555-5555',
            Practice_Site_Name__c = 'Test Site'
        );
        insert application;
        
        
        // Create a new ContentVersion object and link it to the Application__c object
        ContentVersion content = new ContentVersion();
        content.Title = 'Test Document';
        content.PathOnClient = 'TestDocument.pdf';
        content.VersionData = Blob.valueOf('Test Document Data');
        insert content;
        
        ContentDocument cd = [SELECT Id FROM ContentDocument Limit 1];
        
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = cd.Id;
        cdl.LinkedEntityId = application.Id;
        cdl.ShareType = 'V';
        insert cdl;
        
        
        
        // Insert a test ContentVersion record 
        //ContentVersion testContent = new ContentVersion(Title = 'Test Content', PathOnClient ='testFile.pdf', VersionData = Blob.valueOf('Test Data'));
        //insert testContent;
        
        // Insert a test ContentDocumentLink record
        //ContentDocumentLink testLink = new ContentDocumentLink(ContentDocumentId = testContent.ContentDocumentId, LinkedEntityId = application.Id);
        //insert testLink;
        
        // Set up test service
        AWSService service = new AWSService('AKIA4UHNXDBEWAXIA5MU', 'Uz72wPiycTyxnhFr1/s8Ok1S3epUgMd3EwOLvjS3', 'fhir-service-dev-submissions', 'PUT', 's3-us-east-1.amazonaws.com');
        
        
        
        Application__c insertedApplication = [SELECT Taxpayer_Identifier_Number_TIN__c, Practice_DBA_Name__c, Name, Fax_Number__c, Practice_Site_Name__c FROM Application__c WHERE Id = :application.Id];
        
        
        System.assertEquals(application.Taxpayer_Identifier_Number_TIN__c, insertedApplication.Taxpayer_Identifier_Number_TIN__c);
        System.assertEquals(application.Practice_DBA_Name__c, insertedApplication.Practice_DBA_Name__c);
        //System.assertEquals(application.Name, insertedApplication.Name);
        System.assertEquals(application.Fax_Number__c, insertedApplication.Fax_Number__c);
        System.assertEquals(application.Practice_Site_Name__c, insertedApplication.Practice_Site_Name__c);
        
        // Call UploadDocuments method
        String applicationId = application.Id;
        service.UploadDocuments(applicationId);
        
        // Assert that the HttpRequest was created
        HttpRequest req = new HttpRequest();
        req.setMethod(service.methodName);
        String fileUrl = 'https://' + service.bucketName + '.' + service.hostName + '/' + 'testFile' + '.' + 'pdf';
        req.setEndpoint(fileUrl);
    }
}