import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [AsyncPipe,FormsModule,DatePipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
    location$ : Observable<any>  = new Observable<any[]>
    busList: any[] =[]
    masterService = inject(MasterService)

    searchObj: any = {
      fromLocation : '',
      toLocation: '',
      travelDate: ''
    }

    ngOnInit(): void {
        this.getAllLocations()
    }

    getAllLocations(){
      this.location$ = this.masterService.getLocations()
    }

    searchBus(){
        const {fromLocation,toLocation,travelDate} = this.searchObj
        this.masterService.searchBus(fromLocation,toLocation,travelDate).subscribe((res:any)=>{
          this.busList = res
        })
    }
}
