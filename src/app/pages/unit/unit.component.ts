import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalService } from 'src/app/modal/modal.service';


@Component({
  selector: 'app-profile',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {


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
  unit_hash = new Map();
  unit_data:any = {};
  erro_count_hash  = new Map();

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
                                                  //https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={"spec":{"itemsType":"avl_unit","propName":"sys_name","propValueMask":"*","sortType":"sys_name"},"force":1,"flags":1,"from":0,"to":0}&sid=023a6cca5cac6315101045006834e996

    this.http.get('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={"spec":{"itemsType":"avl_unit","propName":"sys_name","propValueMask":"*","sortType":"sys_name"},"force":1,"flags":1,"from":0,"to":0}&sid=' + sessionID).subscribe((res: any) => {
      //this.itemID = res.items[0].id;
        let item_array  = res.items
        let units: any = []
        res.items.forEach((element: any) => {
          units.push(element)
        });

        /***
         * 
         * Start Populate unit details data
         * 
         * ***/
        units.forEach((element: any) => {
          this.techoGraphData.push({
            name: element.nm, id: element.id, data: {}, 
          });
        });
        this.techoGraphData.sort((a: any, b: any) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        
        /***
         * 
         * End Populate unit details data
         * 
         * ***/ 
        /***  create unit data hash */
            this.techoGraphData.forEach((techoGraph: any, index: any) => {
              this.unit_hash.set(techoGraph.id,techoGraph.name)
            })
       //     console.log(this.unit_hash)
        /***  create driver data hash */
      
        item_array.forEach((item: any, index: any) => {
          let item_id = item.id
         // console.log('item id',item_id)
          this.http.get('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=file/list&sid=' + sessionID + '&params={"itemId":' + item_id + ',"storageType":2,"path":"/tachograph","mask":"*","recursive":false,"fullPath":false}').subscribe((res1: any) => {
            this.doProcessData(item_id,res1);
            let unitData = this.doPopulateData(item_id);
            this.doPopulateToFront(item_id,index,unitData)
           // console.log('len',item_array.length,'index',index)
            if(item_array.length== (index+1))
                this.doPopulateHeader()

          })//end second api
   
        })//end foreach

    })//end first api
  }
  doProcessData( unit_id:any,fileDetails: any) {

      console.log(unit_id,this.unit_hash.get(unit_id),'files:',fileDetails.length)
      let Date1 = new Date();
      fileDetails.forEach((data: any) => {
        if(unit_id in this.unit_data ==false)
            this.unit_data[unit_id] =new Array();

            let data1 = { month:"",date: Date1.getDate(),  filepresent: false, name: '', dates: '',ct:'', mt: '', colorcode: 'gray'  }
            data1.name = data.n;
            data1.mt = data.mt;
            data1.ct = data.ct;
            let mt_tmp= new Date( data.mt*1000)

            //console.log( data1.mt,mt_tmp.getDate(),mt_tmp.getMonth(),mt_tmp.getFullYear())
            this.unit_data[unit_id].push(data1)

        });//end  loop
        
      
    } //end doProcessData()
    /***
     * 
     * End Populate unit details data
     * 
     * ***/
    doPopulateData(unit_id:any){
      var monthName = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

      let maxdrive = 9991618497441434
      let unitData1: any = [];
      this.header = [];
       let cM = -1;
      let inde = 0;
      this.header1 = [{ count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }, { count: 0,  month: '' ,year:'' }];
       for (let index = 0; index <= 365; index++) {
        let oldDate = new Date();
        let newdate = new Date(oldDate);
        newdate.setDate(oldDate.getDate() - index);
        let dateTime = Math.round(newdate.getTime() / 1000);
         let data1 = { id:unit_id,month: monthName[newdate.getMonth()], date: newdate.getDate(), filepresent: false, name: '',ct:'',mt:'', dates: '', colorcode: 'gray' }
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
        console.log(this.unit_data[unit_id])
        for (let key in this.unit_data[unit_id]){
          let dobj = this.unit_data[unit_id][key];
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
       
        unitData1.push(data1)

      }//end 365 days loop
      unitData1.reverse();
      let setCode = 0;
      let errorCount=0
      let Datecount = 0;
      unitData1.forEach((element: any, pos: any) => {
        if (maxdrive != 9991618497441434) {
          if (element.colorcode == 'green') {
            Datecount = 0;
            setCode = 1;
          }

          if (setCode && element.colorcode != 'green') {
            Datecount++;
            unitData1[pos].colorcode = 'red';
            
            if (Datecount > 60 && Datecount <= 90) {
              unitData1[pos].colorcode = 'yellow';
            }
            if (Datecount == 91){
              errorCount++
            }
            if (Datecount <= 60) {
              unitData1[pos].colorcode = 'nocolor';
            }
          }
        } else {
          if (element.colorcode == 'blue') {
            Datecount = 0;
            setCode = 1;
          }
          if (setCode) {
            Datecount++;
            if (Datecount > 60 && Datecount <= 90) {
              unitData1[pos].colorcode = 'yellow';
            }
            if (Datecount <= 60) {
              unitData1[pos].colorcode = 'nocolor';
            }
          }
        }
      });//end unitData1
      //this.erro_count_array[]=errorCount
      this.erro_count_hash.set(unit_id,errorCount)
      return unitData1
    }
    doPopulateToFront(unit_id:any,index:any,unitData1:any){
      this.techoGraphData[index].data = unitData1;
      this.techoGraphData[index].errorCount = this.erro_count_hash.get(unit_id);
    }  

    doPopulateHeader(){
      this.showPage = true; 
      for (let i = this.header1.length-1; i>=0; i--) {
                this.header1Rev.push(this.header1[i])
      }
  
      for (let j = this.header.length-1; j>=0; j--) {
        this.headerRev.push(this.header[j])
      }
    }
  

  downloadFile(item_id:any,fileName: any) {
    let sessionID = this.sessionID;
    window.open('https://hst-api.wialon.com/wialon/ajax.html?svc=file/get&sid=' + sessionID + '&params={"itemId":' + item_id + ',"storageType":2,"path":"/tachograph/' + fileName + '","format":"1"}')

  }

  openModal(e: any, modalTitle: any, modalText: any) {

    e.preventDefault();
    this.modalService.setRootViewContainerRef(this.viewContainerRef);
    this.modalService.addDynamicComponent(modalTitle, modalText);
  }
}
