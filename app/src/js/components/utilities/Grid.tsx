import * as React from 'react';


interface IGridProps {
    style?: React.CSSProperties;
}

export default class Grid extends React.Component<IGridProps> {

    private gridStyle: React.CSSProperties;
    constructor(props: IGridProps) {
        super(props);

        this.gridStyle = {
            ...this.getClassStyle(),
            ...this.props.style
        }
    }

    public render(): React.ReactNode {
        return (
            <div
                style={this.gridStyle}>
                {this.props.children}
            </div>
        );
    }

    private getClassStyle = (): React.CSSProperties => {
        const height = 
            this.props.style && this.props.style.flexDirection &&
                this.props.style.flexDirection !== "column" ? "auto" : "100%";
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
            width
        };
    }

}