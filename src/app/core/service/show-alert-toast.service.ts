import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ShowAlertToastService {

  constructor(private toastr: ToastrService) { }

  successAlert(mensaje: string) {
    this.toastr.success("SATISFACTORIO",mensaje, {
      timeOut: 8000,
      closeButton: true,
      enableHtml: true,
      toastClass: 'alert alert-success alert-with-icon',
      positionClass: 'toast-top-right',
    });
  }

  errorAlert(mensaje: string) {
    this.toastr.error("ERROR",mensaje, {
      timeOut: 8000,
      closeButton: true,
      enableHtml: true,
      toastClass: 'alert alert-error alert-with-icon',
      positionClass: 'toast-top-center',
    });
  }





}
