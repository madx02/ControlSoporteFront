export interface RespUsers {
  codigo:         number;
  msg:            string;
  totalRegistros: number;
  usuarios:       Usuario[];
}

export interface Usuario {
  correo:         string;
  nombres:        string;
  apellidos:      string;
  puesto:         string;
  telefono1:      string;
  telefono2:      string;
  direccion:      string;
  estado:         boolean;
  creado_el:      Date;
  creado_por:     string;
  modificado_el:  Date;
  modificado_por: string;
  uid:            string;
  encargado?:     string;
}
