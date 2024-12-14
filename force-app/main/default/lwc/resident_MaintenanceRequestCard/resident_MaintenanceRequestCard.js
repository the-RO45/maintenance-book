import { LightningElement } from 'lwc';

import getMaintenanceRequest from '@salesforce/apex/MaintenanceRequestController.getMaintenanceRequest'


export default class Resident_MaintenanceRequestCard extends LightningElement {

MRList=[]
showNoRecordMsg=false
noRecordMsg=''

connectedCallback(){
    getMaintenanceRequest()
    .then(result=>{
        if(result){
            if(result.length>0){
                this.MRList=result
            }
            if(result.length==0){
                this.showNoRecordMsg=true
                this.noRecordMsg='"Hmm... No Pending Maintenance Requests at the moment.'
            }
        }
    })
    .catch(error=>{
        
    })
}
    
}