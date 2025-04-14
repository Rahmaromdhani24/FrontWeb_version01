import { Component  , OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  ngOnInit() {
    this.removeSyncfusionBanner();
  }

  private removeSyncfusionBanner() {
    // Méthode optimisée et typée correctement
    const removeBanners = () => {
      // Solution 1: Conversion explicite en Array
      const banners = Array.from(document.querySelectorAll('.e-trial-reminder, .e-watermark, .e-license-notification'));
      
      // Solution alternative: Spread operator
      // const banners = [...document.querySelectorAll('.e-trial-reminder, .e-watermark, .e-license-notification')];

      banners.forEach(banner => {
        if (banner.parentNode) {
          banner.parentNode.removeChild(banner);
        }
      });

      // Nettoyage supplémentaire pour les messages textuels
      const allElements = document.getElementsByTagName('*');
      for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i];
        if (el.textContent?.includes('trial version of Syncfusion')) {
          el.remove();
        }
      }
    };

    // Exécution immédiate + intervalle de sécurité
    removeBanners();
    const interval = setInterval(removeBanners, 1000);
    setTimeout(() => clearInterval(interval), 10000);
  }
}