import { LightningElement,track } from 'lwc';
import SAMPLEMC from "@salesforce/messageChannel/TestMessageChannel__c";
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext } from 'lightning/messageService';
export default class TestLwcCmp extends LightningElement {
    @track receivedMessage = '';
    @track myMessage = '';
    subscription = null;
    context = createMessageContext();
    columns =[{ label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'Button', cellAttributes:
    { iconName: { fieldName: 'provenanceIconName' }, iconLabel: { fieldName: 'provenanceIconLabel' }, iconPosition: 'right' } },]
    data=[{'id':'1','name':'sumant','website':'test'},{'id':'2','name':'sumant1','website':'test1'},{'id':'3','name':'sumant2','website':'test'}]
    constructor() {
        super();
        this.data.forEach((i)=>{
            if(i.website === 'test1'){
                i.provenanceIconName = 'utility:up';
                i.provenanceIconLabel = 'up';
             } else {
               i.provenanceIconName = 'utility:down';
                i.provenanceIconLabel = 'down';
            }
        })
        
        
    }

    handleChange(event) {
        this.myMessage = event.target.value;
    }

    publishMC() {
        const message = {
            messageToSend: this.myMessage,
            sourceSystem: "From LWC"
        };
        publish(this.context, SAMPLEMC, message);
    }

    subscribeMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.context, SAMPLEMC, (message) => {
            this.displayMessage(message);
        });
     }
 
     unsubscribeMC() {
         unsubscribe(this.subscription);
         this.subscription = null;
     }

     displayMessage(message) {
         this.receivedMessage = message ? JSON.stringify(message, null, '\t') : 'no message payload';
     }

     disconnectedCallback() {
         releaseMessageContext(this.context);
     }
}