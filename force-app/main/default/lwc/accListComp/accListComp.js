import { LightningElement, track, wire, api } from 'lwc';
import getAcclist from '@salesforce/apex/getAccounts.getAcclist';
import getSortedList from '@salesforce/apex/getAccounts.getSortedList';
import getdetaillist from '@salesforce/apex/getAccounts.getdetaillist';
import getContactlist from '@salesforce/apex/getAccounts.getContactlist';
import getContacts from '@salesforce/apex/getAccounts.getContacts';
import updateAccount from '@salesforce/apex/getAccounts.updateAccount';
import updateContact from '@salesforce/apex/getAccounts.updateContact';
import deleteContact from '@salesforce/apex/getAccounts.deleteContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const columns = [
    { label: 'Account Name', fieldName: 'Name' },
    {
        type: "button",
        label: "View Details",
        fixedWidth: 270,
        typeAttributes: {
            label: 'View',
            title: 'View Details',
            name: 'viewDetails',
            value: 'viewDetails',
            variant: 'base'

        }
    },
];

const columns1 = [
    { label: 'Contact Name', fieldName: 'Name' },
    {
        type: "button",
        label: "Edit",
        fixedWidth: 100,
        typeAttributes: {
            label: 'Edit',
            title: 'Edit Details',
            name: 'editRecord',
            value: 'editRecord',
            variant: 'brand',
            iconName: 'utility:edit'

        }
    },
    {
        type: "button",
        label: "Delete",
        fixedWidth: 100,
        typeAttributes: {
            label: 'Delete',
            title: 'Delete Details',
            name: 'deleteRecord',
            value: 'deleteRecord',
            variant: 'destructive',
            iconName: 'utility:delete'

        }
    },
];
const sortOptions = [
    { value: 'Asc', label: 'Asc' },
    { value: 'Desc', label: 'Desc' }

];
export default class AccListComp extends LightningElement {
    columns = columns;   // column information datatable
    columns1 = columns1;
    sortOptions = sortOptions;  //srot options available
    pageSizeOptions = [5, 10, 20]; // page size options
    totalRecords = 0; // Total numbers of records
    records = [];  // all records available in datatable
    pageNumber = 1; // Page Number
    totalPages; // number of pages
    pageSize; // number of records per page
    recordsToDisplay = [];
    recordsCon = [];
    @track error;
    @api recordId;   //It store current page record
    @api searchKey = '';
    @api lwcRecordId;
    @api recId;
    @api accId;
    @api conId;
    @api lwcId;
    @api coId;
    accountDetails;
    conDetails;
    showDetails;
    @api accountName;
    @api accountType;
    @api accountNumber;
    @api accountCount;
    @api conFName;
    @api conLName;
    @api conEmail;
    @api conPhone;
    @track isModal = false;

    //  Get Account Details 
    @wire(getdetaillist, { recordId: '$lwcRecordId' })
    retriveData({ data, error }) {
        console.log(this.search)
        if (data) {
            this.accountDetails = data;
            console.log(data);
        } else if (error) {
            console.log(error);
        }
    };

    // Get Related Contact from Account
    @wire(getContactlist, { recId: '$lwcRecordId' })
    getData({ data, error }) {
        console.log(this.search)
        if (data) {
            // this.conDetails = data;  
            this.recordsCon = data;
            console.log(data);
        } else if (error) {
            console.log(error);
        }
    };

    @wire(getContacts, { conId: '$lwcId' })
    getConData({ data, error }) {
        console.log(this.search)
        if (data) {
            this.conDetails = data;
            // this.recordsCon = data;
            console.log(data);
        } else if (error) {
            console.log(error);
        }
    };


    // Modal PopUp Configuration
    @track isModalOpen = false;
    showModal() {
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
    }


    // Pagination is Started from here in Javascript file *********

    get bDisableFirst() {
        return this.pageNumber == 1;
    }
    get bDisableLast() {
        return this.pageNumber == this.totalPages;
    }
    // get records from apex
    connectedCallback() {
        getAcclist({ lwcRecordId: this.recordId })
            .then((result) => {
                if (result != null) {
                    console.log('Result==>' + JSON.stringify(result));
                    this.records = result; // get data into array
                    this.totalRecords = result.length; // update total record count
                    this.pageSize = this.pageSizeOptions[0]; // set the default record to show is first option
                    this.paginationHelper(); // call helper method to update pagination logic
                }
            })
            .catch(error => {
                console.log('Error Occured' + JSON.stringify(error));
            })
    }

