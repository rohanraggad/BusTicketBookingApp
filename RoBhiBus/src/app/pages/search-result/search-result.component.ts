import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Search } from '../../model/model';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search-result',
  imports: [DatePipe],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.css'
})
export class SearchResultComponent implements OnInit{
  activatedRoute = inject(ActivatedRoute)
  searchObj: Search = new Search();
  http = inject(HttpClient)
  busSchedules: any[] = [];

  constructor(){
    this.activatedRoute.params.subscribe((res:any)=>{
        this.searchObj.fromLocationId = res.from
        this.searchObj.toLocationId = res.to
        this.searchObj.date = res.date
    })
  }
  ngOnInit(): void {
    this.getBusSchedules()
  }
  getBusSchedules(){
    this.http.get("https://api.freeprojectapi.com/api/BusBooking/searchBus2?fromLocation="+this.searchObj.fromLocationId+"&toLocation="+this.searchObj.toLocationId+"&travelDate="+this.searchObj.date).subscribe((res:any)=>{
      console.log(this.searchObj.fromLocationId)
      debugger  
      this.busSchedules = res
      this.sortBuses('departure-asc')
      }
      )
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

  getDurationInMinutes(departureTime: string, arrivalTime:string){
    const dep = new Date(departureTime)
    const arr = new Date(arrivalTime)

    const diffMs = arr.getTime() - dep.getTime()
    return Math.floor(diffMs / 60000)
  }

  sortChange(event:Event){
    const selectElement = event.target as HTMLSelectElement
    const order = selectElement.value
    this.sortBuses(order)
  }

  sortBuses(order:string){
    switch (order){
      case 'departure-asc':
        this.busSchedules.sort((a,b)=> 
        new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
      )
      break

      case 'departure-desc':
        this.busSchedules.sort((a,b)=> 
          new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime()
        )
      break

      case 'duration':
        this.busSchedules.sort((a,b)=>
        this.getDurationInMinutes(a.departureTime,a.arrivalTime) - this.getDurationInMinutes(b.departureTime,b.arrivalTime)
      )
      break
    }
  }
}
