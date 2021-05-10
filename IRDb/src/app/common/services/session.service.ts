import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(private httpClient: HttpClient) { }
  /*signup(data: any): Promise<any>{
    const url = `${environment.apiUrl}signup`;
    return this.httpClient.post(url, data), data.toPromise();
  }*/

  login(correo: string, pass: string): Promise<any> {
    const url = `${environment.apiUrl}auth/?correo=${correo}&pass=${pass}`;
    return this.httpClient.get(url, {}).toPromise();
  }

  registrar(nombre:string, correo:string, password:string) {
    const url = `${environment.apiUrl}`;
    return this.httpClient.post(`${url}usermongo/`, {
        nombre: nombre,
        correo: correo,
        password: password
    }).toPromise();
  }

  googleLogin(idToken: string): Promise<any>{
    const url = `${environment.apiUrl}authgoogle`;
    return this.httpClient.get(url, { params: { idToken: idToken} }).toPromise();
  }

  googleReg(idToken: string): Promise<any> {
    const url = `${environment.apiUrl}registrogoogle`;
    return this.httpClient.post(url, { idToken: idToken }).toPromise();
  }
}