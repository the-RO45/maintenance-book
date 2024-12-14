public class MaintenanceRequestController {
    @auraEnabled(cacheable=true)
    public static list<Maintenance_Request__c> getMaintenanceRequest(){
        try{
            list<Maintenance_Request__c> listMR =[SELECT Id, Category__c,Description__c, Amount_Spent__c,Assigned_Vendor__c, Request_Date__c,Status__c,Priority__c 
                                                  from Maintenance_Request__c
                                                  Where Status__c IN ('Open','In Progress')];
            return listMR;
        }
        catch(exception e){
            return null;
        }
    }

}