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
          <h1>{{ totalGbUsed }}</h1>
          <span id="gb-used">Gb used</span>
        </div>
        <p>Franchise storage utilised</p>
      </div>
    </div>

    <div class="table-responsive stats-table">
      <table
        id="sites-table"
        class="ui celled table display"
        style="width: 100%"
      >
        <thead>
          <tr>
            <th v-for="(header, index) in headers" :key="index">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!--
          <tr v-for="item in representedSiteList" :key="item.id">
            <td>
              <a :href="item.URL">{{ item.Title }}</a>
            </td>
            <td v-if="item.dateDiff <= minDay">
              OK - using Franchise site
            </td>
            <td v-else-if="item.dateDiff >= maxDay">
              Urgent - No activity at risk
            </td>
            <td v-else-if="item.dateDiff > minDay && item.dateDiff < maxDay">
              Needs attention, inactive last {{ item.dateDiff }} days
            </td>
            <td>{{ item.storageUsed }} Gb</td>
          </tr>
          -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import $ from "jquery";
import axios from "axios";
import moment from "moment-timezone";
import "datatables.net";
import "datatables.net-se";
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

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
      counter: 0,
      firstName: "Burak",
      lastName: "Seyhan",
      configList: [],
      representedSiteList: [],
      documentItemsList: [],
      headers: ["Franchise", "Status", "Storage Utilised"],
      numberOfActiveFranchiseSites: 0,
      numberOfInactiveFranchiseSites: 0,
      numberOfNonUsedLast30DaysFranchiseSites: 0,
      minDay: 2,
      maxDay: 4,
      totalGbUsed: 0,
      dataTable: null
    };
  },
  methods: {
    formattedToday: function() {
      let today = new Date().toUTCString();
      let formattedToday = moment(today);
      return formattedToday;
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
        let dateDifference = this.calculateDateDifference(a.Modified);
        if (siteStatus === "Active") return dateDifference <= minDay;
        if (siteStatus === "Inactive") return dateDifference >= maxDay;
        if (siteStatus === "Non-used")
          return dateDifference > minDay && dateDifference < maxDay;
      });
      let numberFranchiseSites = franchiseSites.length;
      return numberFranchiseSites;
    },
    getItems: async function() {
      const web = Web(`${this.rootURL}/sites/product-demos/franchise-hq-demo`);
      const configList = await web.lists
        .getByTitle("Config - Franchise Stats")
        .items.get();

      console.log("List :>> ", configList);
      this.configList = [...configList];

      let siteList = {
        Title: "",
        URL: "",
        dateDiff: "",
        storageUsed: 0
      };
      let representedSiteList = [];

      // Set necessary table values to a new representedSiteList array
      [...configList].map(c => {
        siteList.Title = c.Title;
        siteList.URL = c.URL;
        siteList.dateDiff = this.calculateDateDifference(c.Modified);
        console.log(
          "this.calculateDateDifference(c.Modified):>> ",
          this.calculateDateDifference(c.Modified)
        );
        representedSiteList.push({ ...siteList });
      });
      console.log("this.siteList :>> ", representedSiteList);

      // This is for vue table - not used
      this.representedSiteList = representedSiteList;

      // Set number of active Franchise Sites
      this.numberOfActiveFranchiseSites = this.calculateNumberOfFranchiseSites(
        configList,
        "Active"
      );
      // Set number of inactive Franchise Sites
      this.numberOfInactiveFranchiseSites = this.calculateNumberOfFranchiseSites(
        configList,
        "Inactive"
      );
      // Set number of non-used Last 30 days Franchise Sites
      this.numberOfNonUsedLast30DaysFranchiseSites = this.calculateNumberOfFranchiseSites(
        configList,
        "Non-used"
      );

      // Initialize the datatable - any is for preventing 'Property does not exist' error
      // This is the solution reference - https://stackoverflow.com/questions/24984014/how-can-i-stop-property-does-not-exist-on-type-jquery-syntax-errors-when-using
      this.dataTable = ($("#sites-table") as any).DataTable();
      // Populate the datatable rows
      representedSiteList.map(item => {
        if (item.dateDiff <= this.minDay) {
          this.dataTable.row
            .add([
              '<a id="site-title" href="#">' + item.Title + "</a>",
              "OK - using Franchise site",
              item.storageUsed + " Gb"
            ])
            .draw(false);
        }
        if (item.dateDiff >= this.maxDay) {
          this.dataTable.row
            .add([
              '<a id="site-title" href="#">' + item.Title + "</a>",
              "Urgent - No activity at risk",
              item.storageUsed + " Gb"
            ])
            .draw(false);
        }
        if (item.dateDiff > this.minDay && item.dateDiff < this.maxDay) {
          this.dataTable.row
            .add([
              '<a id="site-title" href="#">' + item.Title + "</a>",
              "Urgent - No activity at risk",
              item.storageUsed + " Gb"
            ])
            .draw(false);
        }
        $("#site-title").attr("href", `${item.URL}`);
      });

      // Set all document items excluding folders to allFiles array
      let documentItemsList = [];
      let allFiles = [];
      for (let a of configList) {
        const webFranchise = Web(a.URL);

        const documentItems = await webFranchise.lists
          .getByTitle("Documents")
          .items.get();

        documentItemsList = [...documentItems].filter(
          item => item.FileSystemObjectType !== 1
        );
        console.log("documentItemsList :>> ", documentItemsList);

        for (let i = 0; i < documentItemsList.length; i++) {
          allFiles.push(documentItemsList[i]);
        }
      }
      console.log("allFiles :>> ", allFiles);
    }
  },
  mounted() {
    console.log("mounted...");
    // Initialize moment.js library
    moment().format();
    // Call getItems function
    this.getItems();
  },
  created() {
    console.log("created...");

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
