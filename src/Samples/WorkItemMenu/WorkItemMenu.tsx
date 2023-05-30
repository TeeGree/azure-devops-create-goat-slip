import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import {
  CommonServiceIds,
  IHostPageLayoutService,
} from "azure-devops-extension-api";

SDK.register("work-item-menu-action", () => {
  return {
    execute: async () => {
      const dialogSvc = await SDK.getService<IHostPageLayoutService>(
        CommonServiceIds.HostPageLayoutService
      );
      dialogSvc.openCustomDialog(
        SDK.getExtensionContext().id + ".panel-content",
        {
          title: "Cool!",
          lightDismiss: false,
          onClose: () => console.log("Woo!"),
        }
      );
    },
  };
});

SDK.init();
