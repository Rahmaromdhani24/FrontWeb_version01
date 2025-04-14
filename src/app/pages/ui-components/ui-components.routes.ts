import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { AppFormsComponent } from './forms/forms.component';
import { AppTablesComponent } from './tables/tables.component';
import { AddPistoletMecaniqueComponent } from './add-pistolet-mecanique/add-pistolet-mecanique.component';
import { AddPistoletPneumatiqueComponent } from './add-pistolet-pneumatique/add-pistolet-pneumatique.component';
import { ChartAddPistoletJauneComponent } from './chart-add-pistolet-jaune/chart-add-pistolet-jaune.component';
import { ChartAddPistoletVertComponent } from './chart-add-pistolet-vert/chart-add-pistolet-vert.component';
import { ChartAddPistoletRougeComponent } from './chart-add-pistolet-rouge/chart-add-pistolet-rouge.component';
import { ChartAddPistoletBleuComponent } from './chart-add-pistolet-bleu/chart-add-pistolet-bleu.component';
import { ListePDEKComponent } from './liste-pdek/liste-pdek.component';
import { ListPlanActionComponent } from './list-plan-action/list-plan-action.component';
import { AddPlanActionComponent } from './add-plan-action/add-plan-action.component';
import { ListePdekPistoletComponent } from './liste-pdek-pistolet/liste-pdek-pistolet.component';
import { PdekPistoletJauneComponent } from '../../Agent qualité/Pdeks Pistolet/pdek-pistolet-jaune/pdek-pistolet-jaune.component';
import { PdekPistoletRougeComponent } from '../../Agent qualité/Pdeks Pistolet/pdek-pistolet-rouge/pdek-pistolet-rouge.component';
import { PdekPistoletBleuComponent } from '../../Agent qualité/Pdeks Pistolet/pdek-pistolet-bleu/pdek-pistolet-bleu.component';
import { PdekPistoletVertComponent } from '../../Agent qualité/Pdeks Pistolet/pdek-pistolet-vert/pdek-pistolet-vert.component';

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
      }/*
      {
        path: 'menu',
        component: AppMenuComponent,
      },
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
