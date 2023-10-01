export interface RespRoles {
  codigo:   number;
  msg:      string;
  respuest: Respuest;
}

export interface Respuest {
  usuario:      Usuario;
  role:         Role;
  rolesPermiso: RolesPermiso[];
}

export interface Role {
  nombre:      string;
  descripcion: string;
  uid:         string;
}

export interface RolesPermiso {
  role:    string;
  permiso: Permiso;
  uid:     string;
}

export interface Permiso {
  _id:         string;
  modulo:      string;
  tipoPermiso: string;
  title:       string;
  clas:        string;
  icon:        string;
  path:        string;
}

export interface Usuario {
  correo:    string;
  nombres:   string;
  apellidos: string;
  puesto:    string;
  uid:       string;
}
