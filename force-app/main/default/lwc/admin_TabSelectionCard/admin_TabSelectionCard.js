import { LightningElement } from 'lwc';

export default class Admin_TabSelectionCard extends LightningElement {
    showResidents=false;
    showMaintenanceRequests=false;

    handleResident(event){
        this.showResidents=true;
        this.showMaintenanceRequests=false
    }

    handleMaintRequest(event){
        this.showMaintenanceRequests=true;
        this.showResidents=false
    }
}