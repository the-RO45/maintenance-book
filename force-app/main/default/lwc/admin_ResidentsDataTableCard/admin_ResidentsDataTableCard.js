import { LightningElement,wire,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord } from 'lightning/uiRecordApi';

// Import Apex
import getResidents from '@salesforce/apex/ResidentController.getAllResidents';
import getRelatedMaintContribution from '@salesforce/apex/MaintenanceContributionController.getAllMaintenanceContribution';

//Import Fields
import NAME_FIELD from '@salesforce/schema/Resident__c.Name';
import PHONE_FIELD from '@salesforce/schema/Resident__c.Phone__c';
import EMAIL_FIELD from '@salesforce/schema/Resident__c.Email__c';
import APARTMENT_FIELD from '@salesforce/schema/Resident__c.Apartment__c';
import FLAT_NUMBER_FIELD from '@salesforce/schema/Resident__c.Flat_Number__c';
import ACTIVE_FIELD from '@salesforce/schema/Resident__c.Active__c';
import LEASE_START_DATE_FIELD from '@salesforce/schema/Resident__c.Lease_Start_Date__c';
import LEASE_END_DATE_FIELD from '@salesforce/schema/Resident__c.Lease_End_Date__c';


export default class Admin_ResidentsDataTableCard extends LightningElement {

    @track Residents;
    @track isEditModalOpen = false;
    @track editRecordId;
    @track showNewRecordModal=false;
    @track relatedMaintenanceContribution=[];
    @track relatedMaintContriVisible=false;

    @track residentFields =[NAME_FIELD,PHONE_FIELD,EMAIL_FIELD,APARTMENT_FIELD,FLAT_NUMBER_FIELD,ACTIVE_FIELD,LEASE_START_DATE_FIELD,LEASE_END_DATE_FIELD]

    wiredResidentsResult

    newRecord(event){
        this.showNewRecordModal=true;
    }
    
    columns = [
        { label: 'Resident Name', fieldName: 'Name' },
        { label: 'Flat Number', fieldName: 'Flat_Number__c' },
        { label: 'Phone', fieldName: 'Phone__c' },
        { label: 'Email', fieldName: 'Email__c' },
        { label: 'IsActive', fieldName: 'Active__c' },
        {
            type: 'action',
            typeAttributes: {
                rowActions: this.getRowActions
            }
        }
    ];

    @wire(getResidents)
    wiredResidents(result) {
        this.wiredResidentsResult=result;
        if (result.data) {
            this.Residents = result.data;
        } else if (result.error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    getRowActions(row, doneCallback) {
        const actions = [
            { label: 'Edit', name: 'edit' },
            { label: 'Delete', name: 'delete' },
            { label: 'Show Related Contacts', name: 'show_contacts' }
        ];
        doneCallback(actions);
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch (actionName) {
            case 'edit':
                this.editRecord(row);
                break;
            case 'delete':
                this.deleteRecord(row);
                break;
            case 'show_contacts':
                this.showRelatedContacts(row);
                break;
            default:
        }
    }

    editRecord(row) {
        this.editRecordId = row.Id;
        this.isEditModalOpen = true;
    }

    closeEditModal() {
        this.isEditModalOpen = false;
        this.editRecordId = null;
    }

    handleEditSuccess() {
        this.showToast('Success', 'Record updated successfully', 'success');
        this.isEditModalOpen = false;
        refreshApex(this.wiredResidentsResult);
    }

    saveEditRecord() {
        const recordForm = this.template.querySelector('lightning-record-edit-form');
        if (recordForm) {
            recordForm.submit();
        }
       
    }
   

    async deleteRecord(row) {
        try{
            await deleteRecord(row.Id);
            this.showToast('Success', 'Record deleted successfully', 'success');
            await refreshApex(this.wiredResidentsResult);
        }
        catch (error) {
            this.showToast('Error Deleting record', error.body.message, 'error');
        }
        
   
    }

    showRelatedContacts(row) {
        //this.showToast('Related Contacts', `Fetching contacts for: ${row.Name}`, 'info');
        console.log('Resident Id',row.Id)

        getRelatedMaintContribution({userId:row.Id})
        .then(result=>{
            this.relatedMaintenanceContribution=result
            this.relatedMaintContriVisible=true
            console.log('relatedMaintenanceContribution',result)

        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
        });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }

    hideModalBox(event){
        this.showNewRecordModal=false;
        this.relatedMaintContriVisible=false
    }
}