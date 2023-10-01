import { Component, OnInit } from "@angular/core";
import mapboxgl from "mapbox-gl";
import { environment } from "../../environments/environment";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { ApiService } from "../core/service/api.service";
import { Customer, RespCustomers } from "../core/models/IRespCustomers";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RespRuta, Ruta } from "../core/models/RespRuta";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
})
export class CustomersComponent implements OnInit {
  map: mapboxgl.Map;
  style = "mapbox://styles/mapbox/streets-v11";
  lat = 14.642441;
  lng = -90.513072;
  geocoder: any;
  address: string;
  long: any;
  latitude: any;
  coordinates: number[];
  customerList: Customer[];

  routesList: Ruta[];

  customerForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.customerForm = this.createFormCustomer();
    this.customerForm.controls["idcliente"].disable();
  }

  ngOnInit(): void {
    this.createMap();
    this.getClients();
    this.getRoutes();
  }

  createMap() {
    mapboxgl.accessToken = environment.mapboxAccessToken;
    this.map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v12", // style URL
      center: [this.lng, this.lat], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.geocoding();
  }

  geocoding() {
    this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });
    document
      .getElementById("searchAddrress")!
      .appendChild(this.geocoder.onAdd(this.map));
    this.getAddress();
  }

  getAddress() {
    this.geocoder.on("result", (e) => {
      this.address = e.result.place_name;
      this.long = e.result.geometry.coordinates[0];
      this.latitude = e.result.geometry.coordinates[1];
      this.coordinates = e.result.geometry.coordinates;
    });
  }

  private getClients() {
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

  private createFormCustomer(data?: Customer) {
    return this.fb.group({
      _id: data?.uid || "",
      idcliente: data?.idcliente || "",
      nombreComercial: [data?.nombreComercial || "", [Validators.required]],
      razonSocial: [data?.razonSocial || "", [Validators.required]],
      nit: [data?.nit || "", [Validators.required]],
      telefono1: [data?.telefono1 || "", [Validators.required]],
      telefono2: data?.telefono2 || "",
      correo1: [data?.correo1 || "", [Validators.required]],
      direccion: [data?.direccion || "", [Validators.required]],
      ruta: [data?.ruta || "", [Validators.required]],
    });
  }

  editCustomerForm(data: Customer) {
    this.customerForm = this.createFormCustomer(data);
    this.lng = data.location.coordinates[0];
    this.lat = data.location.coordinates[1];
    this.coordinates = data.location.coordinates;

  }

  resetForm() {
    this.customerForm = this.createFormCustomer();
  }

  private changeStateCustomer(customer: Customer) {
    customer.estado = false;
    this.apiService.put(`clientes/${customer.uid}`, { customer }).subscribe(
      (resp: any) => {
        this.toastr.success(
          "El cliente ha sido removido satisfactoriamente",
          "",
          {
            timeOut: 8000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-top-right",
          }
        );
        this.getClients();
      },

      (error: HttpErrorResponse) => {
        // Si sucede un error
        console.error(error);
      }
    );
  }

  private updateCustomer() {
    const { _id, ...restoDelFormulario } =
      this.customerForm.getRawValue();
    this.apiService
      .put(`clientes/${_id}`, {
        ...restoDelFormulario,
        location: { type: "Point", coordinates: this.coordinates },
      })
      .subscribe(
        (resp: any) => {
          Swal.fire("EXITO", "Cliente actualizado satisfactoriamente", "success");
          this.getClients();
        },

        (error: HttpErrorResponse) => {
          // Si sucede un error
          console.error(error);
        }
      );
  }

  deleteCustomer(customer: Customer) {
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
        this.changeStateCustomer(customer);
      }
    });
  }

  private saveCustomer() {
    const { _id, idcliente, ...restoDelFormulario } =
      this.customerForm.getRawValue();
    this.apiService
      .post("clientes", {
        ...restoDelFormulario,
        location: { type: "Point", coordinates: this.coordinates },
      })
      .subscribe(
        (resp: any) => {
          Swal.fire("EXITO", "Cliente creado satisfactoriamente", "success");
          this.editCustomerForm(resp.cliente);
          this.getClients();
        },

        (error: HttpErrorResponse) => {
          // Si sucede un error
          console.error(error);
        }
      );
  }

  formValidation() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    if (!this.address && !this.customerForm.controls['idcliente'].value) {
      Swal.fire(
        "ERROR",
        "Debe ingresar la ubicación o dirección más cercana,",
        "error"
      );
      return;
    }

    this.customerForm.controls['idcliente'].value ? this.updateCustomer(): this.saveCustomer();
  }
}
