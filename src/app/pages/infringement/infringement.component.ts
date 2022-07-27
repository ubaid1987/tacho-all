import { Component, OnInit ,ViewContainerRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
  import { ModalService } from 'src/app/modal/modal.service';

@Component({
  selector: 'app-infringement',
  templateUrl: './infringement.component.html',
  styleUrls: ['./infringement.component.scss']
})
export class InfringementComponent implements OnInit {
  itemID = 0;
  reportID=0
  drivergroupID=0
  sessionID = '';
  rows=0
  docs: any = []
  totalRecords=-1
  drivers_data:any={}
  infrigngementData=[]
  api_fld_acc='Account'
  api_fld_com='Company'
  api_fld_ins='Inspecter'
  api_fld_site='Site'
  account_name=''
  company_name=''
  inspecter_name=''
  site_name=''
  

 
description_data:any={}
  

  
  constructor(public http: HttpClient, private sanitizer: DomSanitizer, private modalService: ModalService,
    private viewContainerRef: ViewContainerRef) {
    const queryParams = window.location.search;
    const searchParams = new URLSearchParams(queryParams);
    let sid: any = searchParams.get('sid');
    //let user: any = searchParams.get('user');

    if (!sid) {
      sid = searchParams.get('?sid');
    //  sid = searchParams.get('user');
    }
    if (!sid) {
      sid = sessionStorage.getItem('sid');
    }

    if (typeof (Storage) !== 'undefined') {
      // Store
      sessionStorage.setItem('sid', sid);
    }
    this.sessionID = sid ? sid : sessionStorage.getItem('sid');
  
  
    this.description_data['Exceeded daily driving time of 9 h']= 'https://topfly.pro/wp-content/uploads/2022/04/Exceeded-daily-driving-time-of-9-h.png'
    this.description_data['Exceeded extended daily driving time of 10 h']='https://topfly.pro/wp-content/uploads/2022/04/Exceeded-extended-daily-driving-time-of-10-h-.png'
    this.description_data['Exceeded weekly driving time of 56 h']='https://topfly.pro/wp-content/uploads/2022/04/Exceeded-weekly-driving-time-of-56-h-.png'
    this.description_data['Exceeded accumulated two-week driving time of 90 h']='https://topfly.pro/wp-content/uploads/2022/04/Exceeded-accumulated-two-week-driving-time-of-90-h- .png'
    this.description_data['Exceeded uninterrupted driving time of 4 h 30 min']='https://topfly.pro/wp-content/uploads/2022/04/Exceeded-uninterrupted-driving-time-of-4-h-30-min-.png'
    this.description_data['Insufficient daily rest period of less than 11 h']='https://topfly.pro/wp-content/uploads/2022/04/Insufficient-daily-rest-period-of-less-than-11-h-.png'
    this.description_data['Insufficient reduced daily rest period of less than 9 h']='https://topfly.pro/wp-content/uploads/2022/04/Insufficient-reduced-daily-rest-period-of-less-than-9-h-.png'
    this.description_data['Insufficient split daily rest period of less than 3 h + 9h']='https://topfly.pro/wp-content/uploads/2022/04/Insufficient-split-daily-rest-period-of-less-than-3-h-9-h-.png'
    this.description_data['Insufficient weekly rest period of less than 45 h']='https://topfly.pro/wp-content/uploads/2022/04/Insufficient-weekly-rest-period-of-less-than-45-h.png'
    this.description_data['Insufficient reduced weekly rest period of less than 24 h']='https://topfly.pro/wp-content/uploads/2022/04/Insufficient-reduced-weekly-rest-period-of-less-than-24-h-.png'
    this.description_data['Insufficient daily rest period of less than 9 h for crew']='https://topfly.pro/wp-content/uploads/2022/04/Insufficient-reduced-daily-rest-period-of-less-than-9-h-.png'
     
  }



  ngOnInit() {
   
        let sessionID = this.sessionID;
        /**
         * Get Item ID
         */
        this.http.get('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={"spec":{"itemsType":"avl_resource","propName":"","propValueMask":"","sortType":""},"force":1,"flags":8465,"from":0,"to":0}&sid=' + sessionID).subscribe((res0: any) => {
          this.itemID  = res0.items[0].id;
           /**
           * Get Report ID
           */
          this.http.get('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={\"spec\":{\"itemsType\":\"avl_resource\",\"propType\":\"propitemname\",\"propName\":\"reporttemplates\",\"propValueMask\":\"*\",\"sortType\":\"reporttemplates\"},\"force\":1,\"flags\":8192,\"from\":0,\"to\":0}&sid=' + sessionID).subscribe((res1: any) => {
                //console.log('report template',res1)
                res1.items.forEach((element_rep: any) => {
                  let rep = element_rep.rep;
                  Object.keys(rep).forEach((key1: any) => {
                      if(rep[key1].n=='Infringements'){
                        this.reportID=rep[key1].id
                      }
                  } )
                })
                 /**
                 * Get driver group ID
                 */
                this.http.get('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={\"spec\":{\"itemsType\":\"avl_resource\",\"propType\":\"propitemname\",\"propName\":\"driver_groups\",\"propValueMask\":\"*\",\"sortType\":\"driver_groups\"},\"force\":1,\"flags\":32768,\"from\":0,\"to\":0}&sid=' + sessionID).subscribe((res2: any) => {
                      res2.items.forEach((element_drvrsgroup: any) => {
                      // this.http.get('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=file/list&sid=' + sessionID + '&params={"itemId":' + this.itemID + ',"storageType":2,"path":"/tachograph","mask":"*","recursive":false,"fullPath":false}').subscribe((res3: any) => {
                      //  let drv_list = res3.items[0].drvrs
                      //  Object.keys(drv_list).forEach((element: any) => {
                        
                      //     //element.drvrs
                      //   })
                      // })
                      // //drivers_data
                      
                        let drvrsgr = element_drvrsgroup.drvrsgr;
                        Object.keys(drvrsgr).forEach((key1: any) => {
                          if(drvrsgr[key1].n=='All Drivers'){
                            this.drivergroupID=drvrsgr[key1].id
                                  this.generateDriversReport();

                          }
                        })    
                    })
                
              })//end drivergroup id
          }) //end Report Id
        }) //END ITEM ID
       
        // })
   
    }
    generateDriversReport(){
      var formData0: any = new FormData();
      formData0.append('params','{"params":[{"svc":"report/cleanup_result","params":{}},{"svc":"report/cleanup_result","params":{}},{"svc":"report/get_report_data","params":{"itemId":'+this.itemID+',"col":["8"],"flags":0}}],"flags":0}');
      formData0.append('sid', this.sessionID);
      this.http.post('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=core/batch&sid=' + this.sessionID, formData0).subscribe((res0: any) => {
        var formData0: any = new FormData();
         formData0.append('params','{"reportResourceId":'+this.itemID+',"reportTemplateId":'+this.reportID+',"reportTemplate":null,"reportObjectId":'+this.itemID+',"reportObjectSecId":"'+this.drivergroupID+'","interval":{"flags":16777256,"from":0,"to":12},"remoteExec":1}');
         formData0.append('sid', this.sessionID);
         this.http.post('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=report/exec_report&sid=' + this.sessionID, formData0).subscribe((res0: any) => {
                var formData0: any = new FormData();
                formData0.append('params','{}');
                formData0.append('sid', this.sessionID);
                this.http.post('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=report/get_report_status&sid=' + this.sessionID, formData0).subscribe((res0: any) => {
                      var formData0: any = new FormData();
                      formData0.append('params','{}');
                      formData0.append('sid', this.sessionID);
                      this.http.post('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=report/apply_report_result&sid=' + this.sessionID, formData0).subscribe((res_rows: any) => {
                        var res_rows_obj = res_rows.reportResult.tables

                        res_rows_obj.forEach((item: any) => {
                          if (item.hasOwnProperty('rows') && item.hasOwnProperty('rows')>0 ){
                            this.rows = item.rows;
                          }
                        })
                      
                      
                            var formData0: any = new FormData();
                            formData0.append('params','{"tableIndex":0,"config":{"type":"range","data":{"from":0,"to":'+this.rows+',"level":0,"unitInfo":1}}}');
                            formData0.append('sid', this.sessionID);
                            this.http.post('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=report/select_result_rows&sid=' + this.sessionID, formData0).subscribe((res_: any) => {
                              this.getDriverFields(res_);
                              //console.log(res_)

                                    
                            })
                              
                      })
                  
                        
                })
                
         })
    
      })
      
    }
    getDriverFields(res_:any){

      let sessionID = this.sessionID;
      this.http.get('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={\"spec\":{\"itemsType\":\"user\",\"propName\":\"sys_name\",\"propValueMask\":\"Customer Document*\",\"sortType\":\"sys_name\"},\"force\":1,\"flags\":1,\"from\":0,\"to\":0}&sid=' + sessionID).subscribe((users: any) => {
            if(users.items.length >0){
              this.http.get('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params={\"spec\":{\"itemsType\":\"avl_resource\","propType":"propitemname","propName":"drivers","propValueMask":"*","sortType":"drivers"},"force":1,"flags":256,"from":0,"to":0}&sid=' + sessionID).subscribe((res3: any) => {
                      let drv_tmp = res3.items[0].drvrs
                      Object.keys(drv_tmp).forEach((element1: any) => {
                                
                            if (this.drivers_data.hasOwnProperty(drv_tmp[element1].n)) {
                              this.drivers_data[drv_tmp[element1].n+'_'+drv_tmp[element1].c]=drv_tmp[element1].c
                            }else{
                              this.drivers_data[drv_tmp[element1].n]=drv_tmp[element1].c
                          }
                      })
                      console.log(this.drivers_data)
                      const account_id= users.items[0].id 
                      const flag1 = 4294967295  
                      var formData0: any = new FormData();
                      formData0.append('params','{\"id\":'+account_id+',\"flags\":'+flag1+'}');
                      formData0.append('sid', this.sessionID);
                      this.http.post('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_item&sid=' + this.sessionID, formData0).subscribe((res0: any) => {
                          console.log(res0.item.flds)
                          const customer_fields = res0.item.flds
                
                          Object.keys(customer_fields).forEach((key1: any) => {
                            let fld_val = customer_fields[key1].v
                            let fld_name = customer_fields[key1].n
                            console.log( fld_name, this.api_fld_acc, fld_val)

                            switch (fld_name){
                              case this.api_fld_acc:
                                this.account_name=fld_val;
                                break;
                              case this.api_fld_com:
                                this.company_name=fld_val;
                                break;
                              case this.api_fld_ins:
                                this.inspecter_name=fld_val;
                                break;
                              case this.api_fld_site:
                                this.site_name=fld_val;
                                break;
                            }

                        })
                        this.doProcessData(res_) 


                })

                })
            }
      })
    }
    doProcessData(res: any) {
      let sessionID = this.sessionID;
      res.forEach((item: any) => {
        let doc1:any={account_name:'',company_name:'',inspecter_name:'',site_name:'',driver_name:'',driver_date:'',driver_time:'',driver_description:'',driver_description_image:''}
        let dt:any = item.c[0]
        dt = dt.split(" ")
      
        doc1.driver_name= item.c[1]
        doc1.driver_date = dt[0]
        doc1.driver_time = dt[1]
        doc1.driver_card = this.drivers_data[doc1.driver_name]
        doc1.driver_description= item.c[3]
        doc1.driver_description_image= this.description_data[item.c[3]]
       
        doc1.account_name=this.account_name
        doc1.company_name=this.company_name
        doc1.inspecter_name=this.inspecter_name
        doc1.site_name=this.site_name
        
        this.docs.push(doc1)
       console.log(doc1)
        this.totalRecords = this.docs.length
      });


    }
    
    openModal(e:any, modalTitle:any, modalText:any) {

      e.preventDefault();
      this.modalService.setRootViewContainerRef(this.viewContainerRef);
      this.modalService.addDynamicComponent(modalTitle, modalText);
    }
    
}
