import { LightningElement } from 'lwc';
export default class SearchAccounts extends LightningElement {
    objectName='Account';
    searchField='Name';
    columns=[
        {label:'Id',fieldName:'Id'},
        {label:'Name',fieldName:'Name'},
    ];
}