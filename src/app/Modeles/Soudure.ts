export interface Soudure {
    id: number;
    typeOperation : string ; 
    plant : string ; 
    segment : number ; 
    numeroMachine : string ; 
    code: string;
    sectionFil: string;
    date: string;
    heureCreation: string;
    numeroCycle: number;
    userSoudure: number;
    moyenne: number;
    etendu: number;
    ech1: number;
    ech2: number;
    ech3: number;
    ech4: number;
    ech5: number;
    pliage: string;
    distanceBC: string;
    traction: string;
    nbrKanban : number ; 
    nbrNoeud :string ;  
    grendeurLot : number ; 
    matriculeOperateur : number ;  
    matriculeAgentQualite : number ;  
    decision : number ; 
    rempliePlanAction : number ; 
    pdekId : number ;
    numPage : number ; 
    quantiteAtteint : number ; 
    zone?:string ;
  }
  