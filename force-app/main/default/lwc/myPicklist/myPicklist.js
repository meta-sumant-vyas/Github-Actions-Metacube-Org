import { LightningElement,track } from 'lwc';

export default class MyPicklist extends LightningElement {
    @track options1=[
        "A","B","C"
    ]
    @track options2=[
        "A","B","C"
    ]
    selectionChangeHandler1(event){
        console.log(event.target.value)
        let picklist2=this.template.querySelectorAll('select')[1];
        console.log('picklist2',picklist2.value)
        if(picklist2.value==='Select'){
            picklist2.value=event.target.value;
        }
    }
    selectionChangeHandler2(event){
    }
}