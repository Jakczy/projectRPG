import { Component, OnInit } from '@angular/core';
import { PlayerNarratorService } from '../../Services/player-narrator.service';

@Component({
  selector: 'app-narrator-console',
  templateUrl: './narrator-console.component.html',
  styleUrls: ['./narrator-console.component.css']
})
export class NarratorConsoleComponent implements OnInit {
  message:string;
  
  constructor(private data: PlayerNarratorService) { }

  ngOnInit() {
    this.playAudio();
    this.data.currentMessage.subscribe(message => this.message = message);
  }
  //It's working but only with external src like: links. I don't know why it working this way and i'm to tired to find out.
  playAudio(){
    var audio = new Audio();
    audio.src = '';//It should be external link.
    audio.load();
    audio.play();
  }
}
