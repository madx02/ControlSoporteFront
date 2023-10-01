import { Component, OnInit } from "@angular/core";
import { ApiService } from "../core/service/api.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Customer, RespCustomers } from "../core/models/IRespCustomers";
import { RespUsers, Usuario } from "../core/models/RespUsers";
import { Planned, RespPlanned } from "../core/models/RespPlanned";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-planned",
  templateUrl: "./planned.component.html",
  styleUrls: ["./planned.component.css"],
})
export class PlannedComponent implements OnInit {
  customerList: Customer[];
  userList: Usuario[];
  plannedList: Planned[];
  plannedState: any[]= [
    {'situacion':'P', 'descripcion': 'PENDIENTE'},
    {'situacion':'E', 'descripcion': 'EN PROCESO'},
    {'situacion':'F', 'descripcion': 'FINALIZADA'},
    {'situacion':'C', 'descripcion': 'CANCELAR'},

  ];
  plannedForm: FormGroup;


  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.plannedForm = this.createPlannedForm();
    this.plannedForm.controls['idPlanned'].disable();
  }

  ngOnInit(): void {
    this.getCustomers();
    this.getUsers();
    this.getPlanneds();
  }

  createPlannedForm(data?: Planned) {
    let customer;
    if(data?.cliente){
      customer = this.customerList.find(c => c.idcliente == data.idCliente);
    }
    return this.fb.group({
      uid: data?.uid || "",
      idPlanned: data?.idPlanned || "",
      idCliente: data?.idCliente || "",
      cliente: [customer || "", [Validators.required]],
      usuario: [data?.usuario._id || "", [Validators.required]],
      descripcion: [data?.descripcion || "", [Validators.required]],
      fecha_programada: [data?.fecha_programada || "", [Validators.required]],
      situacion: [data?.situacion || "", [Validators.required]],
    });
  }

  formValidation(){
    if(this.plannedForm.invalid){
      this.plannedForm.markAllAsTouched();
      return;
    }
    this.plannedForm.controls['uid'].value? this.updatePlanned(): this.savePlanned();
  }

  resetForm(){
    this.plannedForm = this.createPlannedForm();
    this.plannedForm.controls['idPlanned'].disable();
  }

  editPlannedForm(data: Planned){
    this.plannedForm = this.createPlannedForm(data);
    this.plannedForm.controls['idPlanned'].disable();
  }

  private savePlanned(){
    const { uid, fecha_programada, situacion, usuario, ...rest } = this.plannedForm.getRawValue();
    this.apiService
      .post("planneds", {
        "idCliente": rest.cliente.idcliente,
        "cliente": rest.cliente.uid,
        "usuario": usuario,
        'descripcion': rest.descripcion,
        "fecha_programada": fecha_programada,
        "situacion": situacion
      })
      .subscribe(
        (resp: any) => {
          this.toastr.success("SATISFACTORIO", "REGISTRO GUARDADO EXISTOSAMENTE",  {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-top-right",
          });
          this.getPlanneds();
        },

        (error: HttpErrorResponse) => {
          // Si sucede un error
          console.error(error);
        }
      );
  }

  private updatePlanned(){
    const { uid, fecha_programada, situacion, usuario, ...rest } = this.plannedForm.getRawValue();
    this.apiService
      .put(`planneds/${uid}`, {
        "idCliente": rest.cliente.idcliente,
        "cliente": rest.cliente.uid,
        'descripcion': rest.descripcion,
        "usuario": usuario,
        "fecha_programada": fecha_programada,
        "situacion": situacion
      })
      .subscribe(
        (resp: any) => {
          this.toastr.success("SATISFACTORIO", "REGISTRO ACTUALIZADO EXISTOSAMENTE",  {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-top-right",
          });
          this.getPlanneds();
        },

        (error: HttpErrorResponse) => {
          // Si sucede un error
          console.error(error);
        }
      );
  }

  private getCustomers() {
    this.apiService.get("clientes").subscribe(
      (resp: RespCustomers) => {
        this.customerList = resp.datos;
      },

      (error: HttpErrorResponse) => {
        // Si sucede un error
        console.error(error);
      }
    );
  }

  private getUsers() {
    this.apiService.get("usuarios").subscribe(
      (resp: RespUsers) => {
        this.userList = resp.usuarios;
      },

      (error: HttpErrorResponse) => {
        // Si sucede un error
        console.error(error);
      }
    );
  }

  private getPlanneds() {
    this.apiService.get("planneds").subscribe(
      (resp: RespPlanned) => {
        this.plannedList = resp.datos;
      },

      (error: HttpErrorResponse) => {
        // Si sucede un error
        console.error(error);
      }
    );
  }
}
