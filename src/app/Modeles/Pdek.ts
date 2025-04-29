import { User } from "./User";

export interface PDEK {
    id: number;
    
    totalPages: number;
    sectionFil: string;
    nombreEchantillons: string;
    frequenceControle: number;
    segment: number;
    numMachine: string;
    numPoste : string ; 
    dateCreation: string;
    typeOperation: string;
    plant: string;
    numeroOutils: string;
    numeroContacts: string;
    LGD: string;
    tolerance: number;
    posGradant: string;  
    usersRempliePDEK?: User[];
    projets?: string;
    pages?: string;
    controlesQualite?: string;
    // Propriété ajoutée dynamiquement
    planAction?: any;
  }