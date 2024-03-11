import { LightningElement,api, track } from 'lwc';
import getSearchRecords from '@salesforce/apex/SearchRecordsController.getSearchRecords';

export default class SearchRecords extends LightningElement {
    @api objectName;
    @track records;
    @api columns;
    @api searchField;
    searchKey='';
    fields;
    handleSearch(event){
        this.searchKey=event.detail;
        this.getRecords()
    }
    getRecords(){
        getSearchRecords({fields:this.fields,searchKey:this.searchKey,objectName:this.objectName,searchField:this.searchField})
        .then(res=>{
            console.log(res);
            this.records=res;
        }).catch(error=>console.log(error))
    }
    connectedCallback(){
        this.fields=this.columns.map(i=>{
            return i.fieldName
        })
        this.getRecords()
    }
}