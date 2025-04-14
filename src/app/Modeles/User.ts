import { Role } from "./Role";

export class User {
    matricule: number;
    nom: string;
    prenom: string;
    poste: string;
    segment: string;
    machine: string;
    email: string;
    plant: string;
    role: Role;
  
    constructor(
      matricule: number,
      nom: string,
      prenom: string,
      poste: string,
      segment: string,
      machine: string,
      email: string,
      plant: string,
      role: Role
    ) {
      this.matricule = matricule;
      this.nom = nom;
      this.prenom = prenom;
      this.poste = poste;
      this.segment = segment;
      this.machine = machine;
      this.email = email;
      this.plant = plant;
      this.role = role;
    }
  }
  
