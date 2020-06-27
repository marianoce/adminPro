import { Component, OnInit } from '@angular/core';
import { promise } from 'protractor';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() {
    let promesa = new Promise((resolve, reject) => {
      let contador = 0;
      let intervalo = setInterval(() => {
                          contador++;
                          console.log(contador);
                          if (contador === 3) { reject('cagamos'); clearInterval(intervalo); }
                        }, 1000);
                      });

    promesa.then(
      () => console.log('Ok')
    ).catch(
      error => console.error(error)
    )
  }

  ngOnInit(): void {
  }

}
