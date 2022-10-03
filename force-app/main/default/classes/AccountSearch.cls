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
       List<Account> AccSortList = [select Id, Name from Account ORDER BY Name ASC];
      if(!AccSortList.isEmpty()){
        return AccSortList;  
      }
      }
     else if(Value == 'descending'){
         List<Account> accLst = [select Id, Name from Account ORDER BY Name DESC];
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
    @AuraEnabled
    public static list<Account> UpdateRecord(String accountId, String accountName, Integer accountNumberOfEmployees ,String accountType) {
        list<Account> updatedAccountList = new List<Account>();
        if(accountId != Null) {
            Account accObj = new Account();
                accObj.Id = accountId;
                accObj.Name = accountName;
                accObj.NumberOfEmployees = accountNumberOfEmployees;
                accObj.Type = accountType;
                updatedAccountList.add(accObj);
        }
        if(!updatedAccountList.isEmpty()){
            System.debug('updatedAccountList:'+updatedAccountList);
            system.debug('Total DML--->'+ limits.getLimitDmlStatements());
            update updatedAccountList;
            return updatedAccountList;
        }
        return NULL; 
    } 
}