public class ResidentController {
    
    @auraEnabled
    public static list<Resident__c > getResident(Integer FlatNumber, String Phone){
        try{
            list<Resident__c > listResident =new list<Resident__c >();
            if(FlatNumber!=null && Phone!=null){
                listResident=[Select Id,Flat_Number__c, Phone__c, Name, Apartment__c, Active__c from Resident__c 
                              where Flat_Number__c=:FlatNumber AND Phone__c=:Phone];
                
            }
            return listResident;
        }
        catch(exception e){
            return null;
        }
    }
    
    @auraEnabled(cacheable=true)
    public static list<Resident__c > getAllResidents(){
        try{
            list<Resident__c > listResident =new list<Resident__c >();
            
            listResident=[Select Id,Flat_Number__c, Phone__c, Name, Apartment__c, Active__c,Email__c from Resident__c ];
            
            return listResident;
        }
        catch(exception e){
            return null;
        }
    }
}