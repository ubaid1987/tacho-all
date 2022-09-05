import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalService } from 'src/app/modal/modal.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  monthss = [];
  techoGraphData: any = [];
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

if(!sid){
 sid =  sessionStorage.getItem('sid');
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
    let sessionID = '020fd5ec278ffe1694edb41009aca165' //this.sessionID;


    this.http.get('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={"spec":{"itemsType":"avl_resource","propName":"","propValueMask":"","sortType":""},"force":1,"flags":8465,"from":0,"to":0}&sid=' + sessionID).subscribe((res: any) => {
    this.itemID  = res.items[0].id;
    // console.log('111111',res);

    this.http.get('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=file/list&sid=' + sessionID + '&params={"itemId":' + res.items[0].id + ',"storageType":2,"path":"/tachograph","mask":"*","recursive":false,"fullPath":false}').subscribe((res1: any) => {
    // console.log('222222',res1);
      
        let drvrs: any = []
        res.items.forEach((element: any) => {
          drvrs.push(element.drvrs)
        });

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

        this.techoGraphData.push({ name: element.n, id: element.c, data: {}, datejoin: element.ct, joindate :  new Date(element.ct * 1000) ,phone: element.p,desc: element.ds,cardExpiry:element.jp && element.jp['Scadenza Tessera Autista']?element.jp['Scadenza Tessera Autista']:''
      ,
      dateofemp:element.jp && element.jp['Date of employment']?element.jp['Date of employment']:'',
      email:element.jp && element.jp['E-mail']?element.jp['E-mail']:'',
      Patentediguida:element.jp && element.jp['Patente di guida']?element.jp['Patente di guida']:'',
      Patenteprofessionale:element.jp && element.jp['Patente professionale']?element.jp['Patente professionale']:'',
      Scadenzacarta:element.jp && element.jp['Scadenza carta']?element.jp['Scadenza carta']:'',
      Ruolonellazienda:element.jp && element.jp['Ruolo nellazienda']?element.jp['Ruolo nellazienda']:''});
      });
    });
    

    this.techoGraphData.sort((a: any, b: any) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

    this.techoGraphData.forEach((techoGraph: any, index: any) => {
      let maxdrive = 9991618497441434
      let detailsData: any = [];
      let monthss: any = [];
      var d = new Date();
      d.setDate(1);
      for (let i = 0; i <= 11; i++) {
        monthss.push(monthName[d.getMonth()] + '-' + d.getFullYear())
        let dateTime = Math.round(d.getTime() / 1000);
        let details = { name: null, dates: null, monthKey: monthName[d.getMonth()] + '-' + d.getFullYear(), colorcode: techoGraph.datejoin > dateTime ? 'gray' : 'red' };
        detailsData.push(details);
        d.setMonth(d.getMonth() - 1);
      }

      fileDetails.forEach((data: any) => {
        let driverdata = String(data.n).split("_")[0];
        if (driverdata.indexOf(techoGraph.id) >= 0) {
          var d = new Date(data.ct * 1000);
          let podindex = monthss.indexOf(monthName[d.getMonth()] + '-' + d.getFullYear());
          if (podindex > -1) {
            detailsData[podindex].name = data.n;
            detailsData[podindex].dates = data.ct;
            detailsData[podindex].colorcode = 'green';
            if (data.ct < maxdrive) {
              maxdrive = data.ct;
            }
          }
        }
      });

      let setCode = 0;
      detailsData.forEach((element:any, pos:any) => {
        if (maxdrive != 9991618497441434) {
          if (element.colorcode == 'green') {
            setCode = 1;
          }
  
          if (setCode && element.colorcode != 'green') {
            detailsData[pos].colorcode = 'red';
          }
        }
      });
     
      this.techoGraphData[index].data = detailsData;
      this.monthss = monthss;
    });
    console.log(this.techoGraphData)
    this.showPage = true;

  }

  downloadFile(fileName: any) {
    let sessionID = this.sessionID;
    window.open('https://hst-api.wialon.com/wialon/ajax.html?svc=file/get&sid=' + sessionID + '&params={"itemId":' + this.itemID + ',"storageType":2,"path":"/tachograph/' + fileName + '","format":"1"}')
    // window.open('https://hst-api.wialon.com/wialon/ajax.html?svc=file/get&params={"itemId":'+sessionID +',"storageType":2,"path":"/' + fileName + '","format":"1"}')
    // this.http.get('https://hst-api.wialon.com/wialon/ajax.html?svc=file/get&sid=' + sessionID + '&params={"itemId":'+this.itemID +',"storageType":2,"path":"/tachograph/' + fileName + '","format":"1"}', { responseType: 'blob' }).subscribe((res1: any) => {
    //   var objectUrl = URL.createObjectURL(res1);
    //   var a = document.createElement('a');
    //   document.body.appendChild(a);
    //   a.href = objectUrl;
    //   a.download = fileName
    //   a.click();
    //   a.remove();
    // })
  }

  openModal(e:any, modalTitle:any, modalText:any) {

    e.preventDefault();
    this.modalService.setRootViewContainerRef(this.viewContainerRef);
    this.modalService.addDynamicComponent(modalTitle, modalText);
  }
}
