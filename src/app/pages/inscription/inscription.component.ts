import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';


const passwordMatcher: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const p1 = control.get('password');
  const p2 = control.get('password2');

  return p1 && p2 && p1.value !== p2.value ? { 'passwordsDontMatch': true } : null;
};

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {
  isLoading = false;
  error: string = null;
  signupForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    username: new FormControl('', [
      Validators.minLength(3),
      Validators.required,
    ]),
    password: new FormControl('',[
      Validators.minLength(6),
      Validators.required
    ]),
    password2: new FormControl('', [
      Validators.required
    ]),
    firstName: new FormControl('', [
      Validators.minLength(3),
      Validators.required,
    ]),
    lastName: new FormControl('', [
      Validators.minLength(3),
      Validators.required,
    ]),
  }, { validators: passwordMatcher });

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit(){
    if (!this.signupForm.valid) {
      return;
    }
    const newUser = {
      email: this.signupForm.controls.email.value,
      username: this.signupForm.controls.username.value,
      password: this.signupForm.controls.password.value,
      firstName: this.signupForm.controls.firstName.value,
      lastName: this.signupForm.controls.lastName.value,
    }

    this.isLoading = true;
    this.authService.signup(newUser).subscribe(
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
    this.signupForm.reset();
  }
}
