import {LightningElement, api, wire, track} from 'lwc';
import viewRecord from '@salesforce/apex/AccountSearch.viewRecord';
import GetContacts from '@salesforce/apex/AccountSearch.GetContacts';
import UpdateRecord from '@salesforce/apex/AccountSearch.UpdateRecord';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from 'lightning/navigation';
export default class accountSearch extends NavigationMixin(LightningElement) {
@api recordId;
@api accounts;
@api  recrdsID;
@api recid;
@api AccountId;
@api AccId;
@track isModalOpen = false;
disabled;
accountName;
accountNumberOfEmployees;
accountType;
@wire (viewRecord, {recrdsID:'$recid'})
wireAcccount;
//---------- Contacts list----------
connectedCallback() {
    this.columns = [
        {label:'Related Contacts', fieldName:'Name'},
        
        {
            type:"button", typeAttributes: {
                label: 'Edit',
                name: 'Edit',
                title: 'Edit',
                disabled: false,
                value: 'Edit',
                iconPosition: 'end',
                variant:'brand',
                iconName: 'utility:edit'
            },
        },{
            type:"button", typeAttributes: {
                label: 'Delete',
                name: 'Delete',
                title: 'Delete',
                disabled: false,
                value: 'Delete',
                iconPosition: 'end',
                variant:'destructive',
                iconName: 'utility:delete'
            }
        }
      
    ];
}
contactsList =[];
@wire(GetContacts,{recdId: '$recid'})
WireContactRecords({error, data}){
    console.log('Entering WireContactRecords');
    console.log('Entering WireContactRecords===='+this.recdId);
    if(data){
        console.log('data*********+'+JSON.stringify(data))
        this.contactsList = data;
        this.error = undefined;
    }else{
        this.error = error;
        this.contactsList = undefined;
    }
}
getSelectedRow(event){
    // alert('error occured');
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    const Id = row.Id;
    if(actionName === 'viewDetails'){
    this.wireAcccount=true;
    this.recid=Id;
    }
    console.log(actionName);
    console.log(row);
}

handalNameChange(event){
    this.accountName = event.target.value;
    console.log("this.accountName"+JSON.stringify(this.accountName))
}
handalNoOfEmpChange(event){
    this.accountNumberOfEmployees = event.target.value;
    console.log("this.accountNumberOfEmployees"+JSON.stringify(this.accountNumberOfEmployees))
}
handalTypeChange(event){
    this.accountType = event.target.value;
    console.log("this.accountType"+JSON.stringify(this.accountType))
}
openModal() {
    this.isModalOpen = true;
}
closeModal() {
    this.isModalOpen = false;
}
submitDetails() {
    this.isModalOpen = false;
    UpdateRecord({accountId:this.recid, 
        accountName:this.accountName, 
        accountNumberOfEmployees:this.accountNumberOfEmployees, 
        accountType:this.accountType})
        .then( accountDetails => {
            console.log("accountDetails:"+JSON.stringify(accountDetails))
            const event = new ShowToastEvent({
              title: 'Your changes are saved.',
              variant: 'success',
              mode: 'dismissable'
          });
          this.dispatchEvent(event);
          window.location.reload();
        })
        .catch( error => {
            console.error("error"+JSON.stringify(error))
            const evt = new ShowToastEvent({
              title: 'Error',
              message: 'Not Updated Yet',
              variant: 'error',
              mode: 'dismissable'
          });
          this.dispatchEvent(evt);
        })
    } 
}