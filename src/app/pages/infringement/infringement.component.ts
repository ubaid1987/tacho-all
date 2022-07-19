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
  totalRecords=0
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
                      //console.log('driver groups',res2)
                      res2.items.forEach((element_drvrsgroup: any) => {
                        let drvrsgr = element_drvrsgroup.drvrsgr;
                        Object.keys(drvrsgr).forEach((key1: any) => {
                          if(drvrsgr[key1].n=='All Drivers'){
                            this.drivergroupID=drvrsgr[key1].id
                            //console.log('driver group',this.drivergroupId)
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
      //params:{"params":[{"svc":"report/cleanup_result","params":{}},{"svc":"report/cleanup_result","params":{}},{"svc":"report/get_report_data","params":{"itemId":23080205,"col":["8"],"flags":0}}],"flags":0}

      formData0.append('params','{"params":[{"svc":"report/cleanup_result","params":{}},{"svc":"report/cleanup_result","params":{}},{"svc":"report/get_report_data","params":{"itemId":'+this.itemID+',"col":["8"],"flags":0}}],"flags":0}');
      formData0.append('sid', this.sessionID);
      this.http.post('https://wialonapp.herokuapp.com/https://hst-api.wialon.com/wialon/ajax.html?svc=core/batch&sid=' + this.sessionID, formData0).subscribe((res0: any) => {
        var formData0: any = new FormData();
        // params: {"reportResourceId":23080205,"reportTemplateId":8,"reportTemplate":null,"reportObjectId":23080205,"reportObjectSecId":"2","interval":{"flags":16777220,"from":0,"to":4},"remoteExec":1}
         formData0.append('params','{"reportResourceId":'+this.itemID+',"reportTemplateId":'+this.reportID+',"reportTemplate":null,"reportObjectId":'+this.itemID+',"reportObjectSecId":"'+this.drivergroupID+'","interval":{"flags":16777256,"from":0,"to":2},"remoteExec":1}');
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
                              this.doProcessData(res_) 
                                    
                            })
                              
                      })
                  
                        
                })
                
         })
    
      })
      
    }
    doProcessData(res: any) {
      let sessionID = this.sessionID;

      res.forEach((item: any) => {
        let doc1:any={driver_name:'',driver_date:'',driver_time:'',driver_description:''}
        let dt:any = item.c[0]
        console.log(dt)
        dt = dt.split(" ")

        doc1.driver_name= item.c[1]
        doc1.driver_date = dt[0]
        doc1.driver_time = dt[1]
        
        doc1.driver_description= item.c[3]
        
        this.docs.push(doc1)

        this.totalRecords = this.docs.length
      });


    }
}
