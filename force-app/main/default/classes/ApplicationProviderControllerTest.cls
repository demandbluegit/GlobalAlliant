@isTest
public class ApplicationProviderControllerTest {
  
    static testMethod void testSaveDataMethod() {
        String base64Data='FirstName,LastName,National Provider Identifier (NPI),Taxpayer Identification Number (TIN),Specialty,Address,State,City,Country,Zip Code,Phone Number\r\ntest,test,1234,1234,test,test,test,test,INDIA,12345,1234567899\r\n';
        List<Application_Provider__c> ApplicationProvider=ApplicationProviderController.saveFile(JSON.serialize(base64Data));
        system.assertEquals(1, ApplicationProvider.size());
    }
    
    static testMethod void testgetDataMethod() {
            String base64Data='FirstName,LastName,National Provider Identifier (NPI),Taxpayer Identification Number (TIN),Specialty,Address,State,City,Country,Zip Code,Phone Number\r\ntest,test,1234,1234,test,test,test,test,INDIA,12345,1234567899\r\n';
       	   List<Application_Provider__c> ApplicationProvider=ApplicationProviderController.saveFile(JSON.serialize(base64Data));
          List<Application_Provider__c> getApplicationProvider= ApplicationProviderController.getApplicationProviders(ApplicationProvider[0].Id);
        ApplicationProviderController.getPdfDownloadLink();
        system.assertEquals(1, getApplicationProvider.size());
    }
    
}