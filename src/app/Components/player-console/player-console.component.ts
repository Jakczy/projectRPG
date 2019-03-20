import { Component, OnInit } from '@angular/core';
import { CommandSupportService } from '../../Services/command-support.service';

@Component({
  selector: 'app-player-console',
  templateUrl: './player-console.component.html',
  styleUrls: ['./player-console.component.css']
})

export class PlayerConsoleComponent implements OnInit {
  lastUsedCommands: string[];
  command: string;

  constructor(private dataCSS: CommandSupportService) { }

  ngOnInit() {
    this.lastUsedCommands = ['','','','',''];
  }

  addCommand(command) {
    this.lastUsedCommands.push(command);
    this.lastUsedCommands.splice(0,1);
    this.dataCSS.processCommand(command);
    return false;
  }
}
