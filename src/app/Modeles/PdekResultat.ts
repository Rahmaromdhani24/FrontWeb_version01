import { PlanActionDTO } from "./PlanActionDTO";

export interface PdekResultat {
    id: number;
    typeOperation: string;
    typePistolet: string;
    numeroPistolet : number ; 
    categorie: string;
    plant: string;
    segment: number;
    totalPages: number;
    usersRempliePDEK: string[];
    //status: string;
    planAction: PlanActionDTO | null;
  }
  