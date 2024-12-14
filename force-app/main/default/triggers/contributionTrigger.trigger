trigger contributionTrigger on Contribution__c (before insert, after insert, before update, after update, after delete, after undelete){

    if(Trigger.isAfter){
        if(Trigger.isInsert || Trigger.isUpdate || Trigger.isDelete || Trigger.isUndelete){
            ContributionController.updateRelatedMaintCont(Trigger.new, Trigger.oldMap, Trigger.newMap);
        }
    }
}