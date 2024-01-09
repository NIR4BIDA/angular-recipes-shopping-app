import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  @ViewChild('authForm') authForm: NgForm;
  isLoginMode = false;
  isLoading = false;
  error = null;

  constructor(private authService: AuthService, private router: Router) {}
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onHandleError(){
    this.error=null
  }
  onSubmit() {
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;
    this.isLoading = true;
    let authObs;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }
    authObs.subscribe(
      (res) => {
        this.isLoading = false;
        console.log(res);
        this.router.navigate(['/recipes']);
      },
      (errorMsg) => {
        this.isLoading = false;
        this.error = errorMsg;
      }
    );
    this.authForm.reset();
  }
}
