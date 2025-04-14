export interface Notification {
    processName: string;  
    message: string;     
    pdekStatus: string;   
    statusColor: string;
    buttons: string[];    // (ex: "Voir PDEK", "Valider PDEK")
    isButtonDisabled?: boolean;  // Si le bouton de validation est désactivé (par défaut false)
  }
  