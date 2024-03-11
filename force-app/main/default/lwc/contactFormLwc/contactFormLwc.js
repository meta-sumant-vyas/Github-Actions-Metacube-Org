import { LightningElement,track } from 'lwc';
import saveContact from '@salesforce/apex/ContactController.saveContact'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ContactForm extends LightningElement {
    @track 
    contact={}
    handleCreate(event){
        let allInputs=[...this.template.querySelectorAll('lightning-input')]
        const allValid =allInputs
            .reduce((validSoFar, cmp) => {
                cmp.reportValidity();
                        return validSoFar && cmp.checkValidity();
            }, true);
        if (allValid) {
            saveContact({"contact":this.contact,sObjectType:'Contact'})
            .then(result=>{
                this.showSuccessToast(result)
                //empty fields
                this.resetFields(allInputs)
            })
            .catch(error=>this.showErrorToast(error))
        }
     
    }
    handleChange(event){
        this.contact[event.currentTarget.name]=event.target.value;
    }
    showErrorToast(error){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Failed to create contact.',
                message: error,
                variant: 'error'
            })
        );
    }
    showSuccessToast(){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Contact Created',
                variant: 'success'
            })
        );
    }
    resetFields(inputs){
        inputs.forEach(input => {
            input.value=''
        });
    }

}