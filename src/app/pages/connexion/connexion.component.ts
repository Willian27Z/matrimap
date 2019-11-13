import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';

import { AuthService } from '../../services/auth.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {
  isLoading = false;
  error: string = null;
  loginForm = new FormGroup({
    emailFormControl: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    passwordFormControl: new FormControl('',[
      Validators.minLength(6),
      Validators.required
    ])
  });
  matcher = new MyErrorStateMatcher();

  constructor(private authService: AuthService) { }

  onSubmit(){
    if (!this.loginForm.valid) {
      return;
    }

    const email = this.loginForm.controls.emailFormControl.value;
    const password =  this.loginForm.controls.passwordFormControl.value;

    this.isLoading = true;
    this.authService.login(email, password).subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
    this.loginForm.reset();
  }
}
