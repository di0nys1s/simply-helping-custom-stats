<template>
  <div class="container">
    <!--<h1>Hello {{ userName }}</h1>-->
    <h1>{{ header }}</h1>
    <div class="box-container">
      <div class="box box-1">
        <h1>{{ numberOfActiveFranchiseSites }}</h1>
        <p>Active Franchise sites</p>
      </div>
      <div class="box box-2">
        <h1>{{ numberOfInactiveFranchiseSites }}</h1>
        <p>Inactive Franchise Sites</p>
      </div>
      <div class="box box-3">
        <h1>{{ numberOfNonUsedLast30DaysFranchiseSites }}</h1>
        <p>Non-use last {{ minDay }} days</p>
      </div>
      <div class="box box-4">
        <div class="storage-info-container">
          <h1>{{ totalStorageUtilised }}</h1>
          <span id="gb-used">Gb used</span>
        </div>
        <p>Franchise storage utilised</p>
      </div>
    </div>

    <div class="table-responsive stats-table">
      <table
        id="sites-table"
        class="ui celled table display nowrap"
        style="width: 100%"
      >
        <thead>
          <tr>
            <th v-for="(header, index) in headers" :key="index">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import $, { data } from "jquery";
import moment from "moment-timezone";
import axios from "axios";
import "datatables.net";
import "datatables.net-se";
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/views";
import "@pnp/sp/fields";
import "@pnp/sp/files/web";

