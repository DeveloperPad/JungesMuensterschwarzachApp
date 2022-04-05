import * as React from "react";

import { WithTheme, withTheme } from "@material-ui/core";

import { grid5Style, grid7Style } from "../../constants/theme";
import NewsletterSubscriptionForm from "../forms/NewsletterSubscriptionForm";
import WhiteLogoIcon from "../navigation/icons/WhiteLogoIcon";
import Background from "../utilities/Background";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";

type INewsletterSubscriptionPageProps = WithTheme;

const NewsletterSubscriptionPage = (
    props: INewsletterSubscriptionPageProps
) => {
    const { theme } = props;

    const gridStyle: React.CSSProperties = {
        width: "70%",
    };

    return (
        <Background theme={theme}>
            <Grid style={gridStyle}>
                <GridItem style={grid5Style}>
                    <Grid>
                        <WhiteLogoIcon />
                    </Grid>
                </GridItem>

                <GridItem style={grid7Style}>
                    <NewsletterSubscriptionForm />
                </GridItem>
            </Grid>
        </Background>
    );
};

export default withTheme(NewsletterSubscriptionPage);
