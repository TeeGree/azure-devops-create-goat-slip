import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import {
    CommonServiceIds,
    IHostPageLayoutService,
} from "azure-devops-extension-api";
import {
    IWorkItemFormService,
    WorkItemTrackingServiceIds,
} from "azure-devops-extension-api/WorkItemTracking";

SDK.register("work-item-menu-action", () => {
    return {
        execute: async () => {
            const dialogSvc = await SDK.getService<IHostPageLayoutService>(
                CommonServiceIds.HostPageLayoutService
            );

            const workItemFormService =
                await SDK.getService<IWorkItemFormService>(
                    WorkItemTrackingServiceIds.WorkItemFormService
                );
            const originalHours = (await workItemFormService.getFieldValue(
                "hours",
                { returnOriginalValue: true }
            )) as number;
            const updatedHours = (await workItemFormService.getFieldValue(
                "hours",
                { returnOriginalValue: false }
            )) as number;

            dialogSvc.openCustomDialog(
                SDK.getExtensionContext().id + ".my-dialog",
                {
                    title: "Enter time slip",
                    configuration: {
                        message: "Enter Time Slip Description:",
                        dialog: true,
                        originalHours,
                        updatedHours,
                    },
                }
            );
        },
    };
});

SDK.init();
