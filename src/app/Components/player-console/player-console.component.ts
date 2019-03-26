import { Component, OnInit } from '@angular/core';
import { CommandSupportService } from '../../Services/command-support.service';
import * as $ from 'jquery';

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

  addCommand(command: string) {
    this.lastUsedCommands.push(command);
    this.lastUsedCommands.splice(0,1);
    $("#data").val("");
    command = command.toLowerCase();
    this.dataCSS.processCommand(command);
    return false;
  }
}
