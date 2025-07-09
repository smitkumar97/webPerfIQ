import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toaster/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {
  loading: boolean = false;

  registerForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService, private router: Router,
    public toastr: ToastService) { }

  onRegister() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(this.registerForm.value).subscribe(
        () => {
          this.loading = false;
          this.toastr.showSuccess('User registered successfully.');
          this.router.navigate(['/login'])
        },
        (error) => {
          this.loading = false;
          this.toastr.showError(error.error);
        }
      );
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
