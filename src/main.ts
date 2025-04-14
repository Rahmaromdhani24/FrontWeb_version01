import { bootstrapApplication } from '@angular/platform-browser';
import { registerLicense } from '@syncfusion/ej2-base';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

const SYNC_FUSION_KEY = 'Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCekx0WmFZfVtgcl9GaVZQQGYuP1ZhSXxWdkZhX39YcH1UQmhcUEV9XUs=';

registerLicense(SYNC_FUSION_KEY);

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

/*import { bootstrapApplication } from '@angular/platform-browser';
import { registerLicense } from '@syncfusion/ej2-base';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// ENTRER VOTRE CLÉ DE LICENCE ICI (identique à celle de votre compte Syncfusion)
const SYNC_FUSION_KEY = 'Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCekx0WmFZfVtgcl9GaVZQQGYuP1ZhSXxWdkZhX39YcH1UQmhcUEV9XUs=';

// Initialisation FORCÉE de la licence
registerLicense(SYNC_FUSION_KEY);

// Vérification immédiate
const licenseCheck = () => {
  try {
    const sync = (window as any).ej.base;
    if (sync && sync.getLicenseDetails && !sync.getLicenseDetails().isValid) {
      console.error('ERREUR LICENCE SYNCFUSION - Clé invalide ou non reconnue');
    }
  } catch (e) {
    console.error('Erreur vérification licence Syncfusion', e);
  }
};

// Double vérification après chargement
setTimeout(licenseCheck, 3000);

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));*/