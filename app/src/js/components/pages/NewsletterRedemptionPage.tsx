import * as React from "react";

import { withTheme, WithTheme } from "@material-ui/core";

import { grid5Style, grid7Style } from "../../constants/theme";
import NewsletterRedemptionForm from "../forms/NewsletterRedemptionForm";
import WhiteLogoIcon from "../navigation/icons/WhiteLogoIcon";
import Background from "../utilities/Background";
import Grid from "../utilities/Grid";
import GridItem from "../utilities/GridItem";

type INewsletterRedemptionPageProps = WithTheme;

const NewsletterRedemptionPage = (props: INewsletterRedemptionPageProps) => {
    const { theme } = props;

    const gridStyle: React.CSSProperties = React.useMemo(
        () => ({
            width: "70%",
        }),
        []
    );

    return (
        <Background theme={theme}>
            <Grid style={gridStyle}>
                <GridItem style={grid5Style}>
                    <Grid>
                        <WhiteLogoIcon />
                    </Grid>
                </GridItem>

                <GridItem style={grid7Style}>
                    <NewsletterRedemptionForm />
                </GridItem>
            </Grid>
        </Background>
    );
};

export default withTheme(NewsletterRedemptionPage);
