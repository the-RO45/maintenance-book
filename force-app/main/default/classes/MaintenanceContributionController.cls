public class MaintenanceContributionController {
    @auraEnabled(cacheable=true)
    public static list<Maintenance_Contribution__c> getMaintenanceContribution(String userId, String recordTypeName){
        try{
            String RecordTypeID = Schema.SObjectType.Maintenance_Contribution__c.getRecordTypeInfosByName().get(recordTypeName).getRecordTypeId();
            Map<Id,Maintenance_Contribution__c> mapMC= new Map<Id,Maintenance_Contribution__c>([Select id,Name, Amount__c,Amount_Pending__c, Amount_Received__c,Contribution_Date__c, Maintenance_Request__c,Maintenance_Request__r.name,Asset__c,Asset__r.Asset_Name__c,Asset__r.Asset_Price__c, Resident__c, (Select id, Name, Resident__c,Resident__r.name,Resident__r.Flat_Number__c, Amount__c,Contribution_Date__c, Maintenance_Contribution__c,Maintenance_Contribution__r.name, Payment_Status__c from Contributions__r where Payment_Status__c='Pending' order by amount__c desc)
                                                                                                from Maintenance_Contribution__c
                                                                                                Where Resident__c=:userId AND recordTypeId=:RecordTypeID]);
            
            list<Maintenance_Contribution__c> listMC =mapMC.values();
            set<Id> setMCIds= mapMC.keySet();
            
            return listMC;
        }
        catch(exception e){
            return null;
        }
    }
    
    @auraEnabled(cacheable=true)
    public static Decimal getRepaymentMaintenanceContribution(String userId){
        try{
            Decimal totalRepayment=0;
            Map<Id,Maintenance_Contribution__c> mapMC= new Map<Id,Maintenance_Contribution__c>([Select id,Name, Amount__c,Amount_Pending__c, Amount_Received__c,Contribution_Date__c, Maintenance_Request__c,Maintenance_Request__r.name, Resident__c
                                                                                                from Maintenance_Contribution__c
                                                                                                Where Resident__c=:userId]);
            if(!mapMC.isEmpty()){
                for(Maintenance_Contribution__c varMC:mapMC.values()){
                    totalRepayment=totalRepayment+varMC.Amount_Pending__c;
                }
            }
            
            return totalRepayment;
        }
        catch(exception e){
            return null;
        }
    }
    
    
    public static void updateRelatedMainReqAmount(list<Maintenance_Contribution__c> listMaintCont, Map<Id,Maintenance_Contribution__c> oldMap, Map<Id,Maintenance_Contribution__c>newMap){
        try{
            if(!newMap.isEmpty()){
                set<Id> maintReqIds = new set<Id>();
                String RecordTypeID = Schema.SObjectType.Maintenance_Contribution__c.getRecordTypeInfosByName().get('For Maintenance Request').getRecordTypeId();
                list<Maintenance_Request__c> listFinalMR = new list<Maintenance_Request__c>();
                for(Maintenance_Contribution__c varMC:newMap.values()){
                    maintReqIds.add(varMC.Maintenance_Request__c);
                }
                
                map<Id,Maintenance_Request__c> mapMR =new  map<Id,Maintenance_Request__c>([SELECT Id, Category__c,Description__c, Amount_Spent__c,Amount_Collected__c,Assigned_Vendor__c, Request_Date__c,Status__c,Priority__c 
                                                                                           from Maintenance_Request__c
                                                                                           Where ID IN:maintReqIds]);
                
                AggregateResult [] contriAggResult= [Select Maintenance_Request__c,SUM(Amount__c)AmountSpent, SUM(Amount_Received__c)CollectedAmount 
                                                     from Maintenance_Contribution__c 
                                                     Where Maintenance_Request__c IN :maintReqIds AND recordTypeId=:RecordTypeID
                                                     group by Maintenance_Request__c];
                
                if(!contriAggResult.isEmpty()){
                    for(AggregateResult varAgg:contriAggResult){
                        Maintenance_Request__c varMaintReq= mapMR.get((String)varAgg.get('Maintenance_Request__c'));
                        if(varMaintReq.Amount_Spent__c==0.00){
                            varMaintReq.Amount_Spent__c=(Decimal)varAgg.get('AmountSpent');
                        }
                        else if(varMaintReq.Amount_Spent__c!=0){
                            varMaintReq.Amount_Spent__c= varMaintReq.Amount_Spent__c+(Decimal)varAgg.get('AmountSpent');
                        }
                        varMaintReq.Amount_Collected__c=(Decimal)varAgg.get('CollectedAmount');
                        listFinalMR.add(varMaintReq);
                    }
                }
                if(!listFinalMR.isEmpty()){
                    Database.update(listFinalMR,false);
                }
            }
        }
        catch(exception e){
            
        }
    }
    
    
     @auraEnabled(cacheable=true)
    public static list<Maintenance_Contribution__c> getAllMaintenanceContribution(String userId){
        try{
           
            Map<Id,Maintenance_Contribution__c> mapMC= new Map<Id,Maintenance_Contribution__c>([Select Id,Name, Amount__c,Amount_Pending__c, Amount_Received__c,Contribution_Date__c, Maintenance_Request__c,Maintenance_Request__r.name,Asset__c,Asset__r.Asset_Name__c,Asset__r.Asset_Price__c, Resident__c
                                                                                                from Maintenance_Contribution__c
                                                                                                Where Resident__c=:userId]);
            
            list<Maintenance_Contribution__c> listMC =mapMC.values();
            set<Id> setMCIds= mapMC.keySet();
            
            return listMC;
        }
        catch(exception e){
            return null;
        }
    }
    
}