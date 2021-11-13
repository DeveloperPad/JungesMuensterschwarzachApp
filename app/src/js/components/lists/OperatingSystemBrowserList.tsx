import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import {
    Accordion, AccordionDetails, AccordionSummary, Typography, WithTheme, withTheme
} from '@material-ui/core';

import { Browsers } from '../../constants/browsers';
import { Dict } from '../../constants/dict';
import { OperatingSystems } from '../../constants/operating-systems';
import BrowserListItem from '../list_items/BrowserListItem';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';

type IOperatingSystemBrowserListProps = RouteComponentProps<any, StaticContext> & WithTheme & {
    operatingSystem: OperatingSystems;
}

class OperatingSystemBrowserList extends React.PureComponent<IOperatingSystemBrowserListProps> {

    public render = (): React.ReactNode => {
        return (
            <Accordion
                expanded={true}>

                <AccordionSummary>
                    <Typography variant="h5">
                        {Dict["installation_os_" + this.props.operatingSystem]}
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Grid>
                        {this.getBrowsers().map(browser => {
                            return (
                                <GridItem
                                    key={this.props.operatingSystem + "|" + browser}
                                >
                                    <BrowserListItem
                                        browser={browser}
                                        operatingSystem={this.props.operatingSystem}
                                    />
                                </GridItem>
                            );
                        })}
                    </Grid>

                </AccordionDetails>

            </Accordion>
        );
    }

    private getBrowsers = (): Browsers[] => {
        switch (this.props.operatingSystem) {
            case OperatingSystems.WINDOWS:
                return [
                    Browsers.CHROME,
                    Browsers.FIREFOX,
                    Browsers.EDGE,
                    Browsers.OPERA
                ];
            case OperatingSystems.MACOS:
                return [
                    Browsers.SAFARI
                ];
            case OperatingSystems.ANDROID:
                return [
                    Browsers.CHROME,
                    Browsers.SAMSUNG_INTERNET,
                    Browsers.FIREFOX,
                    Browsers.OPERA
                ];
            case OperatingSystems.IOS:
                return [
                    Browsers.SAFARI
                ];
            default:
                return [];
        }
    }

}

export default withTheme(withRouter(OperatingSystemBrowserList));