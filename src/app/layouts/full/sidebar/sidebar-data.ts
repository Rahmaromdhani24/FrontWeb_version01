import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
     roles: ['AGENT_QUALITE_PISTOLET','AGENT_QUALITE'  ,'TECHNICIEN' , 'CHEF_DE_LIGNE' ]
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard',
    bgcolor: 'primary' ,
     roles: ['AGENT_QUALITE_PISTOLET','AGENT_QUALITE'  ,'TECHNICIEN' , 'CHEF_DE_LIGNE' ]
  },
  {
    navCap: 'Utilisateurs',
    roles: ['SUPER_ADMIN']
  },
    {
    displayName: 'Liste Administrateurs',
    iconName: 'users-group',
    route: '/ui-components/listeAdminstrateursParSuperAdmin',
    bgcolor: 'error',
    roles: ['SUPER_ADMIN'], 	

  },
 
  {
    displayName: 'Ajout Adminstrateur',
    iconName: 'user-plus',
    route :'/ui-components/addAdminParSuperAdmin' , 
    bgcolor: 'secondary',
    roles: ['SUPER_ADMIN'] , 
 },

  {
    navCap: 'Utilisateurs',
    roles: ['ADMIN']
  },

    {
    displayName: 'Liste utilisateurs',
    iconName: 'users-group',
    route: '/ui-components/users',
    bgcolor: 'success',
    roles: ['ADMIN'], 	

  },
    {
    displayName: 'Ajout utilisateur',
    iconName: 'user-plus',
    route :'/ui-components/addUtilisateur' , 
    bgcolor: 'secondary',
    roles: ['ADMIN'] , 
 },
  /*{
    displayName: 'Ajout utilisateur',
    iconName: 'users',
    bgcolor: 'error',
    roles: ['ADMIN',] ,
    //chip: true,
    //chipClass: 'bg-primary text-white',
    //chipContent: 'PRO',
    //route: 'apps/blog',
    children: [
      {
        displayName: 'Post',
        iconName: 'point',
        bgcolor: 'tranparent',
        external: true,
        chip: true,
        chipClass: 'bg-primary text-white',
        chipContent: 'PRO',
        route: 'https://spike-angular-pro-main.netlify.app/apps/blog/post',
      },
      {
        displayName: 'Detail',
        iconName: 'point',
        bgcolor: 'tranparent',
        external: true,
        chip: true,
        chipClass: 'bg-primary text-white',
        chipContent: 'PRO',
        route:
          'https://spike-angular-pro-main.netlify.app/apps/blog/detail/Early Black Friday Amazon deals: cheap TVs, headphones, laptops',
      },
    ],
  },*/


    {
    navCap: 'Opérateurs',
    roles: ['ADMIN']
  },
   {
    displayName: 'Liste opérateurs',
    iconName: 'users-group',
    route: '/ui-components/listOperateurs',
    bgcolor: 'error',
    roles: ['ADMIN'], 	

  },
 
  {
    displayName: 'Ajout opérateur',
    iconName: 'user-plus',
    route :'/ui-components/addOperateur' , 
    bgcolor: 'secondary',
    roles: ['ADMIN'] , 
 },
  {
    navCap: 'Projet',
    roles: ['ADMIN']
  },
   {
    displayName: 'Liste projets',
    iconName: 'list-check',
    route: '/ui-components/listProjets',
    bgcolor: 'error',
    roles: ['ADMIN'], 	

  },
 
  {
    displayName: 'Ajout projet',
    iconName: 'user-plus',
    route :'/ui-components/addProjet' , 
    bgcolor: 'secondary',
    roles: ['ADMIN'] , 
 },
  {
    navCap: 'Outils Travail',
    roles: ['ADMIN']
  },
   {
    displayName: 'Ajout outils contacts',
    iconName: 'users-group',
    route: '/ui-components/addOutilContact',
    bgcolor: 'success',
    roles: ['ADMIN'], 	

  },
 
  {
    navCap: 'PDEK',
     roles: ['AGENT_QUALITE_PISTOLET','AGENT_QUALITE'  ,'TECHNICIEN' ] , 
  },
  
  /*{
    displayName: 'PDEKs',
    iconName: 'file-text',
    route: '/ui-components/menu',
    bgcolor: 'warning',
    roles: ['ADMIN', 'AGENT_QUALITE'], 	

  }, */
  {
    displayName: 'Ajout PDEK',
    iconName: 'file-text',
    bgcolor: 'success',
    roles: ['AGENT_QUALITE_PISTOLET',] , 
    children: [
      {
        displayName: 'Pistolet mécanique ',
        iconName: 'point',
        bgcolor: 'tranparent',
        external: false,
        chipClass: 'bg-primary text-white',
        route: '/ui-components/addPistoletMecanique',
       /* children: [
          {
            displayName: 'Pistolet vert',
            bgcolor: 'success',
            external: false,
            chipClass: 'bg-success text-white',
            route: '/ui-components/forms',
          },
          {
            displayName: 'Pistolet bleu',
            bgcolor: 'transparent',
            external: false,
            chipClass: 'bg-primary text-white',
            route: '/ui-components/addPistoletBleuMecanique',
          },
          {
            displayName: 'Pistolet rouge',
            bgcolor: 'error',
            external: false,
            chipClass: 'bg-danger text-white',
            route: '/pistolet-rouge',
          },
          {
            displayName: 'Pistolet jaune',
            bgcolor: 'warning',
            external: false,
            chipClass: 'bg-warning text-white',
            route: '/pistolet-jaune',
          },
        ],*/
      },
      {
        displayName: 'Pistolet pneumatique ',
        iconName: 'point',
        bgcolor: 'tranparent',
        external: false,
        chipClass: 'bg-primary text-white',
        route:  '/ui-components/addPistoletPneumatique',  
       /* children: [
          {
            displayName: 'Pistolet vert',
            bgcolor: 'success',
            external: false,
            chipClass: 'bg-success text-white',
            route: '/pistolet-vert',
          },
          {
            displayName: 'Pistolet bleu',
            bgcolor: 'transparent',
            external: false,
            chipClass: 'bg-primary text-white',
            route: '/pistolet-bleu',
          },
          {
            displayName: 'Pistolet rouge',
            bgcolor: 'error',
            external: false,
            chipClass: 'bg-danger text-white',
            route: '/pistolet-rouge',
          },
          {
            displayName: 'Pistolet jaune',
            bgcolor: 'warning',
            external: false,
            chipClass: 'bg-warning text-white',
            route: '/pistolet-jaune',
          },
        ], */ },
    ],
  },
  {
    displayName: 'Liste PDEKs',
    iconName: 'list-details',
    route: '/ui-components/listePdekTousProcess',
    bgcolor: 'error',
    roles: [ 'AGENT_QUALITE' , 'CHEF_DE_LIGNE'], 	

  },
  {
    displayName: 'Liste PDEKs',
    iconName: 'list-details',
    route: '/ui-components/listePdekPistolet',
    bgcolor: 'error',
    roles: [ 'AGENT_QUALITE_PISTOLET' , 'TECHNICIEN'], 	

  },

  
  {
    navCap: 'Plan d actions',
     roles: ['AGENT_QUALITE_PISTOLET','AGENT_QUALITE'  ,'TECHNICIEN' ] , 
  },
 /*{
    displayName: 'Ajout Plan d action',
    iconName: 'file-text',
    route: '/ui-components/addPlanAction',
    bgcolor: 'success',
    roles: ['TECHNICIEN'], 	

  }, */
  {
    displayName: 'Liste Plan d actions',
    iconName: 'file-text',
    route: '/ui-components/listePlanAction',
    bgcolor: 'primary',
    roles: ['AGENT_QUALITE_PISTOLET' ,'TECHNICIEN' ,], 	

  }, 
  {
    displayName: 'Liste Plan d actions',
    iconName: 'file-text',
    route: '/ui-components/listePlanActionsTousProcess',
    bgcolor: 'primary',
    roles: ['AGENT_QUALITE' ,'CHEF_DE_LIGNE' ], 	

  }, 
  
  {
    navCap: 'Statistiques',
    roles: ['AGENT_QUALITE'   ,'CHEF_DE_LIGNE' ], 
  },
  {
    displayName: 'Process',
    iconName: 'chart-line',
    route: '/ui-components/statAgentQualite',
    bgcolor: 'error',
    external: false,
    chipClass: 'bg-primary text-white',
    roles: ['AGENT_QUALITE' ], 

  },
  {
    displayName: 'Process',
    iconName: 'chart-line',
    route: '/ui-components/statChefLigne',
    bgcolor: 'error',
    external: false,
    chipClass: 'bg-primary text-white',
    roles: [ 'CHEF_DE_LIGNE', ], 

  },
  /*{
    displayName: 'Utilisateurs',
    iconName: 'chart-line',
    route: 'https://spike-angular-pro-main.netlify.app/charts/line',
    bgcolor: 'error',
    external: true,
    //chip: true,
    chipClass: 'bg-primary text-white',
  //  chipContent: 'PRO',
    //roles: ['ADMIN',"Super Administrateur" ], 

  },*/
  {
    displayName: 'Plant',
    iconName: 'chart-arcs',
    route: 'https://spike-angular-pro-main.netlify.app/charts/gredient',
    bgcolor: 'primary',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
    roles: [], 

  },
  {
    displayName: 'Segmets',
    iconName: 'chart-area',
    route: 'https://spike-angular-pro-main.netlify.app/charts/area',
    bgcolor: 'secondary',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
    roles: [], 

  },
  {
    displayName: 'Machines',
    iconName: 'chart-candle',
    route: 'https://spike-angular-pro-main.netlify.app/charts/candlestick',
    bgcolor: 'warning',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
    roles: [], 

  },
  {
    navCap: 'Archives',
     roles: [], 
  },
  {
    displayName: 'Archives',
    iconName: 'archive',
    route: '/ui-components/badge',
    bgcolor: 'warning',
    roles: [ ], 

  },

  {
    navCap: 'Historiques',
    roles: [], 
  },
  {
    displayName: 'Historiques utilisateurs',
    iconName: 'history',
    route: '/ui-components/badge',
    bgcolor: 'warning',
    roles: [], 

  },
];
