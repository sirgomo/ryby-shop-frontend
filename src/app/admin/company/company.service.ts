import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { iCompany } from 'src/app/model/iCompany';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = environment.api + 'company';
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getAllCompanies(): Observable<iCompany> {
    return this.http.get<iCompany[]>(this.apiUrl).pipe(
      map((res) => {
        return res[0];
      }),
    catchError((err) => {
      this.errorService.newMessage(err.message);
      return [];
    }),
    shareReplay(1)
    );
  }

  getCompanyById(id: number) {
    return this.http.get<iCompany>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        this.errorService.newMessage(err.message);
        return of({} as iCompany);
      }));
  }

  createCompany(companyData: iCompany) {
    return this.http.post<iCompany>(this.apiUrl, companyData).pipe(
      catchError((err) => {
        this.errorService.newMessage(err.message);
        throw err;
      }));
  }

  updateCompany(id: number, companyData: iCompany) {
    return this.http.put<iCompany>(`${this.apiUrl}/${id}`, companyData).pipe(
      catchError((err) => {
        this.errorService.newMessage(err.message);
        throw err;
      }));
  }
   deleteCompany(id: number) {
    return this.http.delete<number>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        this.errorService.newMessage(err.message);
        throw err;
      }));
  }
  getCookies() {
    return this.http.get<iCompany>(`${this.apiUrl}/cookie/get`).pipe(
      catchError((err) => {
        this.errorService.newMessage(err.message);
        return of({} as iCompany);
      })
    );
  }
}
