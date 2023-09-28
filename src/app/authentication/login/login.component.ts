import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/service/api.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: ApiService
  ) {

    if (environment.production) {
      console.log('La aplicación se está ejecutando en modo producción.');
      // Realiza acciones específicas para el modo de producción
    } else {
      console.log('La aplicación se está ejecutando en modo desarrollo.');
      // Realiza acciones específicas para el modo de desarrollo
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.usuarioService.post("auth/login", this.loginForm.value).subscribe(
        (resp: any) => {
          this.loginSuccess( resp.token);
        },
        (error: HttpErrorResponse) => {
          // Si sucede un error
          console.error(error);
        }
      );
    }
  }

  private loginSuccess(token: string){
    debugger;
    localStorage.setItem("x-token", JSON.stringify(token));
    this.router.navigate(["/dashboard"]);
  }
}
