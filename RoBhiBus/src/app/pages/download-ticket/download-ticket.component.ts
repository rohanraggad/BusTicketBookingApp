import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CelebrationComponent } from "../celebration/celebration.component";

@Component({
  standalone: true,
  selector: 'app-download-ticket',
  imports: [CommonModule, CelebrationComponent, DatePipe],
  templateUrl: './download-ticket.component.html',
  styleUrls: ['./download-ticket.component.css']
})
export class DownloadTicketComponent implements OnInit {
  ticketData: any[] = [];
  from: string = '';
  to: string = '';
  departure: string = '';
  arrival: string = '';
  baseFare: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = window.history.state

    if (state) {
      this.ticketData = state['selectedSeats'] || [];
      this.from = state['from'] || '';
      this.to = state['to'] || '';
      this.departure = state['departure'] || '';
      this.arrival = state['arrival'] || '';
      this.baseFare = state['baseFare'] || '';
    } else {
      console.warn('No ticket data found in navigation state');
    }

    sessionStorage.removeItem('proceededToPay');
  }

  getDayofDate(timestamp: string){
    
    const date = new Date(timestamp);
    const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
  
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeek[dayOfWeek];
    return dayName
    }

  downloadTicket(): void {
    const printContent = document.getElementById('ticket')?.innerHTML;
    if (!printContent) return;
  
    const WindowPrt = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    
    if (WindowPrt) {
      WindowPrt.document.write(`
        <html>
          <head>
            <title>Bus Ticket</title>
            <style>
              body {
                font-family: 'Segoe UI', sans-serif;
                margin: 0;
                padding: 20px;
                background: #f8f8f8;
              }
  
              .ticket {
                width: 100%;
                max-width: 600px;
                background: #fff;
                border: 2px dashed #333;
                border-radius: 12px;
                padding: 20px;
                margin: auto;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
                background-image: linear-gradient(135deg, #fff 60%, #f8f8f8 100%);
                position: relative;
              }
  
              .ticket-header {
                border-bottom: 2px dashed #ccc;
                padding-bottom: 12px;
                margin-bottom: 15px;
              }
  
              .ticket-header h2 {
                margin: 0 0 10px 0;
              }
  
              .route {
                display: flex;
                justify-content: space-between;
                font-size: 16px;
                margin: 8px 0;
              }
  
              .time-info {
                display: flex;
                justify-content: space-between;
                font-size: 15px;
                color: #555;
              }
  
              .ticket-body .passenger-info {
                margin-bottom: 15px;
                padding: 10px 0;
                border-top: 1px dashed #bbb;
              }
  
              .passenger-header {
                font-weight: bold;
                color: #333;
                margin-bottom: 5px;
                font-size: 15px;
              }
  
              @media print {
                body {
                  background: white;
                }
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <div class="ticket">
              ${printContent}
            </div>
          </body>
        </html>
      `);
      WindowPrt.document.close();
    }
  }
  
}
