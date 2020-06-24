import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress') txtProgress: ElementRef;

  @Input() porcentaje: number = 50;
  @Input('nombre') leyenda: string = 'Leyenda';

  @Output() cambioVal: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public onChange(event: number)
  {
    if (event >= 100) {
      this.porcentaje = 100;
    } else if (event <= 0) {
      this.porcentaje = 0;
    }
    else {
      this.porcentaje = event;
    }

    this.txtProgress.nativeElement.value = this.porcentaje;
    this.cambioVal.emit(this.porcentaje);
  }

  public cambiarValor(valor: number) {
    if (this.porcentaje >= 100 && valor > 0) {
      return;
    }

    if (this.porcentaje <= 0 && valor < 0) {
      return;
    }

    this.txtProgress.nativeElement.focus();
    this.porcentaje += valor;
    this.cambioVal.emit(this.porcentaje);
  }
}
