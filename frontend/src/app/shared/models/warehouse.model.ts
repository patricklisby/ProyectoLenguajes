export class WarehouseModel {
  idWareHouse?: number;
  idProduct: string;
  productDescription: string;
  cantItem: string;

  constructor(r?: WarehouseModel) {
    if (this.idWareHouse !== undefined) {
      this.idWareHouse = r?.idWareHouse;
    }
    this.idProduct = r !== undefined ? r.idProduct : '';
    this.productDescription = r !== undefined ? r.productDescription : '';
    this.cantItem = r !== undefined ? r.cantItem : '';
  }
}
