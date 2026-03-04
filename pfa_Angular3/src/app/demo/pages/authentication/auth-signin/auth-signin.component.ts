import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <-- ajouté ici

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule] // <-- inclure CommonModule pour *ngIf, *ngFor…
})
export class AuthSigninComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  email() { return this.loginForm.get('email'); }
  password() { return this.loginForm.get('password'); }
showPassword = false;

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}
onSubmit() {
  this.submitted = true;

  if (this.loginForm.invalid) return;

  const { email, password } = this.loginForm.value;

  this.http.post<any>('http://localhost:8000/api/login', { email, password })
    .subscribe({
      next: (res) => {
        // récupère le rôle depuis res.user.role
        const role = res.role;

        // stocke token, rôle et id dans AuthService
       this.auth.setAuth(
          res.token,
          role,
          res.id,
          res.nom,
          res.prenom
        );

        // redirection selon rôle
        if (role.toLowerCase() === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/client-profile']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erreur de connexion';
      }
    });
}


}
