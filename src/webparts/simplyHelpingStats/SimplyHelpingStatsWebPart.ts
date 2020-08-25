// import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
// Importing Vue.js
import Vue from "vue";
// Importing Vue.js SFC
import SimplyHelpingStatsComponent from "./components/SimplyHelpingStats.vue";

export interface ISimplyHelpingStatsWebPartProps {
  msg: string;
  description: string;
}

export default class SimplyHelpingStatsWebPart extends BaseClientSideWebPart<
  ISimplyHelpingStatsWebPartProps
> {
  public render(): void {
    const id: string = `wp-${this.instanceId}`;
    this.domElement.innerHTML = `<div id="${id}"></div>`;

    let el = new Vue({
      el: `#${id}`,
      render: h =>
        h(SimplyHelpingStatsComponent, {
          props: {
            msg: "This message is coming from TS file",
            description: this.properties.description
          }
        })
    });
  }
}
