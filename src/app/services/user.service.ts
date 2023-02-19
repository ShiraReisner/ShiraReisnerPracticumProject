import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user!: User
  baseUrl: string = environment.baseUrl + "User";

  constructor(public httpClient: HttpClient) { }

  getUser(): User | null {
    return this.user;
  }

  setUser(user: User) {
    this.user = user;
  }

  addUser(user: User) {
    return this.httpClient.post(`${this.baseUrl}`, user);
  }
}
