import { LightningElement } from 'lwc';

export default class Resident_ContributionSection extends LightningElement {

    showMaintenanceContriRecords=false;
    showContriRecords=false;
    PRBtnVariant='';
    CDBtnVariant='';

    handleMaintCont(event){
        this.showMaintenanceContriRecords=true
        this.showContriRecords=false
        this.PRBtnVariant='Brand'
        this.CDBtnVariant='Brand-outline'

    }

    handleCont(event){
        this.showContriRecords=true
        this.showMaintenanceContriRecords=false
        this.disabledRepayment=true
        this.PRBtnVariant='Brand-outline'
        this.CDBtnVariant='Brand'
    }
}