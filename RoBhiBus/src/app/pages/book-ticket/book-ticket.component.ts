import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, Booking, BusBookingPassenger } from '../../model/model';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-book-ticket',
  imports: [DatePipe, CommonModule,FormsModule],
  templateUrl: './book-ticket.component.html',
  styleUrl: './book-ticket.component.css'
})
export class BookTicketComponent implements OnInit{
  busSchedule: any
  scheduleId:string = ""
  http = inject(HttpClient)
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)
  fromLocation : string = ""
  toLocation : string = ""
  
  
  seats: { label: string; status: 'available' | 'selected' | 'booked' }[] = [];
  selectedSeats:number[] = []
  selectedSeatsArray: BusBookingPassenger[] = []
  baseFare!: number;
  seatRows: { left: any[]; right: any[] }[] = [];
  bookTicketObj: Booking = new Booking()
  alreadyBookedSeats: number[] = []


  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ){
    this.activatedRoute.params.subscribe((res:any)=>{
        
        this.scheduleId = res.scheduleId
        this.bookTicketObj.scheduleId = this.scheduleId
        this.bookTicketObj.custId = 10202
    })
  }
  ngOnInit(): void {
      this.getBookedSeats() 
      this.getScheduleById()
  }

  getScheduleById(){
    this.http.get("https://api.freeprojectapi.com/api/BusBooking/GetBusScheduleById?id="+this.scheduleId).subscribe((res:any)=>{
      this.busSchedule = res
      this.generateSeats()
      this.getBusLocation(res.fromLocation).subscribe((locationRes:any)=>
      this.fromLocation = locationRes.locationName)

      this.getBusLocation(res.toLocation).subscribe((locationRes:any)=>
        this.toLocation = locationRes.locationName)
      
       
    })
  }

  getBusLocation(location:string):Observable<any>{
    return this.http.get("https://api.freeprojectapi.com/api/BusBooking/GetBusLocationById?id="+location)
  }

  getDuration(departureTime: string, arrivalTime:string){
    const dep = new Date(departureTime)
    const arr = new Date(arrivalTime)

    const diffMs = arr.getTime() - dep.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60

    return `${hours}h ${minutes}m`
  }

  getDayofDate(timestamp: string){
    
  const date = new Date(timestamp);
  const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = daysOfWeek[dayOfWeek];
  return dayName
  }


  // TO BE DELETED BELOW
  generateSeats(): void {
    let allSeats: { label: number; status: 'available' | 'selected' | 'booked' }[] = [];
    this.baseFare = this.busSchedule.price
    for (let i = 1; i <= this.busSchedule.totalSeats; i++) {
      allSeats.push({
        label: i,
        status: (this.alreadyBookedSeats.includes(i)) ? 'booked' : 'available'
      });
    }
  
    // 2+2 seating: left 2, aisle, right 2
    for (let i = 0; i < allSeats.length; i += 4) {
      this.seatRows.push({
        left: allSeats.slice(i, i + 2),
        right: allSeats.slice(i + 2, i + 4)
      });
    }
  }

  

  onSelectSeat(seat: { label: number; status: string }): void {
    const newPassengerData: BusBookingPassenger = {
      seatNo : seat.label,
      age: 0,
      bookingId: 0,
      gender: "",
      passengerId: 0,
      passengerName: ""
    }

    this.selectedSeatsArray.push(newPassengerData)

    if (seat.status === 'booked') return;


    if (seat.status === 'available') {
      seat.status = 'selected';
      this.selectedSeats.push(seat.label);
    } else if (seat.status === 'selected') {
      seat.status = 'available';
      this.selectedSeats = this.selectedSeats.filter(s => s !== seat.label);
      this.selectedSeatsArray = this.selectedSeatsArray.filter(s => s.seatNo !== seat.label);
    }
  }

  bookTickets(): void {
    if(!this.authService.isLoggedIn()){
      const dialogRef = this.dialog.open(LoginComponent,{
        disableClose: true
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          // Login successful, stay on page
          alert('You are now logged in. Please click Proceed to Pay again.');
        }
      });

      return;
    }

    sessionStorage.setItem('proceededToPay', 'true');

    if (this.selectedSeatsArray.length === 0) {
      alert('Please select at least one seat before proceeding.');
      return;
    }else{
      for(let i = 0;i<this.selectedSeatsArray.length;i++){
        if(this.selectedSeatsArray[i].passengerName=="" || this.selectedSeatsArray[i].age==0 || this.selectedSeatsArray[i].gender==""){
          alert("Please provide necessary details")
          return
        }
      }
    }
    // Navigate or handle payment logic
    this.bookTicketObj.busBookingPassengers = this.selectedSeatsArray
    this.http.post("https://api.freeprojectapi.com/api/BusBooking/PostBusBooking",this.bookTicketObj).subscribe((res:any)=>{
      // alert("Tickets Booked")
   })
   console.log("Before Navigate")
   console.log('Navigating to download-ticket with:', {
    selectedSeats: this.selectedSeatsArray,
    from: this.fromLocation,
    to: this.toLocation,
    scheduleId: this.scheduleId
  });
   this.router.navigate(['download-ticket'], {
     state: {
       selectedSeats: this.selectedSeatsArray,
       from: this.fromLocation,
       to: this.toLocation,
       departure: this.busSchedule.departureTime,
       arrival: this.busSchedule.arrivalTime,
       baseFare : this.baseFare
     }
   });
console.log("After Navigate")



  }

  getSeatClass(seat: any): any {
    return {
      'btn-outline-light': seat.status === 'available',
      'btn-success': seat.status === 'selected',
      'btn-secondary disabled': seat.status === 'booked'
    };
  }

  getBookedSeats(){
    this.http.get("https://api.freeprojectapi.com/api/BusBooking/getBookedSeats?shceduleId="+this.scheduleId).subscribe((res:any)=>{
      this.alreadyBookedSeats = res
    })
  }
  

  
}
