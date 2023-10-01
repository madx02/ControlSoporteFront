import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Planned, RespPlanned } from '../core/models/RespPlanned';
import { HttpErrorResponse } from '@angular/common/http';
import { HomeVisit, RespHomeVisits, VisitPlanned } from '../core/models/RespHomeVisits';
import { RespUserPlanned, UserPlanned } from '../core/models/RespUserPlanned';
import { MatDialog } from '@angular/material/dialog';
import { VisitsAttentionComponent } from '../visits-attention/visits-attention.component';

@Component({
  selector: "app-home-visits",
  templateUrl: "./home-visits.component.html",
  styleUrls: ["./home-visits.component.css"],
})
export class HomeVisitsComponent implements OnInit {
  plannedList: UserPlanned[];
  homeVisitList: HomeVisit[];
  vistSituation: any[] = [
    { situacion: "P", descripcion: "PENDIENTE" },
    { situacion: "E", descripcion: "EN PROCESO" },
    { situacion: "F", descripcion: "FINALIZADA" },
    { situacion: "C", descripcion: "CANCELAR" },
  ];
  homeVisitForm: FormGroup;
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.homeVisitForm = this.createHomeVisit();
    this.disableCustomForm();
    this.homeVisitForm.patchValue({
      situacion: "P",
    });
  }

  ngOnInit(): void {
    this.getPlanneds();
    this.getHomeVisits();
  }

  createHomeVisit(data?: VisitPlanned) {
    let homeVisit;
    if (data?.visit?.planned) {
      homeVisit = this.plannedList.find(
        (c) => c.idPlanned == data?.visit?.idPlanned
      );
    }
    return this.fb.group({
      uid: data?.visit?.uid || "",
      idVisita: data?.visit?.idVisita || "",
      idPlanned: data?.visit?.idPlanned || data?.planned || "",
      cliente: data?.planned?.cliente?.nombreComercial || "",
      tecnico: data?.planned?.usuario?.nombres || "",
      planned: [
        homeVisit?.idPlanned || data?.planned?.idPlanned || "",
        [Validators.required],
      ],
      fecha_inicio: [data?.visit?.fecha_inicio || ""],
      fecha_fin: [data?.visit?.fecha_fin || ""],
      descripcion: [
        data?.visit?.descripcion || data?.planned?.descripcion || "",
      ],
      observacion1: [data?.visit?.observacion1 || ""],
      observacion2: [data?.visit?.observacion2 || ""],
      situacion: [data?.visit?.situacion || "", [Validators.required]],
    });
  }

  resetForm() {
    this.homeVisitForm = this.createHomeVisit();
    this.disableCustomForm();
  }

  disableCustomForm() {
    this.homeVisitForm.controls["idVisita"].disable();
    this.homeVisitForm.controls["planned"].disable();
    this.homeVisitForm.controls["descripcion"].disable();
    this.homeVisitForm.controls["cliente"].disable();
    this.homeVisitForm.controls["situacion"].disable();
  }

  formValidation() {
    const { situacion, fecha_inicio } = this.homeVisitForm.getRawValue();
    if (this.homeVisitForm.invalid) {
      this.homeVisitForm.markAllAsTouched();
      return;
    }

    if (situacion == "P" && (!fecha_inicio || fecha_inicio == "")) {
      this.homeVisitForm
        .get("fecha_inicio")
        .setValidators([Validators.required]);

      // Marcar el control 'fecha_inicio' como 'touched'
      this.homeVisitForm.get("fecha_inicio").markAsTouched();

      // Actualizar el estado de validación del control
      this.homeVisitForm.get("fecha_inicio").updateValueAndValidity();
      return;
    }

    this.homeVisitForm.controls["uid"].value
      ? this.updateHomeVisit()
      : this.saveHomeVisit();
  }

  editHomeVisitForm(data: HomeVisit) {
    let homeVisit: VisitPlanned;
    homeVisit = {
      visit: data,
      planned: null,
    };
    this.homeVisitForm = this.createHomeVisit(homeVisit);
    this.homeVisitForm.get("fecha_fin").setValidators([Validators.required]);
    this.homeVisitForm.get("fecha_fin").updateValueAndValidity();
    this.homeVisitForm.get("observacion1").setValidators([Validators.required]);
    this.homeVisitForm.get("observacion1").updateValueAndValidity();
    this.homeVisitForm.get("observacion2").setValidators([Validators.required]);
    this.homeVisitForm.get("observacion2").updateValueAndValidity();
    this.homeVisitForm.controls["fecha_inicio"].disable();

    this.disableCustomForm();
  }

  editHomeVisitPlanned(data: Planned) {
    let homeVisit: VisitPlanned;
    homeVisit = {
      visit: null,
      planned: data,
    };
    this.homeVisitForm = this.createHomeVisit(homeVisit);
    this.homeVisitForm.patchValue({
      situacion: "P",
    });
    this.disableCustomForm();
  }

  private getPlanneds() {
    const session = localStorage.getItem("x-token");
    var base64Url = session.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    const userID = JSON.parse(window.atob(base64));
    this.apiService.get(`planneds/${userID.uid}`).subscribe(
      (resp: RespUserPlanned) => {
        this.plannedList = resp.datos.filter(p => p.situacion != 'F');
      },

      (error: HttpErrorResponse) => {
        // Si sucede un error
        console.error(error);
      }
    );
  }

  private getHomeVisits() {
    const session = localStorage.getItem("x-token");
    var base64Url = session.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    const userID = JSON.parse(window.atob(base64));
    this.apiService.get(`visitas/${userID.uid}`).subscribe(
      (resp: RespHomeVisits) => {
        this.homeVisitList = resp.visitas.filter(v => v.situacion != 'F');
      },

      (error: HttpErrorResponse) => {
        // Si sucede un error
        console.error(error);
      }
    );
  }

  private saveHomeVisit() {
    const { uid, idVisita, planned, idPlanned, ...rest } =
      this.homeVisitForm.getRawValue();

    const plannedValue = this.homeVisitForm.get("idPlanned").value;
    const situacionValue = this.homeVisitForm.get("situacion").value;
    const descripcionValue = this.homeVisitForm.get("descripcion").value;

    this.apiService
      .post("visitas", {
        ...rest,
        planned: plannedValue.uid,
        situacion: "A",
        descripcion: descripcionValue,
      })
      .subscribe(
        (resp: any) => {
          this.toastr.success(
            "SATISFACTORIO",
            "REGISTRO GUARDADO EXISTOSAMENTE",
            {
              timeOut: 8000,
              closeButton: true,
              enableHtml: true,
              toastClass: "alert alert-success alert-with-icon",
              positionClass: "toast-top-right",
            }
          );
          this.getPlanneds();
          this.getHomeVisits();
        },

        (error: HttpErrorResponse) => {
          // Si sucede un error
          console.error(error);
        }
      );
  }

  private updateHomeVisit() {
    this.homeVisitForm.enable();
    const { uid, planned, situacion, idPlanned, ...rest } =
      this.homeVisitForm.getRawValue();
    this.homeVisitForm.disable();
    this.apiService
      .put(`visitas/${uid}`, {
        ...rest,
        idPlanned: planned.idPlanned,
        planned: planned.uid,
        situacion: 'F'
      })
      .subscribe(
        (resp: any) => {
          this.toastr.success(
            "SATISFACTORIO",
            "REGISTRO ACTUALIZADO EXISTOSAMENTE",
            {
              timeOut: 8000,
              closeButton: true,
              enableHtml: true,
              toastClass: "alert alert-success alert-with-icon",
              positionClass: "toast-top-right",
            }
          );
          this.getPlanneds();
          this.getHomeVisits();
          this.homeVisitForm = this.createHomeVisit();
        },

        (error: HttpErrorResponse) => {
          // Si sucede un error
          console.error(error);
        }
      );
  }

  openDialog(data: Planned): void {
    const dialogRef = this.dialog.open(VisitsAttentionComponent, {
      width: "80vh",
      data: { urlMap: data.cliente.mapa },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log('The dialog was closed');
      //this.animal = result;
    });
  }
}
