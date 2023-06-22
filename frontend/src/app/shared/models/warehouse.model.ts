export class WarehouseModel {
  idWareHouse?: number;
  idProduct: string;
  cantItem: number;

  constructor(r?: WarehouseModel) {
    if (this.idWareHouse !== undefined) {
      this.idWareHouse = r?.idWareHouse;
    }
    this.idProduct = r !== undefined ? r.idProduct : '';
    this.cantItem = r !== undefined ? r.cantItem : 0;
  }
}
