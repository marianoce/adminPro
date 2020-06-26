import { Component, OnInit, Inject } from '@angular/core';
import { SettingsService } from '../../services/service.index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {

  constructor(private settings: SettingsService) { }

  ngOnInit(): void {
    this.colocarCheck();
  }

  cambiarColor(tema: string, link: any) {

    let selectores = document.getElementsByClassName('selector');
    for(let select of selectores) {
      select.classList.remove('working');
    }

    link.classList.add('working');

    this.settings.aplicarTema(tema);
  }

  colocarCheck() {
    let selectores = document.getElementsByClassName('selector');
    let tema = this.settings.ajustes.tema;
    for(let ref of selectores) {
      if (ref.getAttribute('data-theme') === tema) {
        ref.classList.add('working');
        break;
      }
    }
  }
}