export default Vue.extend({
  name: "Franchise Site Activity Report",
  props: {
    userName: String,
    rootURL: String,
    header: String
  },
  data() {
    return {
      welcome: "Welcome to Simply Helping Site Stats",
      documentItemsList: [],
      headers: ["Franchise", "Status", "Storage Utilised"],
      numberOfActiveFranchiseSites: 0,
      numberOfInactiveFranchiseSites: 0,
      numberOfNonUsedLast30DaysFranchiseSites: 0,
      minDay: 30,
      maxDay: 60,
      dataTable: null,
      totalStorageUtilised: 0
    };
  },
  methods: {
    formattedToday: function() {
      let today = new Date().toUTCString();
      let formattedToday = moment(today);
      return formattedToday;
    },
    /*
    formatTitleToUrlTitle: function(title) {
      const urlTitle = title
        .split(" ")
        .join("-")
        .toLowerCase();
      return urlTitle;
    },
    */
    formatTitleToSimplyHelpingCustomUrlTitle: function(title) {
      const splittedTitle = title.split("-");
      
      let titleArray = [];
      for(let i = 0; i < splittedTitle.length; i++) {
        if(splittedTitle.length === 1) {
          titleArray.push(splittedTitle[i].substring(0, 3).toUpperCase());
        } else {
          titleArray.push(splittedTitle[i].charAt(0));
        }
      }

      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      let urlTitle = titleArray.reduce(reducer) + 'HomePage'
      // console.log('urlTitle :>> ', urlTitle);
      
      return urlTitle;
    },
    calculateDateDifference: function(modifiedDate) {
      let franchiseSiteUpdatedDate = moment(modifiedDate);
      let dateDifference = this.formattedToday().diff(
        franchiseSiteUpdatedDate,
        "days"
      );
      return dateDifference;
    },
    calculateNumberOfFranchiseSites: function(siteList, siteStatus) {
      const minDay = this.minDay;
      const maxDay = this.maxDay;

      let franchiseSites = [...siteList].filter(a => {
        let dateDifference = a.dateDiff;
        if (siteStatus === "Active") return dateDifference <= minDay;
        if (siteStatus === "Inactive") return dateDifference >= maxDay;
        if (siteStatus === "Non-used")
          return dateDifference > minDay && dateDifference < maxDay;
      });
      let numberFranchiseSites = franchiseSites.length;
      return numberFranchiseSites;
    },
    calculateStorage: function(item, size) {
      item.storageUtilised =
        parseFloat(item.storageUtilised) / size;
      item.storageUtilised = (
        Math.round(item.storageUtilised * 100) / 100
      ).toFixed(2);
      return item.storageUtilised;
    },
    getItems: async function() {
      
      /*
      const absoluteURL = this.rootURL;
      const parentURLextension = "/sites/product-demos/franchise-hq-demo/";
      const parentURLextension = "/";
      const parentURL = absoluteURL + parentURLextension;
      */
      const parentURL = 'https://simplyhelpingcomau.sharepoint.com/sites/HeadOfficeHub'
      const parentURLSub = 'https://simplyhelpingcomau.sharepoint.com/sites/'
      const franchiseStatsTitle = "Config - Franchise Stats";
      const billion = 1000000000;
      const million = 1000000;

      const web = Web(`${parentURL}`);
      const configList = await web.lists
        .getByTitle(`${franchiseStatsTitle}`)
        .items.get();

      console.log("configList :>> ", configList);

      let siteList = {
        Title: "",
        URL: "",
        latestModified: [],
        dateDiff: "",
        documents: {},
        documentStatus: "",
        storageUsed: [],
        storageUtilised: 0,
        siteStorageUsedIndex: 0,
      };

      let representedSiteList = [];
      let latestModifiedDocDate = [];
      let storageUtilised = 0;
      // Set necessary table values to a new representedSiteList array
      for (let c of [...configList]) {
        const web2 = Web(`${c.URL}`);
        const siteDocumentList = await web2.lists
          .getByTitle("Documents")
          .items.get();


        console.log('Title => ', c.Title);
        console.log('siteDocumentList.length :>> ', siteDocumentList.length);

        // FileSystemObjectType === 1 ? Document is Folder : Document is File
        const documentItemsList = [...siteDocumentList].filter(
          item => item.FileSystemObjectType !== 1
        );

        // console.log('mySiteDocumentList :>> ', siteDocumentList.map(item => item.FileSystemObjectType));

        // Get all the documents list of the particular site
        // Get the last item in the array which gives the latest modified doc
        latestModifiedDocDate = documentItemsList.map(s => s.Modified).pop()

        // console.log('di0nys1s789 :>> ', documentItemsList);

        const formattedTitle = this.formatTitleToSimplyHelpingCustomUrlTitle(c.Title);
        const documentURL = `${parentURLSub + formattedTitle}/_api/web/getFolderByServerRelativeUrl(%27Shared%20Documents%27)?$select=StorageMetrics&$expand=StorageMetrics`;
        // console.log('documentURL :>> ', documentURL);

        try {
          await $.ajax({
            url: documentURL,
            type: "GET",
            async: true,
            dataType: "json",
            success: function(res) {
              // console.log("res :>> ", res.StorageMetrics.TotalFileStreamSize);
              const fileSize = parseInt(res.StorageMetrics.TotalFileStreamSize);
              storageUtilised = fileSize;
            }
          });
        } catch (error) {
          console.error(error);
        }

        console.log("storageUtilised :>> ", storageUtilised);

        // Fill the siteList object with necessary site data
        siteList.Title = c.Title;
        siteList.URL = c.URL;
        siteList.latestModified = latestModifiedDocDate;
        siteList.documentStatus =
          latestModifiedDocDate == undefined ? "No Document" : "Document exist";
        siteList.dateDiff =
          latestModifiedDocDate == undefined
            ? this.maxDay + 1
            : this.calculateDateDifference(latestModifiedDocDate);
        siteList.documents = documentItemsList;
        siteList.storageUtilised = storageUtilised;
        siteList.storageUsed.push(storageUtilised);

        // Fill the representedSiteList array with all the site objects
        representedSiteList.push({ ...siteList });
      }
      // console.log("siteList.storageUsed :>> ", siteList.storageUsed);
      // console.log("representedSiteList :>> ", representedSiteList);

      this.totalStorageUtilised = siteList.storageUsed.reduce(
        (a, b) => a + b,
        0
      );
      this.totalStorageUtilised =
        parseFloat(this.totalStorageUtilised) / billion;
      this.totalStorageUtilised = (
        Math.round(this.totalStorageUtilised * 100) / 100
      ).toFixed(2);

      // Set number of active Franchise Sites
      this.numberOfActiveFranchiseSites = this.calculateNumberOfFranchiseSites(
        representedSiteList,
        "Active"
      );
      // Set number of inactive Franchise Sites
      this.numberOfInactiveFranchiseSites = this.calculateNumberOfFranchiseSites(
        representedSiteList,
        "Inactive"
      );
      // Set number of non-used Last 30 days Franchise Sites
      this.numberOfNonUsedLast30DaysFranchiseSites = this.calculateNumberOfFranchiseSites(
        representedSiteList,
        "Non-used"
      );

      // Initialize the datatable - any is for preventing 'Property does not exist' error
      // This is the solution reference - https://stackoverflow.com/questions/24984014/how-can-i-stop-property-does-not-exist-on-type-jquery-syntax-errors-when-using
      this.dataTable = ($("#sites-table") as any).DataTable();
      console.log("index", representedSiteList);
      // Populate the datatable rows
      representedSiteList.map(item => {
        let itemIndex = representedSiteList.indexOf(item);
        if (item.documentStatus === "No Document" && item.storageUtilised === 0) {
          this.dataTable.row
            .add([
              `<a id="site-title" href=${item.URL} target="_blank">` +
                item.Title +
                "</a>",
              `Attention! There is no document in the site`,
              this.calculateStorage(item, million) + " Mb"
            ])
            .draw(false);
        } else {
          if (item.dateDiff <= this.minDay) {
            this.dataTable.row
              .add([
                `<a id="site-title" href=${item.URL} target="_blank">` +
                  item.Title +
                  "</a>",
                `OK! Using site documents in the last ${this.minDay} days`,
                this.calculateStorage(item, million) + " Mb"
              ])
              .draw(false);
          }
          if (item.dateDiff >= this.maxDay) {
            this.dataTable.row
              .add([
                `<a id="site-title" href=${item.URL} target="_blank">` +
                  item.Title +
                  "</a>",
                `Urgent! No site documents activity detected in the last ${this.maxDay} days`,
                this.calculateStorage(item, million) + " Mb"
              ])
              .draw(false);
          }
          if (item.dateDiff > this.minDay && item.dateDiff < this.maxDay) {
            this.dataTable.row
              .add([
                `<a id="site-title" href=${item.URL} target="_blank">` +
                  item.Title +
                  "</a>",
                `Warning! Non-use of site documents in the last ${item.dateDiff} days`,
                this.calculateStorage(item, million) + " Mb"
              ])
              .draw(false);
          }
        }
      });

      // table rows responsiveness adjustment for mobile devices
      if ($("#sites-table").css("width") <= "500px") {
        $("#sites-table").removeClass("nowrap");
      }
    }
  },
  mounted() {
    console.log("Mounted...");
    // Initialize moment.js library
    moment().format();
    // Call getItems function
    this.getItems();



  },
  created() {
    console.log("Created...");

    var styles = [
      "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css",
      "https://cdn.datatables.net/1.10.21/css/dataTables.semanticui.min.css"
    ];
    styles.forEach(style => {
      let tag = document.createElement("link");
      tag.rel = "stylesheet";
      tag.type = "text/css";
      tag.href = style;
      document.head.appendChild(tag);

      tag.setAttribute("src", style);
      document.head.appendChild(tag);
    });
  }
});
</script>

