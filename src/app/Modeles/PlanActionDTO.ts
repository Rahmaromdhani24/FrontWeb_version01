import { PdekResultat } from "./PdekResultat";
import { User } from "./User";

export interface PlanActionDTO {
    id: number;
    dateCreation: string;
    heureCreation: string;
    type_operation: string; 
    pagePdekId: number;
    pdekId : number ; 
    pistolet : PdekResultat ; // contient les informations du pistolet
    matriculeUser : number ; 
    userAddPlanAction : User ; 
    plant : string ; 
    segment  : number ; 
    machine : string ; 
    poste : string ; 
    sectionFil : string 
  }