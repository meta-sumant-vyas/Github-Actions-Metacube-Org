import { LightningElement,api } from 'lwc';

export default class SearchInput extends LightningElement {
    @api inputPlaceholder
    @api inputId
    @api btnLabel
    handleClick(event) {
        let searchKey = this.template.querySelector('lightning-input').value;
        this.dispatchEvent(new CustomEvent('search', {
            detail: searchKey
        }))
    }
}