    // search key functionality // ************
    handleKeywordChange(event) {
        this.searchKey = event.target.value;
        console.log('searchKey' + JSON.stringify(this.searchKey));
        // send recordId and searchkey to apex method 
        getAcclist({ searchKeys: this.searchKey, lwcRecordId: this.recordId })
            .then((res) => {
                console.log('Result==>' + JSON.stringify(res));
                this.records = res; // get data into array
                this.totalRecords = res.length; // update total record count
                this.pageSize = this.pageSizeOptions[0]; // set the default record to show is first option
                this.paginationHelper();

            })
            .then(error => {
                console.log(error);
            })
    }

    // sort functionality // ****************
    handleChange(event) {
        this.value = event.target.value;
        getSortedList({ Value: this.value })
            .then((response) => {
                console.log('Result==>' + JSON.stringify(response));
                this.records = response; // get data into array
                this.totalRecords = response.length; // update total record count
                this.pageSize = this.pageSizeOptions[0]; // set the default record to show is first option
                this.paginationHelper();

            })
            .catch(error => {
                console.log(error);
            })
    }

    // handleRecordsPerPage(event) {
    //     this.pageSize = event.target.value;
    //     this.paginationHelper();
    // }

    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }

    paginationHelper() {
        this.recordsToDisplay = [];
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        }
        else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.recordsToDisplay.push(this.records[i]);
        }

    }




    // View Account detais after onClick on view button //**************

    getSelectedRow(event) {
        // alert('error occured');
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        const Id = row.Id;
        if (actionName == 'viewDetails') {
            this.showDetails = true;
            this.lwcRecordId = Id;
        }
        console.log(actionName);
        console.log(row);
    }
    // Open modal popup for contact details editing ************************
    @AuraEnabled
       public static Boolean  deleteContact(Id coId){
        system.debug('test');
        List<Contact> deleteConList = new List<Contact>();
        if(coId != null){
               Contact Cont = new Contact();
               Cont.Id = coId;
              deleteConList.add(Cont);
        }
       if(!deleteConList.isEmpty()){
            delete deleteConList;
            return true;
       }
        return false;
       } 
    closeBox() {
        this.isModal = false;
    }

    // Modal For Account Details Edit Section ***************


    submitDetails() {
        var inp = this.template.querySelectorAll("lightning-input");
        inp.forEach(function (element) {
            if (element.name == "name")
                this.accountName = element.value;

            else if (element.name == "count")
                this.accountCount = element.value;

            else if (element.name == "type")
                this.accountType = element.value;

            else if (element.name == "number")
                this.accountNumber = element.value;
        }, this);

        updateAccount({ accId: this.lwcRecordId, accountNames: this.accountName, accountCounts: this.accountCount, accountTypes: this.accountType, accountNumbers: this.accountNumber })
            .then(result => {
                if (result) {
                    const evt = new ShowToastEvent({
                        title: "Success",
                        message: 'Record Updated Successfully',
                        variant: "success",
                    });
                    this.dispatchEvent(evt);
                    // alert('Acoount Updated Successfully');
                    // this.dispatchEvent(Evt);
                    window.location.reload();
                }
                else {
                    alert('Data not updated');
                }

            })
            .catch(error => {
                console.log(error);
            })
    }



    submitContact() {
        var inp1 = this.template.querySelectorAll("lightning-input");
        inp1.forEach(function (element) {
            if (element.name == "fname")
                this.conFName = element.value;

            if (element.name == "lname")
                this.conLName = element.value;

            else if (element.name == "email")
                this.conEmail = element.value;

            else if (element.name == "phone")
                this.conPhone = element.value;

        }, this);

        updateContact({ coId: this.lwcId, conFNames: this.conFName, conLNames: this.conLName, conEmails: this.conEmail, conPhones: this.conPhone })
            .then(result => {
                if (result) {
                    const evt = new ShowToastEvent({
                        title: "Success",
                        message: 'Record Updated Successfully',
                        variant: "success",
                    });
                    this.dispatchEvent(evt);
                    // alert('Acoount Updated Successfully');
                    // this.dispatchEvent(Evt);
                    window.location.reload();
                }
                else {
                    alert('Data not updated');
                }

            })
            .catch(error => {
                console.log(error);
            })

    }
}
