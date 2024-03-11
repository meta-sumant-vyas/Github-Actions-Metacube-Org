import { LightningElement } from 'lwc';

export default class SearchComponent extends LightningElement {

    handleClick(event) {
        let searchKey = this.template.querySelector('lightning-input').value;
        this.dispatchEvent(new CustomEvent('search', {
            detail: searchKey
        }))
    }
}