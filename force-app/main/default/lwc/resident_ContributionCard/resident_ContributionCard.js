import { LightningElement,wire,api,track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

import getContributionRecords from '@salesforce/apex/ContributionController.getContributionRecords'

export default class Resident_ContributionCard extends LightningElement {

ContriList=[]

showNoRecordMsg=false
noRecordMsg=''
@track residentName
@track residentId
@track residentFlatNumber

connectedCallback(){


    // Get the stored data from sessionStorage
    this.residentName = sessionStorage.getItem('residentName') || 'No data';
    this.residentFlatNumber = sessionStorage.getItem('residentFlatNumber') || 'No data';
    this.residentId =sessionStorage.getItem('residentId') || 'No data';

    getContributionRecords({residentId:this.residentId})
    .then(result=>{
        if(result){
            console.log('result',result)
            if(result.length>0){
                this.ContriList=result
                
            }
            console.log('contribtionList',this.contributionList)
            if(result.length==0){
                this.showNoRecordMsg=true
                this.noRecordMsg='Fantastic! No pending payments to worry about.'
            }
        }
    })
}

}