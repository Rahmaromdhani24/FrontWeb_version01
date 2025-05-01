import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppErreursProcessComponent } from 'src/app/components/erreurs-process/erreurs-process.component';
import { AppUpcomingSchedulesComponent } from 'src/app/components/upcoming-schedules/upcoming-schedules.component';
import { AppTopEmployeesComponent } from 'src/app/components/top-employees/top-employees.component';
import { AppBlogComponent } from 'src/app/components/apps-blog/apps-blog.component';
import { AppEffectifOperateursComponent } from 'src/app/components/effectif-operateurs/effectif-operateurs.component';
import { AppPdekProcessComponent } from 'src/app/components/pdek-process/pdek-process.component';



@Component({
  selector: 'app-starter',
  imports: [
    MaterialModule,
    AppPdekProcessComponent , 
    AppEffectifOperateursComponent,
    AppErreursProcessComponent,
    AppUpcomingSchedulesComponent,
    AppTopEmployeesComponent,
    AppBlogComponent
  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent { }