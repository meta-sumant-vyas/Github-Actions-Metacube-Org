import { LightningElement, api, track } from 'lwc';
import Id from '@salesforce/user/Id';
import addPurchaseOrder from '@salesforce/apex/PurchaseOrderController.addPurchaseOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProductCart extends LightningElement {
    userId = Id;
    isInvoice = false;
    isOrderProcessing = false;
    columns = [
        { label: "Name", fieldName: 'Name' },
        { label: "Quantity", fieldName: 'Unit__c', type: "integer", editable: true },
        { label: "Price", fieldName: 'Price__c', type: "integer" },
        { label: "Delete", type: 'button', typeAttributes: { label: { fieldName: 'actionLabel' }, title: 'Delete', name: 'delete', iconName: 'utility:delete', class: 'delete_btn' } }
    ]
    @api products = []

    handleRowAction(event) {
        let actionName = event.detail.action.name
        switch (actionName) {
            case 'delete': {
                this.deleteProduct(event.detail.row)
            }
        }
    }
    get cardTitle() {
        if (this.isInvoice)
            return "My Invoice"
        return "My Cart"
    }
    get isCartEmpty() {
        return this.products.length <= 0
    }
    get todayDate() {
        var currentDate = new Date()
        var day = currentDate.getDate()
        var month = currentDate.getMonth() + 1
        var year = currentDate.getFullYear()
        return `${day}/${month}/${year}`
    }   

    deleteProduct(currProduct) {
        this.dispatchEvent(new CustomEvent('deleteproduct', {
            detail: { Id: currProduct.Id }
        }))
    }
    handleChackOut() {
        this.columns = [
            { label: "Name", fieldName: 'Name' },
            { label: "Quantity", fieldName: 'Unit__c', type: "integer" },
            { label: "Price", fieldName: 'Price__c', type: 'currency' },
            { label: "Total", fieldName: 'Total__c', type: 'currency' },
        ]
        // calculate total amount
        let invoiceList = []
        for (let product of this.products) {
            console.log(product.Price__c, product.Unit__c)
            let productTotal = { ...product, Total__c: product.Unit__c * product.Price__c };
            invoiceList.push(productTotal);
        }
        this.products = invoiceList;
        this.isInvoice = true;
    }
    handelCellChange(event) {
        let datatable = this.template.querySelector("lightning-datatable")
        let draftValue = event.detail.draftValues[0];
        if (draftValue.Unit__c <= 0) {
            alert("Enter Valid Quantity.")
            datatable.draftValues = [];
            return
        }
        let currProduct = this.products.find(p => p.Id === draftValue.Id)
        if (currProduct.Stock__c < draftValue.Unit__c) {
            alert("No Stock Available.")
            datatable.draftValues = [];
            return
        }
        this.saveDraft(datatable.draftValues);
        datatable.draftValues = [];

    }
    saveDraft(draftValues) {
        this.dispatchEvent(new CustomEvent('updatedraft', {
            detail: { draftValues: draftValues }
        }))
    }
    handlePlaceOrder() {
        this.isOrderProcessing = true;
        addPurchaseOrder({ userId: this.userId, products: this.getProductListWithUnitPriceId() })
            .then(res => {
                this.products = [];
                this.isOrderProcessing = false;
                this.dispatchEvent(new CustomEvent('emptycart'))
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Your order is placed successfully.',
                    message:'It will be shipped soon.',
                    variant:'success'
                }))
            }).catch(error=>{
                this.isOrderProcessing = false;
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Something went wrong',
                    message:error.body.message,
                    variant:'error'
                }))
            })
    }
    getProductListWithUnitPriceId() {
        let productInCart = [];
        this.products.forEach(p => {
            productInCart.push({ price: p.Price__c, productId: p.Id, unit: p.Unit__c })
        })
        return productInCart;
    }
    
}