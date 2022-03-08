import * as React from "react";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardContent,
    CardHeader,
    Typography,
    withTheme,
    WithTheme,
} from "@material-ui/core";

import { Dict } from "../../constants/dict";
import Background from "../utilities/Background";

type IChangelogPageProps = WithTheme;

const ChangelogPage = (props: IChangelogPageProps) => {
    const { theme } = props;

    const preFormattedStyle: React.CSSProperties = {
        whiteSpace: "pre-wrap",
    };

    return (
        <Background theme={theme}>
            <Card>
                <CardHeader title={Dict.changelog} />
                <CardContent>
                    <Accordion expanded={true}>
                        <AccordionSummary>
                            <Typography variant="h5">
                                {Dict.changelog_upcoming}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={preFormattedStyle}>
                                {Dict.changelog_upcoming_paragraph}
                            </div>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion expanded={true}>
                        <AccordionSummary>
                            <Typography variant="h5">
                                {Dict.version_1_1_0}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={preFormattedStyle}>
                                {Dict.changelog_1_1_0}
                            </div>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion expanded={true}>
                        <AccordionSummary>
                            <Typography variant="h5">
                                {Dict.version_1_0_0}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={preFormattedStyle}>
                                {Dict.changelog_1_0_0}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </CardContent>
            </Card>
        </Background>
    );
};

export default withTheme(ChangelogPage);
