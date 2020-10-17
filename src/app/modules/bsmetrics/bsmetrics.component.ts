import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import {UserDetailModelService} from 'src/app/shared/user-detail-model.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-bsmetrics',
  templateUrl: './bsmetrics.component.html',
  styleUrls: ['./bsmetrics.component.scss']
})

export class BsmetricsComponent implements OnInit {
  yearsArray=[];
  scenarioArray=[];
  scenario=this.UserDetailModelService.getSelectedScenario();
  companyName=this.UserDetailModelService.getSelectedCompany();
  financialObj = new Map();
  progressBar:boolean;
  inputColumns = ['inMillions',  'Cash Equivalents',
  'Accounts Receivable',
  'Inventories',
  'Prepaid Expenses & Other Current Assets',
  'Total Current Assets',
  'Property Plant & Equipment',
  'Intangible Assets',
  'Goodwill' ,
  'Other Assets',
  'Total Assets',
  'Current Portion Long Term Debt',
  'Accounts Payable',
  'Accrued Liabilities',
  'Other Current Liabilities',
  'Total Current Liabilities',
  'Long Term Debt',
  'Other Liabilities',
  'Total Shareholders Equity',
  'Total Liabilities and Shareholders Equity',
  'memocheck'];
  displayedColumns: string[]=[];
  displayData: any[];
  constructor(
    private urlConfig:UrlConfigService,
    private apiService:RMIAPIsService,
    private UserDetailModelService:UserDetailModelService
  ) { }

