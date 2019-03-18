import { Component, OnInit } from '@angular/core';
import { TerminalService } from '../../Services/terminal.service'

@Component({
  selector: 'app-narrator-console',
  templateUrl: './narrator-console.component.html',
  styleUrls: ['./narrator-console.component.css']
})
export class NarratorConsoleComponent implements OnInit {

  constructor(private terminalService:TerminalService) { }

  ngOnInit() {
  }

}
