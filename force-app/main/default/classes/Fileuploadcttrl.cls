public class Fileuploadcttrl {
    @AuraEnabled(cacheable=false)
    public static List<ContentDocumentLink> fetchFiles(String recordId){
        S3Controller.UploadDocToS3Server(recordId);
        return [SELECT LinkedEntityId, ContentDocument.CreatedDate, ContentDocument.Title, ContentDocument.ContentSize, ContentDocument.FileType 
                FROM ContentDocumentLink  
                WHERE LinkedEntityId =:recordId 
                ORDER by ContentDocument.CreatedDate Desc Limit 1];
    }
}