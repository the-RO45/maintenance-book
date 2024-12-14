import { LightningElement,api,track,wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

import getRepaymentMaintenanceContribution from '@salesforce/apex/MaintenanceContributionController.getRepaymentMaintenanceContribution'

import getDueContribution from '@salesforce/apex/ContributionController.getDueContribution'

//Maintenance Contribution Schema

import MaintenanceContribution_OBJECT from '@salesforce/schema/Maintenance_Contribution__c'
import Name_FIELD from '@salesforce/schema/Maintenance_Contribution__c.Name'
import Resident_FIELD from '@salesforce/schema/Maintenance_Contribution__c.Resident__c'
import Maintenance_Request_FIELD from '@salesforce/schema/Maintenance_Contribution__c.Maintenance_Request__c'
import Amount_FIELD from '@salesforce/schema/Maintenance_Contribution__c.Amount__c'
import Contribution_Date_FIELD from '@salesforce/schema/Maintenance_Contribution__c.Contribution_Date__c'

export default class Resident_homePageCard extends LightningElement {
    @track residentName
    @track residentId
    @track residentFlatNumber
    @track totalRepayment
    @track totalPendingContri
    @track residentApartment
    maintenanceRequest

    showCreateForm=false

    objectApiName=MaintenanceContribution_OBJECT
    @track fieldsList ={
        Name:Name_FIELD,
        Resident:Resident_FIELD,
        MR:Maintenance_Request_FIELD,
        Amount:Amount_FIELD,
        Date:Contribution_Date_FIELD
    }

    /* @wire(CurrentPageReference)
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
        }
        console.log('residentName'+this.residentName)
        console.log('residentId'+this.residentId)
    }*/

    connectedCallback() {
        // Get the stored data from sessionStorage
        this.residentName = sessionStorage.getItem('residentName') || 'No data';
        this.residentFlatNumber = sessionStorage.getItem('residentFlatNumber') || 'No data';
        this.residentId =sessionStorage.getItem('residentId') || 'No data';
        this.residentApartment=sessionStorage.getItem('residentApartment') || 'No data';

        getRepaymentMaintenanceContribution({userId:this.residentId})
        .then(result=>{
            this.totalRepayment=result
        })

        .catch(error=>{
            
        })


        getDueContribution({residentId:this.residentId})
        .then(result=>{
            this.totalPendingContri=result
        })

        .catch(error=>{
            
        })
    }


}