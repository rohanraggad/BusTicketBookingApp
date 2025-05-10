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