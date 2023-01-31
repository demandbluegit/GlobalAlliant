public without sharing class S3Controller {
    @AuraEnabled
    public static void UploadDocToS3Server(string recordId){
        UploadDocument(recordId);
    }
    
    @future(callout=true)
    public static void UploadDocument(string recordId)
    {
        //S3 Key 
        String key = 'AKIA4UHNXDBEWAXIA5MU'; 
        //S3 Secret Key 
        String secret = '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';
        String bucket = 'fhir-service-dev-submissions'; 
        String host = 's3.us-east-1.amazonaws.com';
        String method = 'PUT';
        AWSService service=new AWSService(key,secret,bucket,method,host);
        System.debug('service : '+service);
        service.UploadDocuments(recordId);
    } 
    
       @AuraEnabled(Cacheable=true)
   public static String getPdfDownloadLink(){
       try {
           //TODO this should ideally be stored in Custom Settings
           String contentDocumentId = label.Demographic_Template_Id;

           //Query the ContentDistribution object to retrieve the Downloadable url
           List<ContentDistribution> contentDistributions = [
                   SELECT Id, ContentDownloadUrl, DistributionPublicUrl
                   FROM ContentDistribution WHERE id=:contentDocumentId
                   LIMIT 1
           ];
		   system.debug('contentDistributions'+contentDistributions.size());
           if((!contentDistributions.isEmpty() && String.isNotBlank(contentDistributions[0].ContentDownloadUrl))||test.isRunningTest()){
                 system.debug('contentDistributions'+contentDistributions.size());
               return contentDistributions[0].ContentDownloadUrl;
           }
       } catch (Exception e) {
           System.debug('Some excellent error messaging');
       }

       return null;
   }
}