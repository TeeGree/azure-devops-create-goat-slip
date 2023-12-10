import classes from "./MyDialog.scss";
import React, { useEffect, useState } from "react";
import * as SDK from "azure-devops-extension-sdk";
import { Button, CircularProgress, Input } from "@mui/material";
import { showRootComponent } from "../../Common";
import {
    IWorkItemFormService,
    WorkItemTrackingServiceIds,
} from "azure-devops-extension-api/WorkItemTracking";

const MyDialog: React.FC = () => {
    const [message, setMessage] = useState("");
    const [originalHours, setOriginalHours] = useState(0);
    const [updatedHours, setUpdatedHours] = useState(0);
    const [description, setDescription] = useState("");
    const [addingTimeSlip, setAddingTimeSlip] = useState(false);

    useEffect(() => {
        SDK.init();

        SDK.ready().then(() => {
            const config = SDK.getConfiguration();
            const message = config.message || "Custom dialog message";
            setMessage(message);

            const originalHours = config.originalHours ?? 0;
            setOriginalHours(originalHours);

            const updatedHours = config.updatedHours ?? 0;
            setUpdatedHours(updatedHours);

            if (config.dialog) {
                // Give the host frame the size of our dialog content so that the dialog can be sized appropriately.
                // This is the case where we know our content size and can explicitly provide it to SDK.resize. If our
                // size is dynamic, we have to make sure our frame is visible before calling SDK.resize() with no arguments.
                // In that case, we would instead do something like this:
                //
                // SDK.notifyLoadSucceeded().then(() => {
                // // we are visible in this callback.
                // SDK.resize();
                // });
                SDK.resize(400, 200);
            }
        });
    }, []);

    // method to save azure devops work item using SDK
    const saveWorkItem = async () => {
        // save work item
        const workItemFormService = await SDK.getService<IWorkItemFormService>(
            WorkItemTrackingServiceIds.WorkItemFormService
        );

        // save azure devops work item
        await workItemFormService.save();
    };

    const saveTimeSlip = async () => {
        // save work item
        setAddingTimeSlip(true);
        await saveWorkItem();
        setAddingTimeSlip(false);
        dismiss();
    };

    const getAddTimeSlipButton = () => {
        const content = addingTimeSlip ? <CircularProgress /> : "Add Time Slip";
        return (
            <Button
                sx={{ width: 200 }}
                variant="contained"
                onClick={() => saveTimeSlip()}
            >
                {content}
            </Button>
        );
    };

    const dismiss = () => {
        const config = SDK.getConfiguration();
        if (config.dialog) {
            config.dialog.close();
        } else if (config.panel) {
            config.panel.close();
        }
    };

    return (
        <div className="sample-panel flex-column flex-grow">
            <div>Added hours: {updatedHours - originalHours}</div>
            {message}
            <div style={{ width: "100%" }}>
                <Input
                    sx={{
                        color: "inherit !important",
                        width: "100%",
                        marginTop: "10px",
                        marginBottom: "10px",
                    }}
                    className={classes["time-slip-description"]}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Sample time slip description"
                />
            </div>
            <div style={{ display: "flex" }}>
                {getAddTimeSlipButton()}
                <Button
                    sx={{ marginLeft: "10px" }}
                    variant="contained"
                    onClick={() => dismiss()}
                >
                    Close
                </Button>
            </div>
        </div>
    );
};

showRootComponent(<MyDialog />);
