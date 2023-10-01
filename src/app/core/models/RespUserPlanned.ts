export interface RespUserPlanned {
  codigo: number;
  msg:    string;
  datos:  UserPlanned[];
}

export interface UserPlanned {
  idPlanned:        string;
  idCliente:        string;
  cliente:          Cliente;
  usuario:          string;
  fecha_programada: Date;
  situacion:        string;
  estado:           boolean;
  creado_el:        Date;
  creado_por:       string;
  modificado_el:    Date;
  modificado_por:   string;
  uid:              string;
  descripcion?:     string;
}

export interface Cliente {
  _id:             string;
  nombreComercial: string;
  mapa:            string;
}
