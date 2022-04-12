import * as React from "react";

interface IGridItemProps {
    children: React.ReactElement<any> | React.ReactElement<any>[];
    style?: object;
}

const GridItem = (props: IGridItemProps) => {
    const { children, style } = props;

    const classStyle = React.useMemo((): React.CSSProperties => {
        // these default properties are specific to the flex direction of "column*"
        return {
            display: "flex",
            flex: 1,
            flexDirection: "column",
            width: "100%",
        };
    }, []);

    return (
        <div
            style={{
                ...classStyle,
                ...style,
            }}
        >
            {children}
        </div>
    );
};

export default GridItem;
