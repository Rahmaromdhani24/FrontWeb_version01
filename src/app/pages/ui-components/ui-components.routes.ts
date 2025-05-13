import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { AppFormsComponent } from './forms/forms.component';
import { AppTablesComponent } from './tables/tables.component';
import { AddPistoletMecaniqueComponent } from './Montage Pistolet/add-pistolet-mecanique/add-pistolet-mecanique.component';
import { AddPistoletPneumatiqueComponent } from './Montage Pistolet/add-pistolet-pneumatique/add-pistolet-pneumatique.component';
import { ChartAddPistoletJauneComponent } from './Montage Pistolet/chart-add-pistolet-jaune/chart-add-pistolet-jaune.component';
import { ChartAddPistoletVertComponent } from './Montage Pistolet/chart-add-pistolet-vert/chart-add-pistolet-vert.component';
import { ChartAddPistoletRougeComponent } from './Montage Pistolet/chart-add-pistolet-rouge/chart-add-pistolet-rouge.component';
import { ChartAddPistoletBleuComponent } from './Montage Pistolet/chart-add-pistolet-bleu/chart-add-pistolet-bleu.component';
import { ListPlanActionComponent } from './Montage Pistolet/list-plan-action/list-plan-action.component';
import { AddPlanActionComponent } from './Montage Pistolet/add-plan-action/add-plan-action.component';
import { ListePdekPistoletComponent } from './Montage Pistolet/liste-pdek-pistolet/liste-pdek-pistolet.component';
import { PageNotificationsPistoletComponent } from './Montage Pistolet/page-notifications-pistolet/page-notifications-pistolet.component';
import { ListsPdekTousProcessComponent } from './Components Tous process/lists-pdek-tous-process/lists-pdek-tous-process.component';
import { PageTousNotificationsAllProcessComponent } from './Components Tous process/page-tous-notifications-all-process/page-tous-notifications-all-process.component';
import { AddPlanActionSoudureComponent } from './Operation Soudure/add-plan-action-soudure/add-plan-action-soudure.component';
import { AddPlanActionTorsadageComponent } from './Operation torsadage/add-plan-action-torsadage/add-plan-action-torsadage.component';
import { ListsPlanActionsTousProcessComponent } from './Components Tous process/lists-plan-actions-tous-process/lists-plan-actions-tous-process.component';
import { AddPlanActionSertissageNormalComponent } from './Sertissage Normal/add-plan-action-sertissage-normal/add-plan-action-sertissage-normal.component';
import { AddPlanActionSertissageIDCComponent } from './Sertissage IDC/add-plan-action-sertissage-idc/add-plan-action-sertissage-idc.component';
import { ErreursParProcessComponent } from './statistiques All process sauf pistolet/erreurs-par-process/erreurs-par-process.component';
import { ErreursChefLigneComponent } from './statistiques All process sauf pistolet/erreurs-chef-ligne/erreurs-chef-ligne.component';
import { AuthGuard } from 'src/app/services/guards/auth.guard';
import { RoleGuard } from 'src/app/services/guards/role-guard';
import { ListsAdminComponent } from './Super admin/lists-admin/lists-admin.component';
import { AddAdminComponent } from './Super admin/add-admin/add-admin.component';
import { UpdateAdminComponent } from './Super admin/update-admin/update-admin.component';
import { ListUsersComponent } from './Admin/list-users/list-users.component';
import { ListOperateursComponent } from './Admin/list-operateurs/list-operateurs.component';
import { AddUserOperateurComponent } from './Admin/add-user-operateur/add-user-operateur.component';
import { AddUserComponent } from './Admin/add-user/add-user.component';
import { UpdateUtilisateurComponent } from './Admin/update-utilisateur/update-utilisateur.component';
import { UpdateOperateurComponent } from './Admin/update-operateur/update-operateur.component';
import { ListProjetsComponent } from './Projets/list-projets/list-projets.component';
import { AddProjetComponent } from './Projets/add-projet/add-projet.component';
import { UpdateProjetComponent } from './Projets/update-projet/update-projet.component';
import { AddOutilContactComponent } from './Admin/add-outil-contact/add-outil-contact.component';


