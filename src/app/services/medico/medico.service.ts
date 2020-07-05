import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(public http: HttpClient) { }

  cargarMedicos(desde: number) {
    const url = URL_SERVICIOS + '/medico?desde=' + desde.toString();
    return this.http.get(url);
  }


  buscarMedicos(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url)
    .pipe(map((resp: any) => {
      return resp.medicos;
    }));
  }


  borrarMedico(id: string, token: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + token;
    return this.http.delete(url);
  }


  crearMedico(medico: Medico, token: string) {
    let url = URL_SERVICIOS + '/medico';
    if(medico._id) {
      // Actualizando
      url += '/' + medico._id;
      url += '?token=' + token;
      return this.http.put(url, medico);
    } else {
      // Creando
      url += '?token=' + token;
      return this.http.post(url, medico);
    }
  }

  cargarMedico(id: string) {
    const url = URL_SERVICIOS + '/medico/' + id;
    return this.http.get(url)
    .pipe(map((resp: any) => resp.medico));
  }
}
