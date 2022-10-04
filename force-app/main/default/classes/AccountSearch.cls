public with sharing class AccountSearch {
    @AuraEnabled(Cacheable = true)
    public static list<Account> getAccountData(String textkey) {
        textkey = '%' + textkey + '%';
        list<Account> accLst = 
        [SELECT  Id, Name From Account WHERE Name LIKE :textkey];
        if(accLst.isEmpty()) {
            throw new AuraHandledException('No Record Found..');
        }
        return accLst; 
    }

    @AuraEnabled(Cacheable=true)
public static List<Account> getAccountDataDetails(string Value){
   if(Value == 'ascending'){
       List<Account> AccSortList = [select Id, Name from Account ORDER BY Name ASC LIMIT 4];
      if(!AccSortList.isEmpty()){
        return AccSortList;  
      }
      }
     else if(Value == 'descending'){
         List<Account> accLst = [select Id, Name from Account ORDER BY Name DESC LIMIT 4];
         //null check
        If(!accLst.isEmpty())
              return accLst;  
     }
     else {
      }
      return null;
     }

    @AuraEnabled(Cacheable = true)
    public static list<Account> viewRecord(String recrdsID) {
        list<Account> accLst = 
        [SELECT  Id, Name, NumberOfEmployees, Type From Account WHERE id  =: recrdsID];
        if(accLst.isEmpty()) {
            throw new AuraHandledException('No Record Found..');
        }
        
        return accLst; 
    }   
    @AuraEnabled(Cacheable=true)
    public static List<Contact>  GetContacts(Id recdId){
        List<Contact> ConList = [select Id, Name from Contact Where AccountId=:recdId ];
        return ConList;
        }
    @AuraEnabled(Cacheable=true)
    public static List<Contact>  GetConRecord(Id coneditdId){
        List<Contact> ConRecList = [select Id, FirstName, LastName, Email from Contact Where Id=:coneditdId ];
        return ConRecList;
        }

    @AuraEnabled
    public static list<Account> UpdateRecord(String accountId, String accountNames, Integer accountNumberOfEmployeess ,String accountTypes) {
        list<Account> updatedAccountList = new List<Account>();
        if(accountId != Null) {
            Account accObj = new Account();
                accObj.Id = accountId;
                accObj.Name = accountNames;
                accObj.NumberOfEmployees = accountNumberOfEmployeess;
                accObj.Type = accountTypes;
                updatedAccountList.add(accObj);
        }
        if(!updatedAccountList.isEmpty()){
            System.debug('updatedAccountList:'+updatedAccountList);
            System.debug('Total DML--->'+ limits.getLimitDmlStatements());
            update updatedAccountList;
            return updatedAccountList;
        }
        
        return NULL; 
    } 
    @AuraEnabled
    public static List<Contact>  UpdateContacts(Id ContactId,  String firstNames, String lastNames ,String Emails){
        list<Contact> updatedContactList = new List<Contact>();
        if(ContactId != Null) {
            Contact conObj = new Contact();
                conObj.Id = ContactId;
                conObj.FirstName = firstNames;
                conObj.LastName = lastNames;
                conObj.Email = Emails;
                updatedContactList.add(conObj);
        }
        if(!updatedContactList.isEmpty()){
            System.debug('updatedContactList:'+updatedContactList);
            System.debug('Total DML--->'+ limits.getLimitDmlStatements());
            update updatedContactList;
            return updatedContactList;
        }
        return null;
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