export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'addPistoletMecanique',
        component: AddPistoletMecaniqueComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['AGENT_QUALITE_PISTOLET'] }
      },
     {
        path: 'addPistoletPneumatique',
        component: AddPistoletPneumatiqueComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['AGENT_QUALITE_PISTOLET'] }
      } ,
      {
        path: 'chartAddPistoletJaune',
        component: ChartAddPistoletJauneComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['AGENT_QUALITE_PISTOLET'] }
      },
      {
        path: 'chartAddPistoletVert',
        component: ChartAddPistoletVertComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['AGENT_QUALITE_PISTOLET'] }
      },
      {
        path: 'chartAddPistoletRouge',
        component: ChartAddPistoletRougeComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['AGENT_QUALITE_PISTOLET'] }
      },
      {
        path: 'chartAddPistoletBleu',
        component: ChartAddPistoletBleuComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['AGENT_QUALITE_PISTOLET'] }
      },
      {
        path: 'listePdekPistolet',
        component: ListePdekPistoletComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['AGENT_QUALITE_PISTOLET' , 'TECHNICIEN'] }
      }
      ,
      {
        path: 'listePlanAction',
        component: ListPlanActionComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['AGENT_QUALITE_PISTOLET' , 'TECHNICIEN'] }
      },
      {
        path: 'addPlanAction',
        component: AddPlanActionComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['TECHNICIEN'] }
      },
      {
        path: 'pageNotificationsPistolet',
        component: PageNotificationsPistoletComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['AGENT_QUALITE_PISTOLET' , 'TECHNICIEN'] }
      } ,
      /************************** Soudure  ****************************************/
      {
        path: 'listePdekTousProcess',
        component: ListsPdekTousProcessComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['AGENT_QUALITE' , 'CHEF_DE_LIGNE'] }
      } ,
      {
        path: 'listePlanActionsTousProcess',
        component: ListsPlanActionsTousProcessComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['AGENT_QUALITE' , 'CHEF_DE_LIGNE'] }
      } ,
      {
        path: 'pagesNotificationsAllProcess',
        component: PageTousNotificationsAllProcessComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['AGENT_QUALITE' , 'CHEF_DE_LIGNE'] }
      } ,
      {
        path: 'addPlanActionSoudure',
        component: AddPlanActionSoudureComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['CHEF_DE_LIGNE'] }
      },
      {
        path: 'addPlanActionTorsadage',
        component: AddPlanActionTorsadageComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['CHEF_DE_LIGNE'] }
      },
      {
        path: 'addPlanActionSertissageIDC',
        component: AddPlanActionSertissageIDCComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['CHEF_DE_LIGNE'] }
      },
      {
        path: 'addPlanActionSertissageNormal',
        component: AddPlanActionSertissageNormalComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['CHEF_DE_LIGNE'] }
      },
      {
        path: 'statAgentQualite',
        component: ErreursParProcessComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['AGENT_QUALITE'] }
      },
      {
        path: 'statChefLigne',
        component: ErreursChefLigneComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['CHEF_DE_LIGNE'] }
      },
       {
        path: 'listeAdminstrateursParSuperAdmin',
        component: ListsAdminComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['SUPER_ADMIN'] }
      },
        {
        path: 'addAdminParSuperAdmin',
        component: AddAdminComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['SUPER_ADMIN'] }
      },
       {
       path: 'updateProfileAdminParSuperAdmin/:matricule',
        component: UpdateAdminComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['SUPER_ADMIN'] }
      },
     {
       path: 'users',
        component: ListUsersComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] }
      },
         {
       path: 'addUtilisateur',
        component: AddUserComponent ,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] }
      },
       {
       path: 'updateUtilisateur/:matricule',
        component: UpdateUtilisateurComponent ,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] }
      },
       {
       path: 'listOperateurs',
        component: ListOperateursComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] }
      },
         {
       path: 'addOperateur',
        component: AddUserOperateurComponent ,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] }
      },
       {
       path: 'updateOperateur/:matricule',
        component: UpdateOperateurComponent ,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
       path: 'listProjets',
        component: ListProjetsComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] }
      },
         {
       path: 'addProjet',
        component: AddProjetComponent ,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] }
      },
       {
       path: 'updateProjet/:id',
        component: UpdateProjetComponent ,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] }
      },
       {
       path: 'addOutilContact',
        component: AddOutilContactComponent ,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] }
      },
    ],
  },
];
