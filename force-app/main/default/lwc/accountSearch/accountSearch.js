import { LightningElement, track, wire } from 'lwc';
import getAccountData from '@salesforce/apex/AccountSearch.getAccountData';
import getAccountDataDetails from '@salesforce/apex/AccountSearch.getAccountDataDetails'
export default class AccountSearch extends LightningElement {
    searchKey;
    @track accounts;
    @track recrdsID;
    @track viewRecord
    @track showViewComponent = false;
    @track sortBy;
    @track sortDirection;
    totalAccounts
    visibleAccounts
   @track columns = [];
   
   get options() {
    return [
        { label: 'Ascending', value: 'ascending' },
        { label: 'Descending', value: 'descending' },
    ];
}
    connectedCallback() {
        this.columns = [
            {label:'Name', fieldName:'Name'},
            {
                type:"button", typeAttributes: {
                    label: 'View',
                    name: 'View',
                    title: 'View',
                    disabled: false,
                    value: 'view',
                    iconPosition: 'left',
                    variant:'base'

                }
            }
        ];
    }

    handleChange(event) {
        this.value = event.target.value;
        getAccountDataDetails({ Value: this.value })
            .then((result) => {
                this.visibleAccounts = result;
            })
            .catch(error => {
                console.log(error);
            })
    }


    //This Funcation will get the value from Text Input.
    handelSearchKey(event){
        this.searchKey = event.target.value;
        getAccountData({textkey: this.searchKey})
        .then(result => {
                this.accounts = result;
        })
        .catch( error=>{
            this.accounts = null;
        });
    }
    
    @wire(getAccountData)
    wiredaccount({error, data}){
        if(data){ 
            this.totalAccounts = data
            console.log(this.totalAccounts)
        }
        if(error){
            console.error(error)
        }
    }
    updateAccountHandler(event){
        this.visibleAccounts=[...event.detail.records]
        console.log(event.detail.records)
    }
    showView(event) {
        this.showViewComponent = true;
        const recId =  event.detail.row.Id;
        this.recrdsID =  recId
        const actionName = event.detail.action.name;
        console.log(recId)
        console.log(actionName)  
      }
      

}