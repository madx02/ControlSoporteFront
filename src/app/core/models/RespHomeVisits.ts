import { Planned } from "./RespPlanned";


export interface RespHomeVisits {
  codigo:         number;
  msg:            string;
  visitas:          HomeVisit[];
}

export interface HomeVisit {
  idVisita:       string;
  idPlanned:      string;
  planned:        string;
  fecha_inicio:   Date;
  fecha_fin:      Date;
  descripcion:    string;
  observacion1:   string;
  observacion2:   string;
  situacion:      string;
  estado:         boolean;
  creado_el:      Date;
  creado_por:     string;
  modificado_el:  Date;
  modificado_por: string;
  uid:            string;
}

export interface VisitPlanned {
  visit?: HomeVisit,
  planned: Planned
}
