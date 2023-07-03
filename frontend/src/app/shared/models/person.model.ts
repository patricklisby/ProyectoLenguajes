export class PersonModel {
    idPerson?: number;
    idRol : string;
    rolDescription? : string;
    namePerson : string;
    firstLastNamePerson : string;
    secondLastNamePerson : string;
    personPhone : string;
    personEmail : string;
    personAddress : string;

    constructor(r?: PersonModel) {
      if (this.idPerson !== undefined) {
        this.idPerson = r?.idPerson;
      }
      this.idRol = r !== undefined ? r.idRol : '';
      this.rolDescription = r !== undefined ? r?.rolDescription : '';
      this.namePerson = r !== undefined ? r.namePerson : '';
      this.firstLastNamePerson = r !== undefined ? r.firstLastNamePerson : '';
      this.secondLastNamePerson = r !== undefined ? r.secondLastNamePerson : '';
      this.personPhone = r !== undefined ? r.personPhone : '';
      this.personEmail = r !== undefined ? r.personEmail : '';
      this.personAddress= r !== undefined ? r.personAddress : '';
    }
  }
