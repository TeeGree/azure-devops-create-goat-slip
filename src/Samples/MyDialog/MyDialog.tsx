import "./MyDialog.scss";

import React, { useEffect, useState } from "react";
import * as SDK from "azure-devops-extension-sdk";

import { Button } from "@mui/material";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";
import { showRootComponent } from "../../Common";

interface IPanelContentState {
    message?: string;
    toggleValue?: boolean;
    ready?: boolean;
}

const MyDialog: React.FC = () => {
    const [message, setMessage] = useState("");
    const [originalHours, setOriginalHours] = useState(0);
    const [updatedHours, setUpdatedHours] = useState(0);
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
                SDK.resize(400, 400);
            }
        });
    }, []);

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
            {message}
            <div>Original hours: {originalHours}</div>
            <div>Updated hours: {updatedHours}</div>
            <div
                className="flex-grow flex-column flex-center justify-center"
                style={{ border: "1px solid #eee", margin: "10px 0" }}
            >
                Sample time slip description
            </div>
            <ButtonGroup className="sample-panel-button-bar">
                <Button variant="contained" onClick={() => dismiss()}>
                    OK
                </Button>
                <Button variant="contained" onClick={() => dismiss()}>
                    Close
                </Button>
            </ButtonGroup>
        </div>
    );
};

showRootComponent(<MyDialog />);
