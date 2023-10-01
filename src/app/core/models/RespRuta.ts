export interface RespRuta {
  codigo:         number;
  msg:            string;
  totalRegistros: number;
  datos:          Ruta[];
}

export interface Ruta {
  nombre:         string;
  descripcion:    string;
  region:         string;
  estado:         boolean;
  creado_el:      Date;
  creado_por:     string;
  modificado_el:  Date;
  modificado_por: string;
  uid:            string;
}
