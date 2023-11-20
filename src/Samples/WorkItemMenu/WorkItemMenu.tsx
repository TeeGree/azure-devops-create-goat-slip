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
                SDK.getExtensionContext().id + ".my-dialog",
                {
                    title: "Enter time slip",
                    configuration: {
                        message: "Enter Time Slip Description:",
                        dialog: true,
                    },
                }
            );
        },
    };
});

SDK.init();
