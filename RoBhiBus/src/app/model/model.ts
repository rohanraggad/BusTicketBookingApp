import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree, NavigationStart, ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot,Event as NavigationEvent } from "@angular/router";
import { Observable } from "rxjs";
import { filter,first,map } from "rxjs/operators";

export class Search{
    fromLocationId: string;
    toLocationId: string;
    date: string;

    constructor(){
        this.fromLocationId = "From";
        this.toLocationId = "To";
        this.date = "";
    }
}

export class Booking{
    bookingId: number 
    custId: number
    bookingDate: Date
    scheduleId: string 
    busBookingPassengers: BusBookingPassenger[]

    constructor(){
        this.bookingId = 0
        this.custId = 0
        this.bookingDate = new Date()
        this.scheduleId = ""
        this.busBookingPassengers = []

    }
}

export class BusBookingPassenger{
    passengerId: number 
    bookingId: number
    passengerName: string
    age: number
    gender: string
    seatNo: number 

    constructor(){
        this.passengerId = 0
        this.bookingId = 0
        this.passengerName = ""
        this.age = 0
        this.gender = ""
        this.seatNo = 0
    }
}

@Injectable({providedIn: 'root'})
export class AuthService{
    private isLoggedInFlag = false;
    http = inject(HttpClient)
    isLoggedIn(): boolean {
      return this.isLoggedInFlag;
    }
  
    login(username:string, password:string): Observable<any> {
      const payload = {
        userName: username,
        password: password
      }
      return this.http.post("https://api.freeprojectapi.com/api/BusBooking/login",payload)
    }
  
    setLoginStatus(status: boolean):void{
      this.isLoggedInFlag = true;
    }

    logout(): void {
      this.isLoggedInFlag = false;
    }

    signup(userData: any): Observable<any> {
      const url = 'https://api.freeprojectapi.com/api/BusBooking/AddNewUser';
      return this.http.post(url, userData);
    }
}

@Injectable({ providedIn: 'root' })
export class TicketAccessGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const fromBooking = sessionStorage.getItem('proceededToPay') === 'true';

    if (this.auth.isLoggedIn() && fromBooking) {
      return true;
    }

    this.router.navigate(['/search']);
    return false;
  }
}