<style scoped>
.container {
  margin: 0px auto;
  padding: 10px 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
}

@media only screen and (max-width: 700px) {
  .box-container {
    grid-template-areas:
      "box-1"
      "box-2"
      "box-3"
      "box-4";
  }
}

@media only screen and (max-width: 350px) and (min-width: 100px) {
  .box {
    width: 130px;
  }
}

@media only screen and (max-width: 500px) and (min-width: 351px) {
  .box {
    width: 200px;
  }
}

@media only screen and (min-width: 501px) and (max-width: 700px) {
  .box {
    width: 300px;
  }
}

@media only screen and (min-width: 701px) {
  .box-container {
    column-gap: 20px;
    grid-template-areas:
      "box-1 box-2"
      "box-3 box-4";
  }

  .box {
    width: 250px;
  }
}

.box-container {
  display: grid;
  align-items: center;
  justify-content: center;
  row-gap: 20px;
  margin-top: 10px;
}

.box {
  background-color: #eee;
  color: black;
  text-align: center;
  height: auto;
}

.box h1 {
  font-size: 60px;
  padding: 0;
  margin: 10px 0;
}

.box p {
  margin: 0 0 15px 0;
}

.box-1 {
  grid-area: box-1;
}
.box-2 {
  grid-area: box-2;
  background-color: #ff7a98;
}
.box-3 {
  grid-area: box-3;
  background-color: #ffb787;
}
.box-4 {
  grid-area: box-4;
}

.storage-info-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

#gb-used {
  font-size: 10px;
  margin-top: 35px;
}

.stats-table {
  margin: 30px 0 20px 15px;
}

.stats-table a {
  text-decoration: none;
}
</style>
