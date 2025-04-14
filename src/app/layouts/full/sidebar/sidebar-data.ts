import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard',
    bgcolor: 'primary'
  },
  {
    navCap: 'Utilisateurs',
    roles: ['ADMIN',]
  },
  {
    displayName: 'Opérateurs',
    iconName: 'users-group',
    bgcolor: 'secondary',
    roles: ['ADMIN',], 
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
  },
  {
    displayName: 'Chefs des lignes',
    iconName: 'users',
    bgcolor: 'warning',
     roles: ['ADMIN',],
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
  },
  
  {
    displayName: 'Agents des Qualité',
    iconName: 'users',
    bgcolor: 'success',
    roles: ['ADMIN',],
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
  },
  {
    displayName: 'Techniciens',
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
  },
  
  {
    navCap: 'PDEK',
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
    route: '/ui-components/listePdek',
    bgcolor: 'error',
    roles: ['ADMIN', 'AGENT_QUALITE'], 	

  },
  {
    displayName: 'Liste PDEKs',
    iconName: 'list-details',
    route: '/ui-components/listePdekPistolet',
    bgcolor: 'error',
    roles: ['ADMIN', 'AGENT_QUALITE_PISTOLET'], 	

  },

  
  {
    navCap: 'Plan d actions',
  },
  {
    displayName: 'Ajout Plan d action',
    iconName: 'file-text',
    route: '/ui-components/addPlanAction',
    bgcolor: 'success',
    roles: ['ADMIN', 'AGENT_QUALITE'], 	

  }, 
  {
    displayName: 'Liste Plan d actions',
    iconName: 'file-text',
    route: '/ui-components/listePlanAction',
    bgcolor: 'error',
    roles: ['ADMIN', 'AGENT_QUALITE'], 	

  }, 
  
  {
    navCap: 'Statistiques',
  },
  {
    displayName: 'Utilisateurs',
    iconName: 'chart-line',
    route: 'https://spike-angular-pro-main.netlify.app/charts/line',
    bgcolor: 'error',
    external: true,
    //chip: true,
    chipClass: 'bg-primary text-white',
  //  chipContent: 'PRO',
    roles: ['ADMIN', 'AGENT_QUALITE'], 

  },
  {
    displayName: 'Plant',
    iconName: 'chart-arcs',
    route: 'https://spike-angular-pro-main.netlify.app/charts/gredient',
    bgcolor: 'primary',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
    roles: ['ADMIN'], 

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
    roles: ['ADMIN'], 

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
    roles: ['ADMIN'], 

  },
  {
    navCap: 'Archives',
  },
  {
    displayName: 'Archives',
    iconName: 'archive',
    route: '/ui-components/badge',
    bgcolor: 'warning',
    roles: ['ADMIN', 'AGENT_QUALITE'], 

  },

  {
    navCap: 'Historiques',
    roles: ['ADMIN','AGENT_QUALITE'], 
  },
  {
    displayName: 'Historiques utilisateurs',
    iconName: 'history',
    route: '/ui-components/badge',
    bgcolor: 'warning',
    roles: ['ADMIN','AGENT_QUALITE'], 

  },
];
