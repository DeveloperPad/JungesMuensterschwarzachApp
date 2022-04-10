import * as React from "react";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from "@material-ui/core";

import { Browsers } from "../../constants/browsers";
import { Dict } from "../../constants/dict";
import { OperatingSystems } from "../../constants/operating-systems";
import BrowserListItem from "../list_items/BrowserListItem";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";

type IOperatingSystemBrowserListProps = {
    operatingSystem: OperatingSystems;
};

const OperatingSystemBrowserList = (
    props: IOperatingSystemBrowserListProps
) => {
    const { operatingSystem } = props;

    const browsers = React.useMemo((): Browsers[] => {
        switch (operatingSystem) {
            case OperatingSystems.WINDOWS:
                return [
                    Browsers.CHROME,
                    Browsers.FIREFOX,
                    Browsers.EDGE,
                    Browsers.OPERA,
                ];
            case OperatingSystems.MACOS:
                return [Browsers.SAFARI];
            case OperatingSystems.ANDROID:
                return [
                    Browsers.CHROME,
                    Browsers.SAMSUNG_INTERNET,
                    Browsers.FIREFOX,
                    Browsers.OPERA,
                ];
            case OperatingSystems.IOS:
                return [Browsers.SAFARI];
            default:
                return [];
        }
    }, [operatingSystem]);

    return (
        <Accordion expanded={true}>
            <AccordionSummary>
                <Typography variant="h5">
                    {Dict["installation_os_" + operatingSystem]}
                </Typography>
            </AccordionSummary>

            <AccordionDetails>
                <Grid>
                    {browsers.map((browser) => {
                        return (
                            <GridItem key={operatingSystem + "|" + browser}>
                                <BrowserListItem
                                    browser={browser}
                                    operatingSystem={operatingSystem}
                                />
                            </GridItem>
                        );
                    })}
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};

export default OperatingSystemBrowserList;
