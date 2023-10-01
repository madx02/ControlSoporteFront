import { Component, OnInit } from "@angular/core";
import * as Chartist from "chartist";
import { ApiService } from "../core/service/api.service";
import { RespHomeVisits } from "../core/models/RespHomeVisits";
import { HttpErrorResponse } from "@angular/common/http";
import { RespPlanned } from "../core/models/RespPlanned";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  public chartColor;

  //para la grafica de barras
  public barChartOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  public barChartLabels = ["Activas", "Finalizadas"];
  public barChartType = "bar";
  public barChartLegend = true;
  // public barChartData = [
  //   { data: [25, 35, 20, 10, 15], label: 'Activas' },
  //   { data: [15, 25, 30, 20, 10], label: 'Finalizadas' }
  // ];
  barChartData: any[] = [];
  // events
  ///planificaciones
  public barChartLabelsPl: any[] = [];
  barChartDataPl: any[] = [];

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.chartColor = "#FFFFFF";
    this.getRolRuta();
    this.getPlanneds();
  }

  private getRolRuta() {
    const session = localStorage.getItem("x-token");
    var base64Url = session.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    const userID = JSON.parse(window.atob(base64));
    this.apiService.get(`visitas/${userID.uid}`).subscribe(
      (resp: RespHomeVisits) => {
        const estadoMapping = {
          A: "Activo",
          F: "FINALIZADO",
        };

        const conteo = resp.visitas.reduce((acc, objeto) => {
          const estadoTraducido = estadoMapping[objeto.situacion];
          acc[estadoTraducido] = (acc[estadoTraducido] || 0) + 1;
          return acc;
        }, {});

        const resultado = Object.keys(conteo).map((estado) => ({
          data: [conteo[estado]],
          label: estado,
        }));
        console.log(resultado);
        this.barChartData = resultado;
      },

      (error: HttpErrorResponse) => {
        // Si sucede un error
        console.error(error);
      }
    );
  }

  private getPlanneds() {
    const session = localStorage.getItem("x-token");
    var base64Url = session.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    const userID = JSON.parse(window.atob(base64));
    this.apiService.get(`planneds/${userID.uid}`).subscribe(
      (resp: RespPlanned) => {
        const estadoMapping = {
          P: "PENDIENTE",
          A: "ACTIVA",
          F: "FINALIZADO",
        };

        const conteo = resp.datos.reduce((acc, objeto) => {
          const estadoTraducido = estadoMapping[objeto.situacion];
          acc[estadoTraducido] = (acc[estadoTraducido] || 0) + 1;
          return acc;
        }, {});

        const resultado = Object.keys(conteo).map((estado) => ({
          data: [conteo[estado]],
          label: estado,
        }));

        this.barChartLabelsPl = resultado.map((r) => r.label);

        this.barChartDataPl = resultado;
        console.log(this.barChartLabelsPl);
        console.log(this.barChartDataPl);
      },

      (error: HttpErrorResponse) => {
        // Si sucede un error
        console.error(error);
      }
    );
  }
}
