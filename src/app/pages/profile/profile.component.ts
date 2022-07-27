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

    /***
     * 
     * Start Populate drivers data 
     * 
     * ***/
     
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

    /***
     * 
     * Start Populate drivers details data
     * 
     * ***/
      var driver_hash:any = new Map();
       var driver_data:any = {};
      
      /***  create driver data hash */
      this.techoGraphData.forEach((techoGraph: any, index: any) => {
        driver_hash.set(techoGraph.id,techoGraph.datejoin)
      })
      /***  create driver data hash */
      
      let Date1 = new Date();
      let dateTime = Math.round(Date1.getTime() / 1000);
      let maxdrive = 9991618497441434
      
      fileDetails.forEach((data: any) => {
        //let driver_id = String(data.n).split("_")[0] as string;
        let driver_id:any ='' 
        let is_driver_id:any = false
        for (let [key2,value1] of driver_hash) {
          const tmp_did = String(data.n)
          const did_len = key2.length
          driver_id =   tmp_did.substring(0,did_len)
          if(driver_id==key2){
            is_driver_id=true
            //console.log('hask key',key2,'chk did',driver_id)

          }

        }
        
        //if (driver_hash.has(driver_id)) {
        if (is_driver_id==true) {
            
            if(driver_id in driver_data ==false)
              driver_data[driver_id] =new Array();
             let data1 = { month:"",date: Date1.getDate(),  filepresent: false, name: '', dates: '',ct:'', mt: '', colorcode: 'gray'  }
            data1.name = data.n;
            data1.mt = data.mt;
            data1.ct = data.ct;
            driver_data[driver_id].push(data1)
          } else{
            console.log('driverid',data.n)

          }

        });//end driver_data loop
    
     for (let [key1,value1] of driver_hash) {
          if(key1 in  driver_data ==false){
          //  let data1 = { month:"",date: Date1.getDate(),  filepresent: false, name: '', dates: '',ct:'', mt: '', colorcode: dateTime > driver_hash.get(key1) ? 'gray' : 'red' }
            let data1 = { month:"",date: Date1.getDate(),  filepresent: false, name: '', dates: '',ct:'', mt: '', colorcode:  'gray' }
            driver_data[key1] =new Array();
            driver_data[key1].push(data1)
          }
     }
    for(let val in driver_data){
      let dd= driver_data[val]
     // let dd1= [...driver_data[val]]
   
     dd.sort((a:any, b:any) => {
            return a.mt - b.mt;
          });

    }
    console.log(driver_data)
    for(let did in driver_data){
        for(let val in driver_data[did]){
          let dobj = driver_data[did][val]
          var d = new Date(dobj.mt * 1000);
          console.log(dobj.name,d.getDate(),d.getMonth(),d.getFullYear()) 

      }
    }
    /***
     * 
     * End Populate drivers details data
     * 
     * ***/
     this.techoGraphData.forEach((techoGraph: any, index: any) => {
      let maxdrive = 9991618497441434
     
      let driverData1: any = [];
      this.header = [];
       let cM = -1;
      let inde = 0;
      this.header1 = [{ count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }];
       for (let index = 0; index <= 365; index++) {
        let oldDate = new Date();
        let newdate = new Date(oldDate);
        newdate.setDate(oldDate.getDate() - index);
        let dateTime = Math.round(newdate.getTime() / 1000);
         let data1 = { month: monthName[newdate.getMonth()], date: newdate.getDate(), filepresent: false, name: '',ct:'',mt:'', dates: '', colorcode: 'gray' }
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
        
       for (let key in driver_data[techoGraph.id]){
          let dobj = driver_data[techoGraph.id][key];
          var d = new Date(dobj.mt * 1000);
         
            let cmonth = newdate.getMonth()

          if (d.getMonth() == cmonth && d.getDate() == newdate.getDate() && d.getFullYear() == newdate.getFullYear()) {
            data1.filepresent = true;
            data1.colorcode = 'green';
            data1.name = dobj.name;
            let d1 = new Date(dobj.mt *1000);
            data1.dates = String(d1.getDate())+' '+String(d1.getMonth());
            data1.filepresent = true;
            data1.colorcode = 'green';
            if (dobj.ct < maxdrive) {
              maxdrive = dobj.ct;
            } 
          }
       
        }
       
        driverData1.push(data1)

      }//end 365 days loop
      driverData1.reverse();
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
            if (Datecount > 14 && Datecount <= 27) {
              driverData1[pos].colorcode = 'yellow';
            }
            if (Datecount <= 14) {
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
            if (Datecount > 14 && Datecount <= 27) {
              driverData1[pos].colorcode = 'yellow';
            }
            if (Datecount <= 14) {
              driverData1[pos].colorcode = 'nocolor';
            }
          }
        }
      });

      

      this.techoGraphData[index].data = driverData1;
      // console.log('driverData1',driverData1)
    });//end driver loop

    /***
     * 
     * End Populate drivers data
     * 
     * ***/

    // console.log('techoGraphData',this.techoGraphData)
    this.showPage = true; 
    for (let i = this.header1.length-1; i>=0; i--) {
              this.header1Rev.push(this.header1[i])
    }
//console.log('header1', this.header1)

    for (let j = this.header.length-1; j>=0; j--) {
      this.headerRev.push(this.header[j])
}
// console.log('header', this.header)



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
