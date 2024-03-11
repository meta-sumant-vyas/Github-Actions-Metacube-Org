import { LightningElement,track } from 'lwc';

export default class ShoppingMain extends LightningElement {

    @track
    productInCart=[]
    isCartOpen=false;
    isProductListOpen=false;
    isMyOrdersOpen=true;
    getSelectedProducts(event){
        for(let newProduct of event.detail){
            let product=this.productInCart.find(product=>product.Id===newProduct.Id)
            if(product){
                product.Unit__c++;
            }
            else
                this.productInCart.push(newProduct);
        }
        this.isCartOpen=true;
        this.isProductListOpen=false;
    }
    openProductList(){
        this.isProductListOpen=true;
        this.isCartOpen=false;
        this.isMyOrdersOpen=false
    }
    openCart(){
        this.isProductListOpen=false;
        this.isCartOpen=true;
        this.isMyOrdersOpen=false
    }
    openMyOrders(){
        this.isMyOrdersOpen=true
        this.isProductListOpen=false;
        this.isCartOpen=false;
    }
    handleDeleteFromCart(event){
        this.productInCart=this.productInCart.filter(p=>p.Id!==event.detail.Id)
    }
    handleDraftUpdate(event){
        event.detail.draftValues.map(v=>{
            let product= this.productInCart.find(p=>p.Id===v.Id)
            product.Unit__c=v.Unit__c;
        })
    }
    handleEmptyCart(){
        this.productInCart=[]
        this.openMyOrders();
    }
    get isCartEmpty(){
        return this.productInCart.length<=0;
    }
}