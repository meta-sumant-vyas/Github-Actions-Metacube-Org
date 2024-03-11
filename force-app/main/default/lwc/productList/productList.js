import { LightningElement,track, wire,api } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProductList extends LightningElement {
    columns=[
        
        {label:"Name",fieldName:"Name",sortable: true,},
        {label:"Price",fieldName:"Price__c",type: 'currency',sortable: true, },
        {label:"Prodcut Code",fieldName:"ProductCode",sortable: true },
        {label:"Available Stock",fieldName:"Stock__c",sortable: true }

    ]
    @api searchString;
    @track 
    products=[]
    @track
    selectedProducts=[]
    sortDirection='desc';
    sortedBy;
    pageNumber=1;
    pageSize=10
    totalRecords;
    totalPages;
    isDataLoading=true;

    handleGetProducts(){        
        getProducts({pageSize:this.pageSize,pageNumber:this.pageNumber,searchString:this.searchString}).then(res=>{
            this.products=res.records;
            this.totalPages=res.totalPages;
            this.isDataLoading=false
        }).catch(error=>{
            this.isDataLoading=false
            this.dispatchEvent(new ShowToastEvent({
                title: 'Something went wrong.',
                message:error.body.message,
                variant:'error'
            }))
        })
    }
    connectedCallback(){
        this.handleGetProducts()
    }
    handleNext(){
        this.pageNumber++;
        this.handleGetProducts();
    }
    handlePrev(){
        this.pageNumber--;
        this.handleGetProducts();

    }
    handleLast(){
        this.pageNumber=this.totalPages;
        this.handleGetProducts()

    }
    handleFirst(){
        this.pageNumber=1;
        this.handleGetProducts()

    }
    handleChange(event){
        this.searchString=event.target.value;
    }
    handleSearch(){
        this.handleGetProducts()
    }
    get disablePrev(){
        return this.pageNumber<=1
    }
    get disableNext(){
        console.log(this.pageNumber == this.totalPages,this.pageNumber+' '+this.totalPages)
        return this.pageNumber >= this.totalPages
    }
    handleSort(event){
        this.sortedBy=event.detail.fieldName;
        this.sortDirection=event.detail.sortDirection
        let cloneProducts=[...this.products]
        cloneProducts.sort(this.sortBy(this.sortedBy,this.sortDirection === 'asc' ? 1 : -1))
        this.products=cloneProducts;
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
    handleAddToCart(){
        
        let table =this.template.querySelector('lightning-datatable');
        let data=table.getSelectedRows()
        let productWithCount=data.map(p=>{
            return {...p,Unit__c:1}
        })
        console.log("product list",JSON.stringify(productWithCount))
        this.dispatchEvent( new CustomEvent('selectedproducts',{
            detail:productWithCount
        }))
    }
    handleSelection(event){
        let validProducts=[]
        this.selectedProducts=event.detail.selectedRows.map(product=>{
             if(!product.Stock__c||product.Stock__c<=0){
                alert("This Product is out of stock.")
                return;
             }
                 validProducts.push(product)
                return product.Id;
         })
         event.detail.selectedRows=validProducts
    }

}