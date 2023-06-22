export class CustomerModel {
    idCustomer?: number;
    nameCustomer : string;
    firstLastNameCustomer : string;
    secondLastNameCustomer : string;
    customerEmail : string;
    customerPhone : string;
    customerAddress : string;
    admissionDate? : Date;
  
    constructor(r?: CustomerModel) {
      if (this.idCustomer !== undefined) {
        this.idCustomer = r?.idCustomer;
      }
      this.nameCustomer = r !== undefined ? r.nameCustomer : '';
      this.firstLastNameCustomer = r !== undefined ? r.firstLastNameCustomer : '';
      this.secondLastNameCustomer = r !== undefined ? r.secondLastNameCustomer : '';
      this.customerEmail = r !== undefined ? r.customerEmail : '';
      this.customerPhone = r !== undefined ? r.customerPhone : '';
      this.customerAddress = r !== undefined ? r.customerAddress : '';

      if(this.admissionDate !== undefined){
        this.admissionDate = r?.admissionDate;
    }
    }
  }
  