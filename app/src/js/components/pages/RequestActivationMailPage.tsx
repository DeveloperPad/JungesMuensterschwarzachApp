import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { WithTheme, withTheme } from '@material-ui/core';

import { grid5Style, grid7Style } from '../../constants/theme';
import RequestActivationMailForm from '../forms/RequestActivationMailForm';
import WhiteLogoIcon from '../navigation/icons/WhiteLogoIcon';
import Background from '../utilities/Background';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';

type IRequestActivationMailPageProps = RouteComponentProps<any, StaticContext> & WithTheme;

class RequestActivationMailPage extends React.Component<IRequestActivationMailPageProps> {

    public render(): React.ReactNode {
        return (
            <Background theme={this.props.theme}>
                <Grid
                    style={gridStyle}>

                    <GridItem
                        style={grid5Style}>
                        <Grid>
                            <WhiteLogoIcon />
                        </Grid>
                    </GridItem>

                    <GridItem
                        style={grid7Style}>
                        <RequestActivationMailForm />
                    </GridItem>
                </Grid>
            </Background>
        );
    }

}

export default withTheme(withRouter(RequestActivationMailPage));

const gridStyle: React.CSSProperties = {
    width: "70%"
};