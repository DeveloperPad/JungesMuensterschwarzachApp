import "mapbox-gl/dist/mapbox-gl.css";

import * as React from "react";
import ReactMapGL from "react-map-gl";

import { withTheme, WithTheme } from "@mui/material";
import { ConfigService } from "../../services/ConfigService";

type IMapProps = WithTheme & {
    children?: React.ReactNode;
    latitude?: number;
    longitude?: number;
};

const Map = (props: IMapProps) => {
    const { children, latitude, longitude } = props;
    const [viewport, setViewport] = React.useState({
        height: 400,
        latitude: Number(latitude),
        longitude: Number(longitude),
        width: 0,
        zoom: 15,
    });
    const ref = React.useRef(null);

    const onViewportChange = React.useCallback((viewport) => {
        const { latitude, longitude, zoom } = viewport;
        setViewport((viewport) => ({
            ...viewport,
            latitude,
            longitude,
            zoom,
        }));
    }, []);

    React.useEffect(() => {
        if (ref.current) {
            setViewport((viewport) => ({
                ...viewport,
                height: ref.current.offsetHeight,
                width: ref.current.offsetWidth,
            }));
        }
    }, []);

    return (
        <div ref={ref}>
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={ConfigService.getConfig().MapConfig.key}
                mapStyle={"mapbox://styles/mapbox/satellite-streets-v11"}
                onViewportChange={onViewportChange}
            >
                {children}
            </ReactMapGL>
        </div>
    );
};

export default withTheme(Map);
