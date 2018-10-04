import { Component, OnInit } from '@angular/core';
import {DeviceService} from '../../../services/device.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  constructor(private deviceService: DeviceService) { }

  ngOnInit() {
  }

}
