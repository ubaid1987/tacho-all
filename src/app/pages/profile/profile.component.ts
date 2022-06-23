import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalService } from 'src/app/modal/modal.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  monthss = [];

  header: any = [];
  headerRev: any =[];
  header1: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  header1Rev: any = [];
  techoGraphData: any = [];
  techoGraphDataRev: any =[];
  itemID = 1;
  sessionID = '';
  showyellow = true;
  showPage = false;
  constructor(public http: HttpClient, private sanitizer: DomSanitizer, private modalService: ModalService,
    private viewContainerRef: ViewContainerRef) {
    const queryParams = window.location.search;
    const searchParams = new URLSearchParams(queryParams);
    let sid: any = searchParams.get('sid');
    let user: any = searchParams.get('user');

    if (!sid) {
      sid = searchParams.get('?sid');
      sid = searchParams.get('user');
    }
    if (!sid) {
      sid = sessionStorage.getItem('sid');
    }

    if (typeof (Storage) !== 'undefined') {
      // Store
      sessionStorage.setItem('sid', sid);
      sessionStorage.setItem('user', user);
    }
    this.sessionID = sid ? sid : sessionStorage.getItem('sid');
  }



  ngOnInit() {
    var d = new Date();
    if (d.getDate() > 20) {
      this.showyellow = false;
    }
    let sessionID = this.sessionID;
    //https://wialonapp.herokuapp.com/

    this.http.get('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={"spec":{"itemsType":"avl_resource","propName":"","propValueMask":"","sortType":""},"force":1,"flags":8465,"from":0,"to":0}&sid=' + sessionID).subscribe((res: any) => {
      this.itemID = res.items[0].id;
      this.http.get('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=file/list&sid=' + sessionID + '&params={"itemId":' + res.items[0].id + ',"storageType":2,"path":"/tachograph","mask":"*","recursive":false,"fullPath":false}').subscribe((res1: any) => {

        let drvrs: any = []
        res.items.forEach((element: any) => {
          drvrs.push(element.drvrs)
        });

        // console.log('drvrs')
        this.doProcessData(drvrs, res1);
      })
    })


  }
  doProcessData(drvrs: any, fileDetails: any) {

    let sessionID = this.sessionID;
    var monthName = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");




    drvrs.forEach((element1: any) => {
      let drvrsDetails = Object.keys(element1).map(function (key) { return element1[key]; });
      drvrsDetails.forEach(element => {

        if (String(element.c).length < 14 && element.c) {
          for (let index = 0; index < 14 - String(element.c).length; index++) {

          }
        }

        this.techoGraphData.push({
          name: element.n, id: element.c, data: {}, datejoin: element.ct, joindate: new Date(element.ct * 1000), phone: element.p, desc: element.ds, cardExpiry: element.jp && element.jp['Scadenza Tessera Autista'] ? element.jp['Scadenza Tessera Autista'] : ''
          ,
          dateofemp: element.jp && element.jp['Date of employment'] ? element.jp['Date of employment'] : '',
          email: element.jp && element.jp['E-mail'] ? element.jp['E-mail'] : '',
          Patentediguida: element.jp && element.jp['Patente di guida'] ? element.jp['Patente di guida'] : '',
          Patenteprofessionale: element.jp && element.jp['Patente professionale'] ? element.jp['Patente professionale'] : '',
          Scadenzacarta: element.jp && element.jp['Scadenza carta'] ? element.jp['Scadenza carta'] : '',
          Ruolonellazienda: element.jp && element.jp['Ruolo nellazienda'] ? element.jp['Ruolo nellazienda'] : ''
        });
      });
    });


    this.techoGraphData.sort((a: any, b: any) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

    this.techoGraphData.forEach((techoGraph: any, index: any) => {
      let maxdrive = 9991618497441434
      let monthData = { "January": [], "February": [], "March": [], "April": [], "May": [], "June": [], "July": [], "August": [], "September": [], "October": [], "November": [], "December": "" };

      let driverData1: any = [];
      this.header = [];
      //let oldDate1 = new Date();
      let cM = -1;
      let inde = 0;
      this.header1 = [{ count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }];
      for (let index = 0; index <= 365; index++) {
        let oldDate = new Date();
        let newdate = new Date(oldDate);
        newdate.setDate(oldDate.getDay() - index);
        let dateTime = Math.round(newdate.getTime() / 1000);
        let data1 = { month: monthName[newdate.getMonth()], date: newdate.getDate(), filepresent: false, name: '', dates: '', colorcode: dateTime > techoGraph.datejoin ? 'gray' : 'red' }
        let date2 = new Date(techoGraph.datejoin * 1000);
        if (newdate.getMonth() == date2.getMonth() && newdate.getDate() == date2.getDate()) {
          data1.colorcode = 'blue'
        }
        this.header.push(newdate.getDate())
        if (cM == -1 || cM != newdate.getMonth()) {
          if (cM >= 0) {
            inde++

          }
          this.header1[inde].count = this.header1[inde].count + 1;
          this.header1[inde].month = monthName[newdate.getMonth()]
          this.header1[inde].year = newdate.getFullYear()
          cM = newdate.getMonth();
        } else {
          this.header1[inde].count = this.header1[inde].count + 1;
        }
        
        fileDetails.forEach((data: any) => {
          let driverdata = String(data.n).split("_")[0];
          if (driverdata.indexOf(techoGraph.id) >= 0) {
            var d = new Date(data.ct * 1000);
            if (d.getMonth() == newdate.getMonth() && d.getDate() == newdate.getDate()) {
              data1.name = data.n;
              data1.dates = data.ct;
              data1.filepresent = true;
              data1.colorcode = 'green';
              if (data.ct < maxdrive) {
                maxdrive = data.ct;
              }
            }
          }
        });
        driverData1.push(data1)
      }



      let setCode = 0;

      let Datecount = 0;
      driverData1.forEach((element: any, pos: any) => {
        if (maxdrive != 9991618497441434) {
          if (element.colorcode == 'green') {
            Datecount = 0;
            setCode = 1;
          }

          if (setCode && element.colorcode != 'green') {
            Datecount++;
            driverData1[pos].colorcode = 'red';
            if (Datecount > 15 && Datecount < 28) {
              driverData1[pos].colorcode = 'yellow';
            }
            if (Datecount <= 15) {
              driverData1[pos].colorcode = 'nocolor';
            }
          }
        } else {
          if (element.colorcode == 'blue') {
            Datecount = 0;
            setCode = 1;
          }
          if (setCode) {
            Datecount++;
            if (Datecount > 15 && Datecount < 28) {
              driverData1[pos].colorcode = 'yellow';
            }
            if (Datecount <= 15) {
              driverData1[pos].colorcode = 'nocolor';
            }
          }
        }
      });
      // driverData1.reverse();
      this.techoGraphData[index].data = driverData1;
      // console.log(this.techoGraphData)
    });
    console.log(this.techoGraphData)
    this.showPage = true; 
    for (let i = this.header1.length-1; i>=0; i--) {
              this.header1Rev.push(this.header1[i])
    }
    for (let j = this.header.length-1; j>=0; j--) {
      this.headerRev.push(this.header[j])
}



  }

  downloadFile(fileName: any) {
    let sessionID = this.sessionID;
    window.open('https://hst-api.wialon.com/wialon/ajax.html?svc=file/get&sid=' + sessionID + '&params={"itemId":' + this.itemID + ',"storageType":2,"path":"/tachograph/' + fileName + '","format":"1"}')

  }

  openModal(e: any, modalTitle: any, modalText: any) {

    e.preventDefault();
    this.modalService.setRootViewContainerRef(this.viewContainerRef);
    this.modalService.addDynamicComponent(modalTitle, modalText);
  }
}
