export class CustomerModel {
    idCustomer?: number;
    nameCustomer : string;
    fistLastNameCustomer : string;
    secondFirstNameCustomer : string;
    customerEmail : string;
    customerPhone : string;
    customerAddress : string;
    admissionDate? : Date;
  
    constructor(r?: CustomerModel) {
      if (this.idCustomer !== undefined) {
        this.idCustomer = r?.idCustomer;
      }
      this.nameCustomer = r !== undefined ? r.nameCustomer : '';
      this.fistLastNameCustomer = r !== undefined ? r.fistLastNameCustomer : '';
      this.secondFirstNameCustomer = r !== undefined ? r.secondFirstNameCustomer : '';
      this.customerEmail = r !== undefined ? r.customerEmail : '';
      this.customerPhone = r !== undefined ? r.customerPhone : '';
      this.customerAddress = r !== undefined ? r.customerAddress : '';

      if(this.admissionDate !== undefined){
        this.admissionDate = r?.admissionDate;
    }
    }
  }
  