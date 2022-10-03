public with sharing class getAccounts {
   
    @AuraEnabled(Cacheable=true)
    public static List<Account>  getAcclist(Id lwcRecordId, string searchKeys){
    //  List<Account> AccList = [select Id, Name, Industry from Account];
    //         return AccList;
              // If search key is available
     If(searchKeys != null && searchKeys!= ''){
         string key= '%' + searchKeys + '%'; //search key
        List<Account> AccList = [select Id, Name from Account WHERE Name LIKE: key  ];
        return AccList;
     }
      else{
         List<Account> AcList = [select Id, Name from Account ];
         //null check
         If(!AcList.isEmpty()){
         return AcList;  
         }
         return null;
      }
    }
  
  // class for sorting
  @AuraEnabled(Cacheable=true)
  public static List<Account> getSortedList(string Value){
     If(Value == 'Asc'){
         List<Account> AccSortList = [select Id, Name from Account ORDER BY Name ASC];
        If(!AccSortList.isEmpty()){
          return AccSortList;  
        }
        }
       else if(Value == 'Desc'){
           List<Account> AcSortList = [select Id, Name from Account ORDER BY Name DESC];
           //null check
          If(!AcSortList.isEmpty())
                return AcSortList;  
          
       }
       else {
  
        }
        return null;
       }
        // For Account Details    
       @AuraEnabled(Cacheable=true)
       public static List<Account>  getdetaillist(Id recordId){
        List<Account> detailList = [select Id, Name, NumberOfEmployees, Type, AccountNumber from Account Where Id=:recordId ];
        return detailList;
       }
  
       // For Related Contact Details    
       @AuraEnabled(Cacheable=true)
       public static List<Contact>  getContactlist(Id recId){
        List<Contact> ConList = [select Id, Name from Contact Where AccountId=:recId ];
        return ConList;
       }
       @AuraEnabled(Cacheable=true)
       public static List<Contact>  getContacts(Id conId){
        List<Contact> ConRowList = [select Id, FirstName, LastName, Email, Phone from Contact Where Id=:conId ];
        return ConRowList;
       }
       
       @AuraEnabled
       public static Boolean  updateAccount(Id accId, string accountNames, string accountTypes, string accountNumbers ,Integer accountCounts ){
        system.debug('test');
        List<Account> updateAccList = new List<Account>();
        if(accId != null){
               Account Acc = new Account();
               Acc.Id = accId;
               Acc.Name = accountNames;
              Acc.AccountNumber = accountNumbers;
              Acc.Type = accountTypes;
              Acc.NumberOfEmployees = accountCounts;
              updateAccList.add(Acc);
        }
       if(!updateAccList.isEmpty()){
            Update updateAccList;
            return true;
       }
  
  
        return false;
       }
       @AuraEnabled
       public static Boolean  updateContact(Id coId, string conFNames, string conLNames, string conEmails, string conPhones ){
        system.debug('test');
        List<Contact> updateConList = new List<Contact>();
        if(coId != null){
               Contact Con = new Contact();
               Con.Id = coId;
               Con.FirstName = conFNames;
               Con.LastName = conLNames;
               Con.Email = conEmails;
               Con.Phone = conPhones;
              
               updateConList.add(Con);
        }
       if(!updateConList.isEmpty()){
            Update updateConList;
            return true;
       }
  
  
        return false;
       }
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
    }  