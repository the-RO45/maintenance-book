import { LightningElement,api,track } from 'lwc';
import RECEPTIONIST_IMG from '@salesforce/resourceUrl/Admin'
import EXTERNAL_USER_IMG from '@salesforce/resourceUrl/ExternalUser'
export default class Home_UserSelectionCard extends LightningElement {
    @api tileHeading;
	@api tileText;
	@api tileURL;
    @api imgSrc;

   
        connectedCallback(){

        if(this.tileHeading == 'Admin'){
            this.imgSrc=RECEPTIONIST_IMG
        }
        if(this.tileHeading =='Resident'){
            this.imgSrc=EXTERNAL_USER_IMG
        }
    }
}