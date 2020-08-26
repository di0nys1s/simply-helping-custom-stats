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
        <div class="storage-info-container">
          <h1>1.5</h1>
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
            <th>Franchise</th>
            <th>Status</th>
            <th>Storage Utilised</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="#">Malley</a></td>
            <td>
              Needs attention, inactive last 45 days
            </td>
            <td>0.2 Gb</td>
          </tr>
          <tr>
            <td><a href="#">Bayswater</a></td>
            <td>OK - using Franchise site</td>
            <td>0.4 Gb</td>
          </tr>
          <tr>
            <td><a href="#">Brunswick</a></td>
            <td>Urgent - No activity at risk</td>
            <td>0.2 Gb</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!--
    <h1>Hello {{ fullName }}</h1>
    <h3>{{ welcome }}</h3>
    <p>{{ msg }}</p>
    <p>{{ description }}</p>
    <h5>{{ counter }}</h5>
    <button class="increment" @click="incrementCounter()">Increment</button>
    <button @click="decrementCounter()">Decrement</button>
    -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import $ from "jquery";
import "datatables.net";
import "datatables.net-se";

export default Vue.extend({
  name: "Hello",
  props: {
    msg: String,
    description: String,
    site: String
  },
  data() {
    return {
      welcome: "Welcome to Simply Helping Site Stats",
      counter: 0,
      firstName: "Burak",
      lastName: "Seyhan"
    };
  },
  mounted() {
    console.log("mounted");

    $(".increment").click(function() {
      console.log("Increment");
    });
    // Initialize the datatable - any is for preventing 'Property does not exist' error
    // This is the solution reference - https://stackoverflow.com/questions/24984014/how-can-i-stop-property-does-not-exist-on-type-jquery-syntax-errors-when-using
    ($("#sites-table") as any).DataTable();
  },
  created() {
    console.log("created");

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
  },
  methods: {
    incrementCounter: function() {
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
  margin: 20px 0 20px 15px;
}

.stats-table a {
  text-decoration: none;
}
</style>
