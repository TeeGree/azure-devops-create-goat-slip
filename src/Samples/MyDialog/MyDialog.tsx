import classes from "./MyDialog.scss";
import React, { useEffect, useState } from "react";
import * as SDK from "azure-devops-extension-sdk";
import { Button, Input } from "@mui/material";
import { showRootComponent } from "../../Common";

const MyDialog: React.FC = () => {
    const [message, setMessage] = useState("");
    const [originalHours, setOriginalHours] = useState(0);
    const [updatedHours, setUpdatedHours] = useState(0);
    const [description, setDescription] = useState("");
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
            <div>Original hours: {originalHours}</div>
            <div>Unsaved hours: {updatedHours}</div>
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
                <Button variant="contained" onClick={() => dismiss()}>
                    OK
                </Button>
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
