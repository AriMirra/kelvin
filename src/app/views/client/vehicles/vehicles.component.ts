import {Component, OnInit} from '@angular/core';
import {VehicleService} from '../../../services/vehicle.service';
import {UserService} from '../../../services/user.service';
import {Vehicle} from '../../../../shared/vehicles/Vehicle';
import {User} from '../../../../shared/users/User';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class ClientVehiclesComponent implements OnInit {

  client: User;
  vehicles: Vehicle[] = [];

  vehicleSearch = '';

  constructor(private vehicleService: VehicleService, private clientService: UserService) {
    this.clientService.getLoggedUser()
      .subscribe(client => {
        this.client = client;
        this.vehicleService.getUserVehicles(client.id).subscribe(vehicles => {
          this.vehicles = vehicles;
        });
      });
  }

  ngOnInit() {
  }

  // Search

  filteredVehicles(): Vehicle[] {
    if (this.vehicleSearch === '') {
      return this.vehicles;
    }
    return this.vehicles.filter(v => this.vehicleSearchFilter(v));
  }

  vehicleSearchFilter(vehicle: Vehicle): boolean {
    return !![vehicle.model, vehicle.brand, vehicle.domain]
      .map(e => e.toLowerCase())
      .find(e => e.includes(this.vehicleSearch.toLowerCase()));
  }
}
