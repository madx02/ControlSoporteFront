import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/service/api.service';
import { RespRoles } from '../../core/models/RespRoles';
import { HttpErrorResponse } from '@angular/common/http';


declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'design_app', class: '' },
    { path: '/routes', title: 'Rutas',  icon:'location_pin', class: '' },
    { path: '/customers', title: 'Clientes',  icon:'users_single-02', class: '' },
    { path: '/planned', title: 'Planificador',  icon:'ui-1_calendar-60', class: '' },
    { path: '/homeVisits', title: 'Visitas',  icon:'shopping_shop', class: '' },
    { path: '/visits-attention', title: 'Visita técnica',  icon:'ui-2_settings-90', class: '' },
    { path: '/user-profile', title: 'User Profile',  icon:'users_single-02', class: '' },

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  userName: string;
  //
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getRolRuta();
    //this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.userName = localStorage.getItem('userName');
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };

  private getRolRuta() {
    const session = localStorage.getItem("x-token");
    var base64Url = session.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    const userID = JSON.parse(window.atob(base64));
    this.apiService.get(`usuariosRoles/${userID.uid}` ).subscribe(
      (resp: RespRoles) => {
        let rutas = resp.respuest.rolesPermiso.map(r => ({class: r.permiso.clas, ...r.permiso}));

        this.menuItems = rutas.filter(menuItem => menuItem);
      },

      (error: HttpErrorResponse) => {
        // Si sucede un error
        console.error(error);
      }
    );
  }


}
