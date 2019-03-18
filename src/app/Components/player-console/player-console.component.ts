import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player-console',
  templateUrl: './player-console.component.html',
  styleUrls: ['./player-console.component.css']
})
export class PlayerConsoleComponent implements OnInit {
  lastUsedCommands: string[];

  constructor() { }

  ngOnInit() {
    this.lastUsedCommands = ['','','','',''];
  }

  addCommand(command) {
    this.lastUsedCommands.push(command);
    this.lastUsedCommands.splice(0,1);
    return false;
  }

}
