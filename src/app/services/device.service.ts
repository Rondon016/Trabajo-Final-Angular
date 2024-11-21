import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Device } from '../models/device'

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private url = 'https://api.restful-api.dev/objects'

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(this.url)
  }

  save(device: Device): Observable<any> {
    return this.http.post(this.url, device)
  }

  delete(id: string): Observable<any> {
    return this.http.delete(this.url + '/' + id)
  }

  update(device: Device): Observable<any> {
    return this.http.put(this.url + '/' + device.id, device)
  }

}