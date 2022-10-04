import {LightningElement, api, wire, track} from 'lwc';
import viewRecord from '@salesforce/apex/AccountSearch.viewRecord';
import GetContacts from '@salesforce/apex/AccountSearch.GetContacts';
import UpdateRecord from '@salesforce/apex/AccountSearch.UpdateRecord';
import UpdateContacts from '@salesforce/apex/AccountSearch.UpdateContacts';
import GetConRecord from '@salesforce/apex/AccountSearch.GetConRecord';
import deleteContact from '@salesforce/apex/AccountSearch.deleteContact';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class accountSearch extends LightningElement {
@api recordId;
@api accounts;
@api  recrdsID;
@api recid;
@api AccountId;
@api AccId;
@api redId;
@api coneditdId;
@api editId;
@api deleteId;
@api coId
@track isModalOpen = false;
disabled;
@api accountName;
conList;
@api accountNumberOfEmployees;
@api accountType;
@track isDialogVisible = false;
@track isEditeDialogVisible = false;
@track isEditModalOpen = false;
@track originalMessage;
@track displayMessage = 'Click on the \'Open Confirmation\' button to test the dialog.'
_wiredResult;
error;
@api message = ''; //modal message
@track confirmLabel = ''; //confirm button label
@track cancelLabel = '';
@track updateKey

@wire (viewRecord, {recrdsID:'$recid'})
wireAcccount;
//---------- Contacts list----------
connectedCallback() {
    this.columns = [
        {label:'Related Contacts', fieldName:'Name'},
        {
            type:"button", typeAttributes: {
                label: 'Edit',
                name: 'editRecord',
                title: 'Edit',
               
                value: 'Edit',
                
                variant:'brand'

            },
        },{
            type:"button", typeAttributes: {
                label: 'Delete',
                name: 'deleteRecord',
                title: 'Delete',
                disabled: false,
                value: 'deleteRecord',
                iconPosition: 'end',
                variant:'destructive'

            }
        }
    ];
}
contactsList =[];

updateKey(event){
    this.contactsList = event.target.value;
    console.log("this.contactsList"+JSON.stringify(this.contactsList))
}

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
@wire(GetConRecord,{coneditdId: '$editId'})
ContactRecords({error, data}){
    console.log('Entering ContactRecords');
    console.log('Entering ContactRecords===='+this.coneditdId);
    if(data){
        console.log('data*********+'+JSON.stringify(data))
        this.conList = data;
        this.error = undefined;
    }else{
        this.error = error;
        this.conList = undefined;
    }
}

getSelectedRow(event){
    // alert('error occured');
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    const Id = row.Id;
    if(actionName=='viewDetails'){
    this.wireAcccount=true;
    this.recid=Id;
    }
    console.log(actionName);
    console.log(row);
}

openModal() {
    this.isModalOpen = true;
}
closeModal() {
    this.isModalOpen = false;
}
submitDetails() {
    var inp = this.template.querySelectorAll("lightning-input");
    inp.forEach(function (element) {
        if (element.name == "Name")
            this.accountName = element.value;
        else if (element.name == "NumberOfEmployees")
            this.accountNumberOfEmployees = element.value;
        else if (element.name == "Type")
            this.accountType = element.value;
    }, this);
    this.isModalOpen = false;
    UpdateRecord({accountId:this.recid, 
        accountNames:this.accountName, 
        accountNumberOfEmployeess:this.accountNumberOfEmployees, 
        accountTypes:this.accountType})
        .then( accountDetails => {
            console.log("accountDetails:"+JSON.stringify(accountDetails))
            const event = new ShowToastEvent({
              title: 'Success',
              message: 'Updated Successfully',
              variant: 'success',
              mode: 'dismissable'
          });
          this.dispatchEvent(event);
          window.location.reload()
        })
        .catch( error => {
            console.error("error"+JSON.stringify(error))
            const evt = new ShowToastEvent({
              title: 'Error',
              message: 'Not Changed Anything Yet',
              variant: 'error',
              mode: 'dismissable'
          });
          this.dispatchEvent(evt);
        })
    }
    handleRowAction(event) {
        const actionName1 = event.detail.action.name;
        const row1 = event.detail.row;
        const Id1 = row1.Id;
        if (actionName1 === 'editRecord') {
            this.isEditModalOpen = true;
            this.editId = Id1;
        }
        else if(actionName1 === 'deleteRecord'){
            // alert(Id1 +"-Are You Sure-");
            // this.isDialogVisible = true;
            this.editId = Id1;
            deleteContact({ coId: this.editId })
            .then(result => {
                if (result) {
                    const evt = new ShowToastEvent({
                        title: "Deleted",
                        message: 'Record Deleted Successfully',
                        variant: "success",
                    });
                    this.dispatchEvent(evt);
                    // alert('Acoount Updated Successfully');
                    // this.dispatchEvent(Evt);
                    window.location.reload();
                }
                else {
                    console.log('Delete operation not successful');
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
        // console.log('handleRowAction ', event);        
        // if (actionName1=== 'Delete') {
        //     this.selectedRow = event.detail.row.Id;
        //     this.isDialogVisible = true;
        //     this.recordId = event.detail.row.Id;
        // }
        // else if (actionName1 == 'editRecord') {
        //     this.isEditModalOpen = true;
        //     this.lwcId = Id1;
        // else if (event.detail.action.name === 'Edit'){
        //     this.selectedRow = event.detail.row.Id;
        //     alert(event.detail.row.Id);
        //     this.isEditModalOpen = true;
        //     this.editId = event.detail.row.Id;
        }
    
    closeEditModal() {
        this.isEditModalOpen = false;
    }
    submitContactDetails() {
        var inp = this.template.querySelectorAll("lightning-input");
        inp.forEach(function (element) {
            if (element.name == "fNames")
                this.FirstNames = element.value;
            else if (element.name == "lNames")
                this.LastName = element.value;
            else if (element.name == "emails")
                this.Email = element.value;
        }, this);
            this.isEditModalOpen = false;
        UpdateContacts({ContactId:this.editId, 
            firstNames:this.FirstNames, 
            lastNames:this.LastName, 
            Emails:this.Email})
            .then( contactDetails => {
                console.log("contactDetails:"+JSON.stringify(contactDetails))
                const event = new ShowToastEvent({
                  title: 'Success',
                  message: 'Updated Successfully',
                  variant: 'success',
                  mode: 'dismissable'
              });
              this.dispatchEvent(event);
            //   alert('#### UpdateContacts #####');
              window.location.reload()
            })
            .catch( error => {
                console.error("error"+JSON.stringify(error))
                const evt = new ShowToastEvent({
                  title: 'Error',
                  message: 'Not Changed Anything Yet',
                  variant: 'error',
                  mode: 'dismissable'
              });
              this.dispatchEvent(evt);
            })
        }
    
}