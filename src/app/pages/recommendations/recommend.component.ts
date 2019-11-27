import { Component, OnInit } from '@angular/core';
import { Discussion } from 'src/app/models/discussion.model';
import { Subscription } from 'rxjs';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { StorageService } from 'src/app/services/storage.service';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recommend',
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.scss']
})
export class RecommendComponent implements OnInit {

  loading: boolean = true;
  admin: boolean = false;
  search: string;
  handset: boolean = false;

  form = new FormGroup({});
  model: any = {
    owner: this.authService.getUsername(),
    avis: [
      {
        service: "cattering",
        societe: "food inc",
        avis: "très bien"
      }
    ]
  }
  fields: FormlyFieldConfig[];

  constructor(
    private breakpointService: BreakpointService,
    private storage: StorageService,
    private api: ApiService,
    private http: HttpClient,
    private formlyJsonschema: FormlyJsonschema,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.breakpointService.currentBreakpoint.subscribe(result => {
      if (result.matches) {
        this.handset = true;
      } else {
        this.handset = false;
      }
    });

    // get schema
    this.http.get<any>(environment.API + "/js/recommandation-schema.json").pipe(
      tap((schema) => {
        console.log(schema);
        this.fields = [this.formlyJsonschema.toFieldConfig(schema.schema)];
      }),
    ).subscribe();
    this.http.get<any>(environment.API + "/api/recommend").subscribe(resData => {
      this.model = resData;
    });
  }
  saveRecommends(){
    this.api.saveRecommends(this.model);
  }
}
