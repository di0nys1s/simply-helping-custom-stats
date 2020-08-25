<template>
  <div class="container">
    <div class="box-container">
      <div class="box box-1">
        <h1>10</h1>
        <p>Active Franchise sites</p>
      </div>
      <div class="box box-2">
        <h1>3</h1>
        <p>Inactive Franchise Sites</p>
      </div>
      <div class="box box-3">
        <h1>1</h1>
        <p>Non-use last 30 days</p>
      </div>
      <div class="box box-4">
        <h1>1.5<span id="gb-used">Gb used</span></h1>
        <p>Franchise storage utilised</p>
      </div>
    </div>

    <div class="table-responsive stats-table">
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col">Franchise</th>
            <th scope="col">Status</th>
            <th scope="col">Storage Utilised</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="table-warning"><a href="#">Malley</a></td>
            <td class="table-warning">Needs attention, inactive last 45 days</td>
            <td class="table-warning">0.2 Gb</td>
          </tr>
          <tr>
            <td class="table-success"><a href="#">Bayswater</a></td>
            <td class="table-success">OK - using Franchise site</td>
            <td class="table-success">0.4 Gb</td>
          </tr>
          <tr>
            <td class="table-danger"><a href="#">Brunswick</a></td>
            <td class="table-danger">Urgent - No activity at risk</td>
            <td class="table-danger">0.2 Gb</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h1>Hello {{ fullName }}</h1>
    <h3>{{ welcome }}</h3>
    <p>{{ msg }}</p>
    <p>{{ description }}</p>
    <h5>{{ counter }}</h5>
    <button class="increment" @click="incrementCounter()">Increment</button>
    <button @click="decrementCounter()">Decrement</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SimplyHelpingStatsWebPart from "../SimplyHelpingStatsWebPart";

const addStyleSheet = function(fileURL) {
  var file = document.createElement("link");
  file.rel = "stylesheet";
  file.type = "text/css";
  file.href = fileURL;
  document.head.appendChild(file);
};

const addScript = function(fileURL, defer = false) {
  var tag = document.createElement("script");
  tag.src = fileURL;
  if (defer) {
    tag.setAttribute("defer", "");
  }
  document.head.appendChild(tag);
};

addStyleSheet(
  "//stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
);
addScript("//cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js");

import jQuery from "jquery";
let $ = jQuery;

$("p").css("color", "red");

export default Vue.extend({
  name: "Hello",
  props: {
    msg: String,
    description: String
  },
  data() {
    return {
      welcome: "Welcome to Simply Helping Site Stats",
      counter: 0,
      firstName: "Burak",
      lastName: "Seyhan"
    };
  },
  methods: {
    incrementCounter() {
      this.counter++;
    },
    decrementCounter() {
      this.counter--;
    }
  },
  computed: {
    fullName: {
      get: function() {
        return this.firstName + " " + this.lastName;
      }
    }
  }
});
</script>

<!--
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

/**
 * Component's properties
 */
/*
export interface ISimplyHelpingStatsProps {
  description: string;
}
*/

/**
 * Class-component
 */
@Component
export default class SimplyHelpingStats extends Vue {
  // implements ISimplyHelpingStatsProps {
  /**
   * implementing ISimpleWebPartProps interface
   */

  @Prop() public description: string;
  @Prop() private msg!: string;
  firstName = 'Burak'
  lastName = 'Seyhan'
  counter = 0

  mounted() {
    console.log('This is mounted log');
  }

  get fullName() {
    return this.firstName +  ' ' + this.lastName;
  } 

  incrementCounter() {
    this.counter++;  
  }

}
</script>
-->

<style scoped>
.container {
  margin: 0px auto;
  padding: 10px 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
}

@media only screen and (max-width: 500px) {
  .box-container {
    grid-template-areas:
      "box-1"
      "box-2"
      "box-3"
      "box-4";
  }

  .box {
    width: 150px;
    height: auto;
  }
}

@media only screen and (min-width: 501px) {
  .box-container {
    column-gap: 20px;
    grid-template-areas:
      "box-1 box-2"
      "box-3 box-4";
  }

  .box {
    width: 250px;
    height: auto;
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

#gb-used {
  font-size: 10px;
}

.stats-table {
  margin-top: 20px;
}

.stats-table a {
  text-decoration: none;
}
</style>
