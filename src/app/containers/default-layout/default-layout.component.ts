import { navItems } from '../../_nav';
import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { WebSdkService } from '../../web-sdk.service';
import { isEqual } from 'lodash';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  modalRef: BsModalRef;
  name = '';
  vendor = '';
  properties: any;
  eventArray = [];
  public sidebarMinimized = false;
  public navItems = navItems;


  constructor(private modalService: BsModalService, private webSdkService: WebSdkService) {
  }

  ngOnInit() {
    console.log('this is updated one!!!');
    this.setEventListFromLocalStorage();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  setEventListFromLocalStorage() {
    const eventList = JSON.parse(localStorage.getItem('eventList'));
    if (eventList) {
      this.eventArray = eventList;
    }
  }

  doesValueExist(eventData) {
    const filter = this.eventArray.filter(event => {
      return event.name === eventData.name && eventData.vendor === event.vendor && isEqual(event.properties, eventData.properties);
    });

    if (filter.length) {
      alert('this values exist!!');
      return true;
    }
    return false;
  }

  submit() {
    if (!this.name || !this.vendor || !this.properties) {
      alert("No values in either input!");
      return;
    }
    let propObj;
    try {
      propObj = JSON.parse(this.properties);
      if (typeof propObj !== 'object') {
        alert('Not a validate JSON object');
        return;
      }
    } catch (e) {
      alert(e);
      return;
    }

    const eventData = {
      name: this.name,
      vendor: this.vendor,
      properties: propObj
    };
    if (this.doesValueExist(eventData)) {
      return;
    }

    this.eventArray.push(eventData);
    localStorage.setItem('eventList', JSON.stringify(this.eventArray));
    this.name = this.vendor = '';
    this.properties = null;
  }

  fireEvent(event, index) {
    console.log('this will be fired!! ', event);
    let propObj;
    try {
      propObj = JSON.parse(event.properties);
      if (typeof propObj !== 'object') {
        alert('Not a validate JSON object');
        return;
      }
    } catch (e) {
      alert(e);
      return;
    }

    // if (!this.doesValueExist(event)) {
    //   this.eventArray[index] = event;
    //   localStorage.setItem('eventList', JSON.stringify(this.eventArray));
    // }
    this.eventArray[index] = event;
    localStorage.setItem('eventList', JSON.stringify(this.eventArray));
    this.modalRef.hide();
    setTimeout(() => {
      this.webSdkService.logEvent(event);
    }, 1000);
  }
}
