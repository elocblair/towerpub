import { Component, OnInit } from '@angular/core';
import { Item } from '../shared/item.model';
import { InventoryService } from '../inventory.service';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'app-tower',
  templateUrl: './tower.component.html',
  styleUrls: ['./tower.component.css']
})

export class TowerComponent implements OnInit {

  showItem = false;
  selectedItem: Item;
  towerItemList: Item[];

  constructor(private inventoryService: InventoryService,
              private resourceService: ResourceService) {}

  ngOnInit() {
    this.towerItemList = this.inventoryService.getTowerItemList();
  }

  moveItemFromTower(item: Item) {
    if (this.inventoryService.addToPlayerInventory(item)) {
      this.inventoryService.removeFromTowerInventory(item);
      this.towerItemList = this.inventoryService.getTowerItemList();
      if (item === this.selectedItem) {
        this.showItem = false;
      }
    }
  }

  seeItemDetails(item: Item) {
    this.showItem = true;
    this.selectedItem = item;
  }

  removeItem(item: Item) {
    this.inventoryService.removeFromTowerInventory(item);
    this.towerItemList = this.inventoryService.getTowerItemList();
    if (item === this.selectedItem) {
      this.showItem = false;
    }
  }

  getSelectedItemStatKeys() {
    return Array.from(this.selectedItem.stats.keys());
  }

  addSword() {
    // init sword
    const swordStats = new Map<string, number>();
    swordStats.set('attack', 3);
    const swordItem = new Item('rusty short sword', 'weapon', swordStats);
    this.inventoryService.addToTowerInventory(swordItem);
    this.towerItemList = this.inventoryService.getTowerItemList();
  }

  addShield() {
    // init shield
    const shieldStats = new Map<string, number>();
    shieldStats.set('defense', 4);
    shieldStats.set('attack', 1);
    shieldStats.set('constitution', 1);
    const shieldItem = new Item('wooden shield', 'weapon', shieldStats);

    this.inventoryService.addToTowerInventory(shieldItem);
    this.towerItemList = this.inventoryService.getTowerItemList();
  }

}
