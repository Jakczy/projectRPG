import { Component, OnInit } from '@angular/core';
import { PlayerNarratorService } from '../../Services/player-narrator.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-player-console',
  templateUrl: './player-console.component.html',
  styleUrls: ['./player-console.component.css']
})
export class PlayerConsoleComponent implements OnInit {
  lastUsedCommands: string[];
  message:string;

  constructor(private data: PlayerNarratorService) { }

  ngOnInit() {
    this.lastUsedCommands = ['','','','',''];
    this.data.currentMessage.subscribe(message => this.message = message);
  }

  addCommand(command) {
    this.lastUsedCommands.push(command);
    this.lastUsedCommands.splice(0,1);
    this.data.changeMessage(command);
    return false;
  }
}
