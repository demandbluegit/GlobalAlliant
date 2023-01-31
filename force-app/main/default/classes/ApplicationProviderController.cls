public without sharing class ApplicationProviderController {
    @AuraEnabled(cacheable=true)
    public static string getApplicationLastCreated() {
        return [SELECT Id FROM Application__c order by CreatedDate desc limit 1].Id;
    }
    @AuraEnabled(cacheable=true)
    public static List<Application_Provider__c> getApplicationProviders(Id applicationId) {
        return [SELECT Id, Address__c, City__c, Country__c, Email__c,Specialty__c, First_Name__c, Last_Name__c, NPI__c, Phone_Number__c, Name, State__c, TIN__c, Zip_Code__c FROM Application_Provider__c WHERE Id = :applicationId WITH SECURITY_ENFORCED];
    }
    @AuraEnabled
    public static List<Application_Provider__c> saveFile(String base64Data) {
        String data    = JSON.deserializeUntyped(base64Data).toString();
        list<Application_Provider__c> lstToInsert = new list<Application_Provider__c>();
        list<String> lstCSVLines = data.split('\n');
        for(Integer i = 1; i < lstCSVLines.size(); i++){
            Application_Provider__c applicationProvider = new Application_Provider__c();
            String csvLine = lstCSVLines[i];
            String prevLine = csvLine;
            Integer startIndex;
            Integer endIndex;
            while(csvLine.indexOf('"') > -1){
                if(startIndex == null){
                    startIndex = csvLine.indexOf('"');
                    csvLine = csvLine.substring(0, startIndex) + ':quotes:' + csvLine.substring(startIndex+1, csvLine.length());
                }else{
                    if(endIndex == null){
                        endIndex = csvLine.indexOf('"');
                        csvLine = csvLine.substring(0, endIndex) + ':quotes:' + csvLine.substring(endIndex+1, csvLine.length());
                    }
                }
                if(startIndex != null && endIndex != null){
                    String sub = csvLine.substring(startIndex, endIndex);
                    sub = sub.replaceAll(',', ':comma:');
                    csvLine = csvLine.substring(0, startIndex) + sub + csvLine.substring(endIndex, csvLine.length());
                    startIndex = null;
                    endIndex = null;
                }
            }
            List<String> csvRowData = new List<String>();
            
            for(String column : csvLine.split(',')){
                column = column.replaceAll(':quotes:', '').replaceAll(':comma:', ',');
                csvRowData.add(column);
                
            }
            applicationProvider.Entity_Id__c = csvRowData[0];
            applicationProvider.TIN__c = csvRowData[1];
            applicationProvider.NPI__c=csvRowData[2];
            applicationProvider.Specialty__c=csvRowData[3];
            applicationProvider.First_Name__c=csvRowData[4];
            applicationProvider.Last_Name__c=csvRowData[5];
            applicationProvider.Provider_Professional_Degree__c=csvRowData[6];
            applicationProvider.Address__c=csvRowData[7];
            applicationProvider.City__c=csvRowData[8];
            applicationProvider.County__c=csvRowData[9];
            applicationProvider.State__c=csvRowData[10];
            applicationProvider.Phone_Number__c=csvRowData[12];
            applicationProvider.Email__c=csvRowData[13];
            String applicationId=getApplicationLastCreated();
            applicationProvider.Application__c=applicationId;
            if(!String.isBlank(applicationProvider.Entity_Id__c)){
                lstToInsert.add(applicationProvider);
            }
        }
        insert lstToInsert;
        return [Select Id,First_Name__c,Last_Name__c,NPI__c, TIN__c,Address__c,Specialty__c, State__c,City__c,Country__c,Zip_Code__c,Phone_Number__c From Application_Provider__c Where CreatedDate=:system.now()];
    }
    
}