  ngOnInit() {
   
      this.progressBar=true;
  var memocheck;
    this.apiService.getData(this.urlConfig.getBsActualsAPI()+this.companyName).subscribe((res:any)=>{
      for (let j=0; j<res.length; j++) {
        if(res[j].memocheck === 0){
          memocheck="Match";
        }
        else{
          memocheck="Not Match";
        }
      this.financialObj.set(res[j].asof,{
        "cashequivalents":res[j].cashequivalents,
        "accountsreceivable":res[j].accountsreceivable,
        "inventories" : res[j].inventories, 
        "GrossMargin":res[j].grossprofitmargin,
        "othercurrentassets":res[j].othercurrentassets,
        "totalcurrentassets" : res[j].totalcurrentassets, 
        "ppe":res[j].ppe,
        "intangibleassets":res[j].intangibleassets,
        "goodwill" : res[j].goodwill, 
        "otherassets":res[j].otherassets,
        "totalassets" : res[j].totalassets,
        "currentportionlongtermdebt":res[j].currentportionlongtermdebt,
        "accountspayable":res[j].accountspayable,
        "accruedliabilities" : res[j].accruedliabilities,
        "othercurrentliabilities" : res[j].othercurrentliabilities,
        "totalcurrentliabilities":res[j].totalcurrentliabilities,
        "longtermdebt":res[j].longtermdebt,
        "otherliabilities":res[j].otherliabilities,
        "totalshareholdersequity":res[j].totalshareholdersequity,
        "totalliabilitiesandequity":res[j].totalliabilitiesandequity,
        "memocheck":memocheck
                });
        }
    this.apiService.getData(this.urlConfig.getScenarioAPI()+this.companyName).subscribe((res:any)=>{
      this.scenarioArray=res.scenarios;
     this.UserDetailModelService.setScenarioNumber(this.scenarioArray);
      let scenarioNumber=0;
      if(res.scenarios.includes(this.scenario)){
        scenarioNumber=this.scenario;
      }
      this.apiService.getData(this.urlConfig.getBsProjectionsAPIGET()+this.companyName+"&scenario="+scenarioNumber).subscribe((res:any)=>{
        console.log("getBsProjectionsAPIGET",res);
        for (let j=0; j<res.length; j++) {
          if(res[j].memocheck === 0){
            memocheck="Match";
          }
          else{
            memocheck="Not Match";
          }
          this.financialObj.set(res[j].asof,{
            "cashequivalents":res[j].cashequivalents,
            "accountsreceivable":res[j].accountsreceivable,
            "inventories" : res[j].inventories, 
            "othercurrentassets":res[j].othercurrentassets,
            "totalcurrentassets" : res[j].totalcurrentassets, 
            "ppe":res[j].ppe,
            "intangibleassets":res[j].intangibleassets,
            "goodwill" : res[j].goodwill, 
            "otherassets":res[j].otherassets,
            "totalassets" : res[j].totalassets,
            "currentportionlongtermdebt":res[j].currentportionlongtermdebt,
            "accountspayable":res[j].accountspayable,
            "accruedliabilities" : res[j].accruedliabilities,
            "othercurrentliabilities" : res[j].othercurrentliabilities,
            "totalcurrentliabilities":res[j].totalcurrentliabilities,
            "longtermdebt":res[j].longtermdebt,
            "otherliabilities":res[j].otherliabilities,
            "totalshareholdersequity":res[j].totalshareholdersequity,
            "totalliabilitiesandequity":res[j].totalliabilitiesandequity,
            "memocheck":memocheck
          });
        }
        this.financialObj.forEach((v,k) => {
          var pushData={
            inMillions:k,
            "Cash Equivalents":v.cashequivalents,
            "Accounts Receivable":v.accountsreceivable,
            "Inventories":v.inventories,
            "Prepaid Expenses & Other Current Assets":v.othercurrentassets,
            "Total Current Assets":v.totalcurrentassets, 
            "Property Plant & Equipment":v.ppe,
            "Intangible Assets":v.intangibleassets,
            "Goodwill" : v.goodwill, 
            "Other Assets":v.otherassets,
            "Total Assets" : v.totalassets,
            "Current Portion Long Term Debt":v.currentportionlongtermdebt,
            "Accounts Payable":v.accountspayable,
            "Accrued Liabilities" : v.accruedliabilities,
            "Other Current Liabilities" : v.othercurrentliabilities,
            "Total Current Liabilities":v.totalcurrentliabilities,
            "Long Term Debt":v.longtermdebt,
            "Other Liabilities":v.otherliabilities,
            "Total Shareholders Equity":v.totalshareholdersequity,
            "Total Liabilities and Shareholders Equity":v.totalliabilitiesandequity,
            "memocheck":memocheck
          };
          ELEMENT_D.push(pushData);
      });
      this.displayedColumns = ['0'].concat(ELEMENT_D.map(x => x.inMillions.toString()));
      this.displayData = this.inputColumns.map(x => this.formatInputRow(x));
      this.progressBar=false;
        });//end of projections
      });//end of Save Scenarios
    });//end of actuals
  }
  formatInputRow(row) {
    const output = {};
    output[0] = row;
    for (let i = 0; i < ELEMENT_D.length; ++i) {
      output[ELEMENT_D[i].inMillions] = ELEMENT_D[i][row];
    }

    return output;
  }
  exportToXLSX(){}
  exportToPDF(){
    let doc = new jsPDF('l','pt'); 
  let data = [];
  ELEMENT_D.forEach(obj => {
    let arr = [];
    this.inputColumns.forEach(col => {
      arr.push(obj[col]);
      console.log(arr);
    });
    data.push(arr);
  });      
    autoTable(doc,{
      head: [this.inputColumns],
      body: data
    });
    doc.save('table.pdf')
  }
}

export interface PLElement {
  inMillions:number;
  "Cash Equivalents":number;
  "Accounts Receivable":number;
  "Inventories":number;
  "Prepaid Expenses & Other Current Assets":number;
  "Total Current Assets":number;
  "Property Plant & Equipment":number;
  "Intangible Assets":number;
  "Goodwill" :number;
  "Other Assets":number;
  "Total Assets" : number;
  "Current Portion Long Term Debt":number;
  "Accounts Payable":number;
  "Accrued Liabilities" : number;
  "Other Current Liabilities" : number;
  "Total Current Liabilities":number;
  "Long Term Debt":number;
  "Other Liabilities":number;
  "Total Shareholders Equity":number;
  "Total Liabilities and Shareholders Equity":number;
  "memocheck":string;
}
const ELEMENT_D: PLElement[] = [];