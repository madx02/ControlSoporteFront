export interface RespPlanned {
  codigo:         number;
  msg:            string;
  totalRegistros: number;
  datos:          Planned[];
}

export interface Planned {
  idPlanned:        string;
    idCliente:        string;
    cliente:          Cliente;
    usuario:          Usuario;
    fecha_programada: Date;
    situacion:        string;
    estado:           boolean;
    creado_el:        Date;
    creado_por?:      string;
    modificado_el:    Date;
    modificado_por?:  string;
    uid:              string;
    descripcion?:     string;
}
export interface Cliente {
  _id:             string;
  nombreComercial: string;
  mapa:            string;
}

export interface Usuario {
  _id:       string;
  nombres:   string;
  apellidos: string;
}
