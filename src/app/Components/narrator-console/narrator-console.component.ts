import { Component, OnInit, Output } from '@angular/core';
import { CommandSupportService } from '../../Services/command-support.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-narrator-console',
  templateUrl: './narrator-console.component.html',
  styleUrls: ['./narrator-console.component.css']
})
export class NarratorConsoleComponent implements OnInit {
  //message: string;
  //@Output() myEvent = new EventEmitter();
  
  constructor(private dataCSS: CommandSupportService) { }

  ngOnInit() {
    this.playAudio();
    var narratorConsole = document.getElementById("narratorConsole");
    var para = document.createElement("p");
    //It's waiting for new information from player console and open functions respectively
    this.dataCSS.getEventSubject().subscribe((command: any) => {
      if (command !== undefined) {
        switch (command) {
          case 'New game': narratorConsole.appendChild(para.appendChild(document.createTextNode("\nRozpoczynasz nową grę!"))); break;
          case 'Load game': alert("Ładujesz zapisany stan gry"); break;
          case 'Options': alert("Otwierasz opcje"); break;
          default: alert("Default"); break;
        }
      }
    });

    //TODO Clicking on list variable send command to player console
    $('#menu li').click(() => {
      //this.message = $(this).text();
      //alert($(this).text());
      //alert(this.command);
      //this.dataCSS.currentCommand.subscribe(command => this.command = command);
      //this.dataPNS.changeMessage($(this).text());
      //this.myEvent.emit(null);

      //this.dataCSS.processCommand($(this).text());
    });
  }
  //It's working but only with external src like: links. I don't know why it working this way and i'm to tired to find out.
  playAudio(){
    var audio = new Audio();
    audio.src = '';//It should be external link.
    audio.load();
    audio.play();
  }
}
