import * as React from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';

import { withTheme, WithTheme } from '@material-ui/core';

import { grid5Style, grid7Style } from '../../constants/theme';
import NewsletterRedemptionForm from '../forms/NewsletterRedemptionForm';
import WhiteLogoIcon from '../navigation/icons/WhiteLogoIcon';
import Background from '../utilities/Background';
import Grid from '../utilities/Grid';
import GridItem from '../utilities/GridItem';

type INewsletterRedemptionPageProps = RouteComponentProps<any, StaticContext> & WithTheme;

class NewsletterRedemptionPage extends React.Component<INewsletterRedemptionPageProps> {

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
                        <NewsletterRedemptionForm/>
                    </GridItem>
                </Grid>
            </Background>
        );
    }

}

export default withTheme(withRouter(NewsletterRedemptionPage));

const gridStyle: React.CSSProperties = {
    width: "70%"
};