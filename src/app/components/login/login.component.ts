import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toaster/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  email = '';
  password = '';
  loginForm: FormGroup;
  hidePassword = true;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public toastr: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          this.loading = false;
          this.toastr.showSuccess('User logged in successfully.');
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.loading = false;
          this.toastr.showError(error.error);
        }
      );
    }
  }

  navigateTo() {
    this.router.navigate(['/register'])
  }

  isLoggedIn() {
    return !!localStorage.getItem('user');
  }
}
