import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userApi = "https://67d30be18bca322cc268fdac.mockapi.io/users"
  addressesApi = "https://67d30be18bca322cc268fdac.mockapi.io/addresses"
  paymentApi = "https://67e3178397fc65f53538b76f.mockapi.io/payment"
  constructor(private http: HttpClient) { this.loadLoggedInUser(); }

  getAllUsers() {
    return this.http.get<any[]>(this.userApi)
  }

  postToUsers(data: any) {
    return this.http.post(this.userApi, data)
  }

  editUser(id: any, data: any) {
    return this.http.put(`${this.userApi}/${id}`, data)
  }

  getLoggedInUsers() {
    return this.http.get<any[]>("https://67d61653286fdac89bc11c6d.mockapi.io/loggedInUser")
  }
  ///

  getAllAddresses() {
    return this.http.get<any[]>(this.addressesApi)
  }

  postToAddresses(data: any) {
    return this.http.post(this.addressesApi, data)
  }

  editAddress(id: any, data: any) {
    return this.http.put(`${this.addressesApi}/${id}`, data)
  }

  deleteAddress(id: any) {
    return this.http.delete(`${this.addressesApi}/${id}`)
  }

  ///

  getAllPayments() {
    return this.http.get<any[]>(this.paymentApi)
  }

  postToPayments(data: any) {
    return this.http.post(this.paymentApi, data)
  }

  editPayment(id: any, data: any) {
    return this.http.put(`${this.paymentApi}/${id}`, data)
  }

  deletePayment(id: any) {
    return this.http.delete(`${this.paymentApi}/${id}`)
  }

  ///


  postUserData(data: any) {
    return this.http.put(`https://67d61653286fdac89bc11c6d.mockapi.io/loggedInUser/1`, data)/////////////////////////////////////////////////
  }

  getUser() {
    return this.http.get('https://67d61653286fdac89bc11c6d.mockapi.io/loggedInUser/1')///////////////////////////////////////////////////////
  }

  loggedInUser = new BehaviorSubject<any>(null);


  loadLoggedInUser() {
    this.http.get<any[]>('https://67d61653286fdac89bc11c6d.mockapi.io/loggedInUser')
      .subscribe(users => {
        if (users.length > 0) {
          this.loggedInUser.next(users[0]); 
        }
      });
  }

  getLoggedInUser() {
    return this.loggedInUser.asObservable();
  }

  LogIn(user: any) {
    return this.http.post('https://67d61653286fdac89bc11c6d.mockapi.io/loggedInUser', user).pipe(
      tap(() => this.loggedInUser.next(user)) 
    );
  }

  clearLoggedInUser() {
    this.http.get<any[]>('https://67d61653286fdac89bc11c6d.mockapi.io/loggedInUser')
      .subscribe(users => {
        users.forEach(user => {
          this.http.delete(`https://67d61653286fdac89bc11c6d.mockapi.io/loggedInUser/${user.ID}`)
            .subscribe(() => {
              this.loggedInUser.next(null); 
            });
        });
      });
  }
}
