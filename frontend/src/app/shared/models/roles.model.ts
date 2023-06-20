export class RolModel {
  idRol?: number;
  rolDescription: string;

  constructor(r?: RolModel) {
    if (this.idRol !== undefined) {
      this.idRol = r?.idRol;
    }

    this.rolDescription = r !== undefined ? r.rolDescription : '';
  }
}
