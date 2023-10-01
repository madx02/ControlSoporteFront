import { Component, OnInit } from "@angular/core";
import { ApiService } from "../core/service/api.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { RespRuta, Ruta } from "../core/models/RespRuta";
import { HttpErrorResponse } from "@angular/common/http";
import Swal from "sweetalert2";


@Component({
  selector: "app-routes",
  templateUrl: "./routes.component.html",
  styleUrls: ["./routes.component.scss"],
})
export class RoutesComponent implements OnInit {
  routesList: Ruta[];
  routeForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.routeForm = this.createFomRoute();
  }

  ngOnInit(): void {
    this.getRoutes();
  }

  private getRoutes() {
    this.apiService.get("rutas").subscribe(
      (resp: RespRuta) => {
        this.routesList = resp.datos;
      },

      (error: HttpErrorResponse) => {
        // Si sucede un error
        console.error(error);
      }
    );
  }

  createFomRoute(data?: Ruta) {
    return this.fb.group({
      uid: data?.uid || "",
      nombre: [data?.nombre || "", [Validators.required]],
      descripcion: [data?.descripcion || "", [Validators.required]],
      region: [data?.region || "", [Validators.required]],
    });
  }

  formValidation() {
    if (this.routeForm.invalid) {
      this.routeForm.markAllAsTouched();
      return;
    }
    this.routeForm.controls['uid'].value?this.updateRoute(): this.saveRoute();
  }

  resetForm() {
    this.routeForm = this.createFomRoute();
  }

  editRouteForm(data: Ruta) {
    this.routeForm = this.createFomRoute(data);
  }

  deleteCustomer(data: Ruta) {
    Swal.fire({
      title: "¿Está seguro de que quiere eliminar este registro?",
      text: "Puede que esta acción no se pueda deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.changeStateRoute(data);
      }
    });
  }

  private saveRoute() {
    const { uid, ...rest } = this.routeForm.getRawValue();
    this.apiService
      .post("rutas", {
        ...rest,
      })
      .subscribe(
        (resp: any) => {
          Swal.fire("EXITO", "Ruta creada satisfactoriamente", "success");
          this.getRoutes();
        },

        (error: HttpErrorResponse) => {
          // Si sucede un error
          console.error(error);
        }
      );
  }

  private updateRoute() {
    const { uid, ...rest } = this.routeForm.getRawValue();
    this.apiService
      .post(`rutas/${uid}`, {
        ...rest,
      })
      .subscribe(
        (resp: any) => {
          Swal.fire("EXITO", "Ruta actualizada satisfactoriamente", "success");
          this.getRoutes();
        },

        (error: HttpErrorResponse) => {
          // Si sucede un error
          console.error(error);
        }
      );
  }

  private changeStateRoute(data: Ruta){
    data.estado = false;
    this.apiService.put(`rutas/${data.uid}`, { data }).subscribe(
      (resp: any) => {
        this.toastr.success(
          "La ruta ha sido removida satisfactoriamente",
          "",
          {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-top-right",
          }
        );
        this.getRoutes();
      },

      (error: HttpErrorResponse) => {
        // Si sucede un error
        console.error(error);
      }
    );
  }
}
