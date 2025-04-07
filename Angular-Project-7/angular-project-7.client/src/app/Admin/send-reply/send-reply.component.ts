import { Component } from '@angular/core';
import { ShopService } from '../../Services/shop.service';

@Component({
  selector: 'app-send-reply',
  templateUrl: './send-reply.component.html',
  styleUrls: ['./send-reply.component.css']
})
export class SendReplyComponent {
  //send: any[] = [];
  send = [
    {
      firstName: 'saja',
      lastName: 'alkhatib',
      email: 'saja@example.com',
      message: 'Hello, I need assistance.',
      reply: ''
    },
    // Add more messages here as needed
  ];

  // Define the sendReply method
  sendReply(message: any) {
    // Handle the reply logic here
    console.log('Reply sent to:', message.firstName, message.lastName);
    console.log('Reply content:', message.reply);

    // Optionally, clear the reply textarea after sending the reply
    message.reply = '';
  }
  constructor(private service: ShopService) { }

  ngOnInit() {
    this.getContactUs();
  }

  getContactUs() {
    this.service.getMessages().subscribe((data) => {
      this.send = data;
    }, error => {
      console.error("Error fetching messages", error);
    });
  }

  
}
