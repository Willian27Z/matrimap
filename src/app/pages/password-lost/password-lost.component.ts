import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-password-lost',
  templateUrl: './password-lost.component.html',
  styleUrls: ['./password-lost.component.scss']
})
export class PasswordLostComponent implements OnInit {

  constructor(private api: ApiService) { }

  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [{
    key: "email",
    type: "input",
    templateOptions: {
        type: "email",
        label: "email",
        required: true
    }
  }]

  ngOnInit() {
  }

  lostPassword(){
    console.log(this.model);
    this.api.lostPassword(this.model.email);
  }

}
