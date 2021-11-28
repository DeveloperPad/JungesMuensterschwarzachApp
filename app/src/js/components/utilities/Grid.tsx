import * as React from "react";

interface IGridProps {
    children: React.ReactElement<any>[];
    style?: React.CSSProperties;
}

const Grid = (props: IGridProps) => {
    const { children, style } = props;

    const getClassStyle = (): React.CSSProperties => {
        const height =
            style && style.flexDirection && style.flexDirection !== "column"
                ? "auto"
                : "100%";
        const width = height;

        // these default values are specific to a flex direction of "column*"
        return {
            alignContent: "center",
            alignItems: "center",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            height,
            justifyContent: "center",
            margin: "auto",
            width,
        };
    };

    return (
        <div
            style={{
                ...getClassStyle(),
                ...style,
            }}
        >
            {children}
        </div>
    );
};

export default Grid;
