import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/service/api.service';
import { ShowAlertToastService } from '../../core/service/show-alert-toast.service';
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: ApiService,
    private ShowAlertToastService: ShowAlertToastService
  ) {


  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.usuarioService.post("auth/login", this.loginForm.value).subscribe(
        (resp: any) => {
          const userName = `${resp.usuario.nombres} ${resp.usuario.apellidos}`
          this.loginSuccess(resp.token, userName);
        },
        (error: HttpErrorResponse) => {
          // Si sucede un error
          this.ShowAlertToastService.errorAlert(error.error.msg);
        }
      );
    }
  }

  private loginSuccess(token: string, usuario: string){
    localStorage.setItem("x-token", JSON.stringify(token));
    localStorage.setItem("userName", usuario);
    this.router.navigate(["/dashboard"]);
  }


}
