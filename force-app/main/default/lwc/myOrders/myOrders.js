import { LightningElement,track } from 'lwc';
import Id from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOrdersOfCurrentUser from '@salesforce/apex/PurchaseOrderController.getOrdersOfCurrentUser';
//test comment
export default class MyOrders extends LightningElement {
    userId=Id
    isDataLoading=true;
    sortDirection='asc';
    sortedBy;
    pageNumber=1;
    pageSize=10
    totalRecords;
    totalPages;
    columns=[
        {label:"Po Id",fieldName:'Id',type:'id'},
        {label:'Status',fieldName:'Status__c',type:'text',sortable: true},
        {label:'Order Date',fieldName:'Order_Date__c',type:'date',sortable: true},
        {label:'Order Total',fieldName:'Order_Total__c',sortable: true,type: 'currency', cellAttributes: { alignment: 'left' }}

    ]
    @track myOrders=[]

    openProductList(){
        this.dispatchEvent(new CustomEvent('openproductlist'))
    }
    connectedCallback(){
        this.getMyOrders()
    }
    getMyOrders(){
        getOrdersOfCurrentUser({userId:this.userId,pageSize:this.pageSize,pageNumber:this.pageNumber})
        .then(res=>{
            this.myOrders=res.records;
            this.totalPages=res.totalPages;
            this.isDataLoading=false; 
            console.log(JSON.stringify(res))
        })
        .catch(error=>{
            this.dispatchEvent(new ShowToastEvent({
                title: 'Unable to fetch my orders.',
                message:error.body.message,
                variant:'error'
            }))
        })
    }
    handleSort(event){
        this.sortedBy=event.detail.fieldName;
        this.sortDirection=event.detail.sortDirection
        let cloneMyOrders=[...this.myOrders]
        cloneMyOrders.sort(this.sortBy(this.sortedBy,this.sortDirection === 'asc' ? 1 : -1))
        this.myOrders=cloneMyOrders;
    }
    sortBy(field, reverse) {
        var key = function(x) {
                  return x[field];
              };
        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }
    handleNext(){
        this.pageNumber++;
        this.getMyOrders()
    }
    handlePrev(){
        this.pageNumber--;
        this.getMyOrders()

    }
    handleLast(){
        this.pageNumber=this.totalPages;
        this.getMyOrders()

    }
    handleFirst(){
        this.pageNumber=1;
        this.getMyOrders()

    }
    get disablePrev(){
        return this.pageNumber<=1
    }
    get disableNext(){
        return this.pageNumber >= this.totalPages
    }
}