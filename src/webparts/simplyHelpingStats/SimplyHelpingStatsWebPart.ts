import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import Vue from "vue";
import SimplyHelpingStatsComponent from "./components/SimplyHelpingStats.vue";

export interface ISimplyHelpingStatsWebPartProps {
  msg: string;
  description: string;
}
export default class SimplyHelpingStatsWebPart extends BaseClientSideWebPart<
  ISimplyHelpingStatsWebPartProps
> {
  public render(): void {
    const userName = this.context.pageContext.user.displayName;
    const rootURL = this.context.pageContext.web.absoluteUrl;
    const header = "Simply Helping Franchise Sites Activity Report"

    const id: string = `wp-${this.instanceId}`;
    this.domElement.innerHTML = `<div id="${id}"></div>`;

    let el = new Vue({
      el: `#${id}`,
      render: h =>
        h(SimplyHelpingStatsComponent, {
          props: {
            msg: "This message is coming from TS file",
            header: header,
            description: this.properties.description,
            userName: userName,
            rootURL: rootURL
          }
        })
    });
  }
}
