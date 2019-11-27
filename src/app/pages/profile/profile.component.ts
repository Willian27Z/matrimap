import { Component, OnInit } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup } from '@angular/forms';
import { MyProfile } from 'src/app/models/myProfile.model';
import { getProfileForm, GetPrefs } from './profile-form';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private breakpointService: BreakpointService,
    private authService: AuthService,
  ) { }

  myProfile: MyProfile;
  form = new FormGroup({});
  model: MyProfile['profil'];
  fields: FormlyFieldConfig[] = getProfileForm();
  prefForm = new FormGroup({});
  prefModel: MyProfile['prefs']['notifications'];
  prefFields: FormlyFieldConfig[] = GetPrefs();

  ngOnInit() {
    this.storage.myProfile.subscribe(profile => {
      if(profile){
        this.model = profile.profil;
        this.prefModel = profile.prefs.notifications;
      }
    });
    this.api.getMyProfile();
  }

  changeProfile(){
    console.log(this.model);
    this.api.updateProfile(this.model);
  }
  changePrefs(){
    this.api.updatePrefs(this.prefModel);
  }
}
