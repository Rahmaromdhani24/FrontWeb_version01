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
import { ListePDEKComponent } from './liste-pdek/liste-pdek.component';
import { ListPlanActionComponent } from './Montage Pistolet/list-plan-action/list-plan-action.component';
import { AddPlanActionComponent } from './Montage Pistolet/add-plan-action/add-plan-action.component';
import { ListePdekPistoletComponent } from './Montage Pistolet/liste-pdek-pistolet/liste-pdek-pistolet.component';
import { PdekPistoletJauneComponent } from '../../Agent qualité/Pdeks Pistolet/pdek-pistolet-jaune/pdek-pistolet-jaune.component';
import { PdekPistoletRougeComponent } from '../../Agent qualité/Pdeks Pistolet/pdek-pistolet-rouge/pdek-pistolet-rouge.component';
import { PdekPistoletBleuComponent } from '../../Agent qualité/Pdeks Pistolet/pdek-pistolet-bleu/pdek-pistolet-bleu.component';
import { PdekPistoletVertComponent } from '../../Agent qualité/Pdeks Pistolet/pdek-pistolet-vert/pdek-pistolet-vert.component';
import { PageNotificationsPistoletComponent } from './Montage Pistolet/page-notifications-pistolet/page-notifications-pistolet.component';
import { ListsPdekTousProcessComponent } from './Components Tous process/lists-pdek-tous-process/lists-pdek-tous-process.component';
import { PageTousNotificationsAllProcessComponent } from './Components Tous process/page-tous-notifications-all-process/page-tous-notifications-all-process.component';
import { AddPlanActionSoudureComponent } from './Operation Soudure/add-plan-action-soudure/add-plan-action-soudure.component';
import { AddPlanActionTorsadageComponent } from './Operation torsadage/add-plan-action-torsadage/add-plan-action-torsadage.component';
import { ListsPlanActionsTousProcessComponent } from './Components Tous process/lists-plan-actions-tous-process/lists-plan-actions-tous-process.component';
import { AddPlanActionSertissageNormalComponent } from './Sertissage Normal/add-plan-action-sertissage-normal/add-plan-action-sertissage-normal.component';
import { AddPlanActionSertissageIDCComponent } from './Sertissage IDC/add-plan-action-sertissage-idc/add-plan-action-sertissage-idc.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'addPistoletMecanique',
        component: AddPistoletMecaniqueComponent,
      },
     {
        path: 'addPistoletPneumatique',
        component: AddPistoletPneumatiqueComponent,
      } ,
      {
        path: 'forms',
        component: AppFormsComponent,
      },
      {
        path: 'chartAddPistoletJaune',
        component: ChartAddPistoletJauneComponent,
      },
      {
        path: 'chartAddPistoletVert',
        component: ChartAddPistoletVertComponent,
      },
      {
        path: 'chartAddPistoletRouge',
        component: ChartAddPistoletRougeComponent,
      },
      {
        path: 'chartAddPistoletBleu',
        component: ChartAddPistoletBleuComponent,
      },
      {
        path: 'listePdek',
        component: ListePDEKComponent,
      } ,
      {
        path: 'listePdekPistolet',
        component: ListePdekPistoletComponent,
      }
      ,
      {
        path: 'listePlanAction',
        component: ListPlanActionComponent,
      },
      {
        path: 'addPlanAction',
        component: AddPlanActionComponent,
      },
      {
        path: 'pageNotificationsPistolet',
        component: PageNotificationsPistoletComponent,
      } ,
      /************************** Soudure  ****************************************/
      {
        path: 'listePdekTousProcess',
        component: ListsPdekTousProcessComponent,
      } ,
      {
        path: 'listePlanActionsTousProcess',
        component: ListsPlanActionsTousProcessComponent,
      } ,
      {
        path: 'pagesNotificationsAllProcess',
        component: PageTousNotificationsAllProcessComponent,
      } ,
      {
        path: 'addPlanActionSoudure',
        component: AddPlanActionSoudureComponent,
      },
      {
        path: 'addPlanActionTorsadage',
        component: AddPlanActionTorsadageComponent,
      },
      {
        path: 'addPlanActionSertissageIDC',
        component: AddPlanActionSertissageIDCComponent,
      },
      {
        path: 'addPlanActionSertissageNormal',
        component: AddPlanActionSertissageNormalComponent,
      },
     /*
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
      },
      {
        path: 'forms',
        component: AppFormsComponent,
      },
      {
        path: 'tables',
        component: AppTablesComponent,
      },*/
    ],
  },
];
