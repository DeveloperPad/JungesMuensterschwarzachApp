import * as React from "react";
import { useNavigate } from "react-router";

import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    withTheme,
    WithTheme,
} from "@material-ui/core";

import { AppUrls } from "../../constants/specific-urls";
import { CustomTheme } from "../../constants/theme";

type IHomePageListItemProps = WithTheme & {
    icon?: string;
    target: AppUrls | string;
    title: string;
};

const HomePageListItem = (props: IHomePageListItemProps) => {
    const navigate = useNavigate();
    const { icon, target, theme, title } = props;

    const forwardToTarget = React.useCallback((): void => {
        if (target.startsWith("mailto")) {
            window.location.href = target;
        } else {
            navigate(target);
        }
    }, [navigate, target]);

    return (
        <Card
            onClick={forwardToTarget}
            style={{
                backgroundColor: CustomTheme.COLOR_BODY_INNER,
                cursor: "pointer",
                margin: theme.spacing(),
                width: "100%",
            }}
        >
            <div
                style={{
                    alignItems: "center",
                    display: "flex",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        padding: theme.spacing(),
                    }}
                >
                    <CardMedia
                        component="img"
                        src={icon}
                        style={{
                            height: theme.spacing(9),
                            objectFit: "contain",
                            width: "auto",
                        }}
                    />
                </div>
                <CardContent
                    style={{
                        flex: 2,
                    }}
                >
                    <Typography
                        color="primary"
                        style={{
                            hyphens: "auto",
                            wordBreak: "break-word",
                        }}
                        variant="h5"
                    >
                        {title}
                    </Typography>
                </CardContent>
            </div>
        </Card>
    );
};

export default withTheme(HomePageListItem);
