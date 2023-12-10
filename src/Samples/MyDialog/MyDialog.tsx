import classes from "./MyDialog.scss";
import React, { ReactNode, useEffect, useState } from "react";
import * as SDK from "azure-devops-extension-sdk";
import {
    Button,
    CircularProgress,
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
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
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedTask, setSelectedTask] = useState("");
    const [selectedLaborCode, setSelectedLaborCode] = useState("");

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
                SDK.resize(400, 500);
            }
        });
    }, []);

    // method to save azure devops work item using SDK
    const saveWorkItem = async () => {
        // save work item
        const workItemFormService = await SDK.getService<IWorkItemFormService>(
            WorkItemTrackingServiceIds.WorkItemFormService
        );

        const now = new Date();

        await workItemFormService.setFieldValues({
            "Custom.TimeTrackingProject": selectedProject,
            "Custom.TimeTrackingTask": selectedTask,
            "Custom.TimeTrackingLaborCode": selectedLaborCode,
            "Custom.LastTimeSlipCreation": new Date(
                now.getTime() - now.getTimezoneOffset() * 60000
            ).toISOString(),
            "Custom.LastTimeSlipDescription": description,
        });

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
            <FormControl
                sx={{
                    width: 200,
                    marginTop: "10px",
                    marginBottom: "10px",
                    color: "white",
                }}
            >
                <InputLabel
                    sx={{
                        color: "white",
                    }}
                >
                    Project
                </InputLabel>
                <Select
                    sx={{
                        color: "white",
                        borderColor: "white",
                        ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                        },
                        ".MuiSvgIcon-root ": {
                            fill: "white !important",
                        },
                    }}
                    onChange={(
                        event: SelectChangeEvent<string | number>,
                        _child: ReactNode
                    ) => {
                        const value = event.target.value.toString();
                        setSelectedProject(value);
                    }}
                    placeholder="Product"
                    value={selectedProject}
                >
                    <MenuItem value="GrizzleUtils">GrizzleUtils</MenuItem>
                    <MenuItem value="Coding Class">Coding Class</MenuItem>
                    <MenuItem value="G.O.A.T. Slips">G.O.A.T. Slips</MenuItem>
                </Select>
            </FormControl>
            <FormControl
                sx={{
                    width: 200,
                    marginTop: "10px",
                    marginBottom: "10px",
                    color: "white",
                }}
            >
                <InputLabel
                    sx={{
                        color: "white",
                    }}
                >
                    Task
                </InputLabel>
                <Select
                    sx={{
                        color: "white",
                        borderColor: "white",
                        ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                        },
                        ".MuiSvgIcon-root ": {
                            fill: "white !important",
                        },
                    }}
                    onChange={(
                        event: SelectChangeEvent<string | number>,
                        _child: ReactNode
                    ) => {
                        const value = event.target.value.toString();
                        setSelectedTask(value);
                    }}
                    placeholder="Task"
                    value={selectedTask}
                >
                    <MenuItem value="Development">Development</MenuItem>
                    <MenuItem value="QA">QA</MenuItem>
                    <MenuItem value="Project Management">
                        Project Management
                    </MenuItem>
                </Select>
            </FormControl>
            <FormControl
                sx={{
                    width: 200,
                    marginTop: "10px",
                    marginBottom: "10px",
                    color: "white",
                }}
            >
                <InputLabel
                    sx={{
                        color: "white",
                    }}
                >
                    Labor Code
                </InputLabel>
                <Select
                    sx={{
                        color: "white",
                        borderColor: "white",
                        ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                        },
                        ".MuiSvgIcon-root ": {
                            fill: "white !important",
                        },
                    }}
                    onChange={(
                        event: SelectChangeEvent<string | number>,
                        _child: ReactNode
                    ) => {
                        const value = event.target.value.toString();
                        setSelectedLaborCode(value);
                    }}
                    placeholder="Labor Code"
                    value={selectedLaborCode}
                >
                    <MenuItem value="Support">Support</MenuItem>
                    <MenuItem value="Meeting">Meeting</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                </Select>
            </FormControl>
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
