import { Component } from '@angular/core';
import { 
  LineSeriesService,
  CategoryService,
  LegendService,
  TooltipService,
  StripLineService,
  DataLabelService,
  ChartAnnotationService
} from '@syncfusion/ej2-angular-charts';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartModule } from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [
    ChartModule,
    MatCardModule,
    MatFormFieldModule
  ],
  providers: [
    LineSeriesService,
    CategoryService,
    LegendService,
    TooltipService,
    StripLineService,
    DataLabelService,
    ChartAnnotationService
  ],
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class AppFormsComponent {
  /***************************** Chart moyenne X *******************************************/
  public title: string = 'La Moyenne X̄';  // X majuscule avec barre
    public titleStyle: Object = {
    fontFamily: 'Arial',
    fontWeight: 'bold',
    size: '18px'
  };
  public primaryXAxis: Object = {
    valueType: 'Category',
    majorGridLines: { width: 0 },
    labelIntersectAction: 'Rotate45',
    labelRotation: -45,
    labelStyle: { color: '#333' }
  };

  public primaryYAxis: Object = {
    minimum: 30,
    maximum: 50,
    interval: 1,
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 },
    lineStyle: { width: 0 },
    majorGridLines: { width: 1 },
    labelStyle: { color: 'transparent' },
    stripLines: [
      { start: 0, end: 34, color: 'rgba(255, 0, 0, 0.2)', zIndex: 'Behind' },
      { start: 34, end: 35, color: 'rgb(255, 255, 0)', border: { color: 'yellow', width: 3}, zIndex: 'Behind' },
      
      // Ligne rouge horizontale à y=35
      { 
        start: 34, 
        end: 34.1, // Petite astuce pour rendre la ligne visible
        color: 'red', 
        zIndex: 'Over', // Important: doit être au-dessus
        border: { color: 'red', width: 2 },
        opacity: 1
      },
      
      { start: 35, end: 45, color: 'rgba(0, 200, 0, 0.2)', zIndex: 'Behind' },
      
      // Ligne rouge horizontale à y=45
      { 
        start: 46, 
        end: 46.1, // Petite astuce pour rendre la ligne visible
        color: 'red', 
        zIndex: 'Over', // Important: doit être au-dessus
        border: { color: 'red', width: 2 },
        opacity: 1
      },
      
      { start: 45, end: 46, color: 'rgb(255, 255, 0)', border: { color: 'yellow', width: 3 }, zIndex: 'Behind' },
      { start: 46, end: 60, color: 'rgba(255, 0, 0, 0.2)', zIndex: 'Behind' }
    ]
  };
  public seriesMoyenne: Object[] = [
    { x: 'date1', y: 34 }, { x: 'date2', y: 35 }, { x: 'date3', y: 40 },
    { x: 'date4', y: 45 }, { x: 'date5', y: 46 }, { x: 'date6', y: 34 },
    { x: 'date7', y: 35 }, { x: 'date8', y: 40 }, { x: 'date9', y: 45 },
    { x: 'date10', y: 46 }, { x: 'date11', y: 34 }, { x: 'date12', y: 35 },
    { x: 'date13', y: 40 }, { x: 'date14', y: 45 }, { x: 'date15', y: 46 },
    { x: 'date16', y: 34 }, { x: 'date17', y: 35 }, { x: 'date18', y: 40 },
    { x: 'date19', y: 45 }, { x: 'date20', y: 46 }, { x: 'date21', y: 34 },
    { x: 'date22', y: 35 }, { x: 'date23', y: 40 }, { x: 'date24', y: 45 },
    { x: 'date25', y: 46 }
  ];

  public tooltip: Object = {
    enable: true,
    format: '${point.x} : <b>${point.y}</b>'
  };
  
  public annotations: Object[] = [
    {
      content: '<div style="background:rgba(255,255,0,0.6); width:100%; height:20px;"></div>',
      x: '0%',
      y: 34.5,
      coordinateUnits: 'Point',
      region: 'Chart',
      verticalAlignment: 'Middle'
    },
    {
      content: '<div style="background:rgba(255,255,0,0.6); width:100%; height:20px;"></div>',
      x: '0%',
      y: 45.5,
      coordinateUnits: 'Point', 
      region: 'Chart',
      verticalAlignment: 'Middle'
    },
    {
      content: '<div style="border-top: 2px solid red; width:100%; position:absolute;"></div>',
      x: '0%',
      y: 34,
      coordinateUnits: 'Point',
      region: 'Chart',
      verticalAlignment: 'Middle'
    },
    {
      content: '<div style="border-top: 2px solid red; width:100%; position:absolute;"></div>',
      x: '0%',
      y: 46,
      coordinateUnits: 'Point',
      region: 'Chart',
      verticalAlignment: 'Middle'
    }
  ];
 /*********************** Chart d'Étendue R *******************************/
 public titleEtendue: string = 'L\'étendue R';
 public titleStyleEtendue: Object = {
   fontFamily: 'Arial',
   fontWeight: 'bold',
   size: '18px'
 };

 public primaryXAxisEtendue: Object = {
  minimum: 0,
  maximum: 26, // Ajusté à 26 pour inclure le nouveau point
  interval: 1,
  majorGridLines: { width: 1 },
  minorGridLines: { width: 0 },
  majorTickLines: { width: 1 },
  valueType: 'Double'
};
 public primaryYAxisEtendue: Object = {
   minimum: 0,
   maximum: 10, // Changé de 6 à 10 comme demandé
   interval: 1,
   stripLines: [{
     start: 3,
     end: 3.1,
     color: 'red',
     zIndex: 'Over',
     border: { color: 'red', width: 2 },
     opacity: 1
   }],
   title: 'Axe Y'
 };
 public annotationsEtendue: Object[] = [{
  content: '<div style="border-top: 2px solid red; width:100%"></div>',
  x: '0%',
  y: 3,
  coordinateUnits: 'Point',
  region: 'Chart'
}];
public seriesEtendue: Object[] = [
  { x: '1', y: 2.5 }, { x: '2', y: 3.1 }, { x: '3', y: 4.2 },
  { x: '4', y: 3.8 }, { x: '5', y: 5.0 }, { x: '6', y: 6.2 },
  { x: '7', y: 7.4 }, { x: '8', y: 8.1 }, { x: '9', y: 7.3 },
  { x: '10', y: 6.5 }, { x: '11', y: 5.7 }, { x: '12', y: 4.9 },
  { x: '13', y: 4.1 }, { x: '14', y: 3.3 }, { x: '15', y: 2.5 },
  { x: '16', y: 3.7 }, { x: '17', y: 4.9 }, { x: '18', y: 6.1 },
  { x: '19', y: 7.3 }, { x: '20', y: 8.5 }, { x: '21', y: 9.2 },
  { x: '22', y: 8.4 }, { x: '23', y: 7.6 }, { x: '24', y: 6.8 },
  { x: '25', y: 6.0 }
];
 public tooltipEtendue: Object = {
   enable: true,
   format: 'X: ${point.x} <br/> Y: ${point.y}'
 };

 public markerEtendue: Object = {
  visible: true,
  width: 8,
  height: 8,
  fill: '#333',       // Couleur de remplissage
  border: { 
    width: 1, 
    color: '#fff'    // Bordure blanche
  }
};
 
}