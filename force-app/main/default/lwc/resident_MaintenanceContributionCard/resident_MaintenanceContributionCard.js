import { LightningElement,wire,api,track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

import getMaintenanceContribution from '@salesforce/apex/MaintenanceContributionController.getMaintenanceContribution'

export default class Resident_MaintenanceContributionCard extends LightningElement {

MCList=[]
showRecords=false
showNoRecordMsg=false
noRecordMsg=''
@track residentName
@track residentId
@track residentFlatNumber

maintenanceChecked=false
assetChecked=false
isAsset=false
isMaintenance=false

@track recordType


/*@wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        const data = currentPageReference?.state?.data;
        if (data) {

            // Reverse URL-safe encoding to original base64 format
            const urlSafeParams = data.replace(/-/g, '+').replace(/_/g, '/');

            // Decode the base64 encoded data
            const decodedData = atob(urlSafeParams);

            const [resiName, resiId, resiFlatNum] = decodedData.split(':');
            this.residentName = resiName;
            this.residentId = resiId;
            this.residentFlatNumber=resiFlatNum;

             // Store the data in sessionStorage for persistence across refreshes
             sessionStorage.setItem('residentName', resiName);
             sessionStorage.setItem('residentId', resiId);
             sessionStorage.setItem('residentFlatNumber', resiFlatNum);
        }

        else{
            // If no parameters, load from sessionStorage (for page refresh scenario)
            this.residentName = sessionStorage.getItem('residentName');
            this.residentId = sessionStorage.getItem('residentId');
            this.residentFlatNumber=sessionStorage.getItem('residentFlatNumber');
        }
        console.log('residentName'+this.residentName)
        console.log('residentId'+this.residentId)
    }
*/
connectedCallback(){


    // Get the stored data from sessionStorage
    this.residentName = sessionStorage.getItem('residentName') || 'No data';
    this.residentFlatNumber = sessionStorage.getItem('residentFlatNumber') || 'No data';
    this.residentId =sessionStorage.getItem('residentId') || 'No data';

   
}


    @wire(getMaintenanceContribution,{userId:'$residentId',recordTypeName:'$recordType'})
    MaintenanceContribution(result){
        if(result.data){
            this.MCList=[]
            console.log('result data',result.data)
            let tempList=result.data
            if(tempList.length>0){
                this.MCList=tempList
                this.showRecords=true
            }
            
            if(tempList.length==0){
                this.showNoRecordMsg=true
                this.noRecordMsg='Everything’s settled! No payments left to clear.'
            }
        }

        if(result.error){
            console.log('getMaintenanceContribution error',error)
        }
    }
    
 /*
    callApexMethod(){
        getMaintenanceContribution({userId:this.residentId,recordTypeName:this.recordType})
        .then(result=>{
            if(result){
                this.MCList=[]
                console.log('result',result)
                if(result.length>0){
                    this.MCList=result
                    
                }
                
                if(result.length==0){
                    this.showNoRecordMsg=true
                    this.noRecordMsg='Everything’s settled! No payments left to clear.'
                }
            }})
    .catch(error=>{
            
    })
    } */
    


/*// Clear session storage if needed
disconnectedCallback() {
    sessionStorage.removeItem('residentName');
    sessionStorage.removeItem('residentId');
    sessionStorage.removeItem('residentFlatNumber');
}*/


maintToggleHandler(event){
    this.maintenanceChecked=!this.maintenanceChecked

    if(this.maintenanceChecked==true){
        this.recordType='For Maintenance Request'
        this.assetChecked=false
        this.isAsset=false
        this.isMaintenance=true
       
    }

    if(this.maintenanceChecked==false){
        this.recordType=''
        this.showRecords=false
        this.showNoRecordMsg=false
    }
    
   
}

assetTogglehandler(event){
    this.assetChecked=!this.assetChecked

    if(this.assetChecked==true){
        this.recordType='For Asset'
        this.maintenanceChecked=false
        this.isAsset=true
        this.isMaintenance=false
        
    }

    if(this.assetChecked==false){
        this.recordType=''
        this.showRecords=false
        this.showNoRecordMsg=false
    }
    
}


}