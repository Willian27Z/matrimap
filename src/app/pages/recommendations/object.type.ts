import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-object-type',
  template: `
    <div class="mb-3">
      <legend *ngIf="to.label">{{ to.label }}</legend>
      <h4 *ngIf="to.description">{{ to.description }}</h4>
      
      <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
    </div>
  `,
})
export class ObjectTypeComponent extends FieldType {
  defaultOptions = {
    defaultValue: {},
  };
}