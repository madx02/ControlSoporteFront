export interface RespCustomers {
    codigo:         number;
    msg:            string;
    totalRegistros: number;
    datos:          Customer[];
}

export interface Customer {
    location:        Location;
    idcliente:       string;
    nombreComercial: string;
    razonSocial:     string;
    nit:             string;
    telefono1:       string;
    telefono2:       string;
    correo1:         string;
    correo2:         string;
    direccion:       string;
    ruta:            string;
    mapa:            string;
    estado:          boolean;
    creado_el:       Date;
    creado_por:      string;
    modificado_el:   Date;
    modificado_por:  string;
    uid:             string;
}

export interface Location {
    type:        string;
    coordinates: number[];
}
