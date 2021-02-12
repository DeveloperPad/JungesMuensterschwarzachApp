import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import {
    Accordion, AccordionDetails, AccordionSummary, Card, CardContent, CardHeader, Typography,
    withTheme, WithTheme
} from '@material-ui/core';

import Dict from '../../constants/dict';
import Background from '../utilities/Background';

type IChangelogPageProps = RouteComponentProps<any, StaticContext> & WithTheme;

class ChangelogPage extends React.Component<IChangelogPageProps> {

    public render(): React.ReactNode {
        return (
            <Background theme={this.props.theme}>
                <Card>
                    <CardHeader title={Dict.changelog} />
                    <CardContent>
                        <Accordion
                            expanded={true}
                        >
                            <AccordionSummary>
                                <Typography variant="h5">{Dict.changelog_upcoming}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={preFormattedStyle}>
                                    {Dict.changelog_upcoming_paragraph}
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion
                            expanded={true}
                        >
                            <AccordionSummary>
                                <Typography variant="h5">{Dict.version_1_1_0}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={preFormattedStyle}>
                                    {Dict.changelog_1_1_0}
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion
                            expanded={true}
                        >
                            <AccordionSummary>
                                <Typography variant="h5">{Dict.version_1_0_0}</Typography>
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
    }

}

export default withTheme(withRouter(ChangelogPage));

const preFormattedStyle: React.CSSProperties = {
    whiteSpace: "pre-wrap"
}