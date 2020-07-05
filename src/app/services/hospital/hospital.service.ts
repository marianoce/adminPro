import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Modelo
import { Hospital } from '../../models/hospital.model';

// Config
import { URL_SERVICIOS } from 'src/app/config/config';

// SWEET ALERT
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(public http: HttpClient) { }

  cargarHospitales(desde: number = 0) {
    const url = URL_SERVICIOS + '/hospital?desde=' + desde.toString();
    return this.http.get(url);
  }


  obtenerHospital(id:	string) {
    const url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url);
  }

  borrarHospital(id: string, token: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + token;
    return this.http.delete(url);
  }

  crearHospital(hospital: Hospital, token: string) {
    const url = URL_SERVICIOS + '/hospital?token=' + token;
    return this.http.post(url, hospital);
  }

  buscarHospital(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url)
    .pipe(map((resp: any) => {
      return resp.hospitales;
    }));
  }

  actualizarHospital(hospital: Hospital, token: string) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + token;
    return this.http.put(url, hospital)
    .pipe(map((resp: any) => {
      swal('Hospital Actualizado', resp.hospital.nombre, 'success');
      return true;
    }));
  }
}
