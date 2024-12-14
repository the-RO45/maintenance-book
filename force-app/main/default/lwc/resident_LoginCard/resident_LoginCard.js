import { LightningElement,track,api,wire} from 'lwc';

import {NavigationMixin} from 'lightning/navigation'

import getResident from '@salesforce/apex/ResidentController.getResident'

//import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

// LMS
//import {MessageContext, publish} from 'lightning/messageService';
//import relatedAppMC from '@salesforce/messageChannel/relatedAppointmentMessageChannel__c'

//Resident__c  Schema
import RESIDENT_OBJECT  from '@salesforce/schema/Resident__c'


export default class Resident_LoginCard extends NavigationMixin(LightningElement) {

    //variables
    
    flatNumber 
    phoneNumber
    userFound=false
    userName
    userId
    userFlatNum
    userApartment
    disableButton=true
    noRecordsFoundMsg
    showMsg


    searchNameHandler(event){
        this.flatNumber=event.target.value
        this.validateData()
        this.showMsg=false
    }

    searchPhoneHandler(event){
        this.phoneNumber=event.target.value
        this.validateData()
        this.showMsg=false
    }

    searchHandler(event){
        getResident({FlatNumber:this.flatNumber,Phone:this.phoneNumber})
        .then(result=>{
            console.log('result',result)
            if(result.length>0){
                
                let tempRecs =  JSON.parse( JSON.stringify(result) )
                
                this.userName=tempRecs[0].Name;
                this.userId=tempRecs[0].Id;
                this.userFlatNum=tempRecs[0].Flat_Number__c;
                this.userApartment=tempRecs[0].Apartment__c;

                console.log('this.userName'+this.userName)
                this.userFound=true

                 // Store the data in sessionStorage for persistence across refreshes
             sessionStorage.setItem('residentName', this.userName);
             sessionStorage.setItem('residentId', this.userId);
             sessionStorage.setItem('residentFlatNumber', this.userFlatNum);
             sessionStorage.setItem('residentApartment', this.userApartment);

                if(this.userFound){
                    this.navigateToHomePage()
                }
            }

            if(result.length==0){
                this.noRecordsFoundMsg='No Resident found.Please modify your search OR kindly connect with Admin for more details.'
                this.showMsg=true
            }

        })

        .catch(error=>{
            console.log('error',error)
        })

        
        
    }

    validateData(){
        if(this.flatNumber && this.phoneNumber){
            this.disableButton=false
        }
        else{
            this.disableButton=true
        }
    }
    
    navigateToHomePage(){
        console.log('userName'+this.userName)
        console.log('userId'+this.userId)
        /*var definition={
            componentDef:"c:resident_homePageCard",
            attributes:{
                residentName:this.userName,
                residentId:this.userId
            }
        }

        console.log('definition',definition.attributes)
        let encodedCompDef = btoa(JSON.stringify(definition));
        console.log('encodedCompDef',encodedCompDef)*/

        const encodedData = btoa(`${this.userName}:${this.userId}:${this.userFlatNum}`);

        const urlSafeParams = encodedData.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        this[NavigationMixin.Navigate]({
            type:'standard__webPage',
            attributes:{
                //url:`/resident-homepage?data=${urlSafeParams}`
                url:'/resident-homepage'
               
            }
        });
    }




}