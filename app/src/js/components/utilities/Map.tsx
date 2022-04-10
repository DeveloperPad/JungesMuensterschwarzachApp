import "mapbox-gl/dist/mapbox-gl.css";

import * as React from "react";
import ReactMapGL from "react-map-gl";

import { withTheme, WithTheme } from "@material-ui/core";
import { ConfigService } from "../../services/ConfigService";

type IMapProps = WithTheme & {
    children?: React.ReactNode;
    latitude?: number;
    longitude?: number;
    style?: React.CSSProperties;
};

const Map = (props: IMapProps) => {
    const [state, setState] = React.useState({
        viewport: {
            height: 400,
            latitude: Number(props.latitude),
            longitude: Number(props.longitude),
            width: 0,
            zoom: 15,
        },
    });
    const ref = React.useRef(null);

    const onViewportChange = React.useCallback((viewport) => {
        const { latitude, longitude, zoom } = viewport;
        setState(state => {
            return {
                ...state,
                viewport: {
                    ...state.viewport,
                    latitude,
                    longitude,
                    zoom
                }
            }
        });
    }, []);

    React.useEffect(
        () => {
            if (ref.current) {
                setState(s => {
                    return {
                        ...s,
                        viewport: {
                            ...s.viewport,
                            height: ref.current.offsetHeight,
                            width: ref.current.offsetWidth,
                        }
                    }
                }
                );
            }
        },
        []
    );

    return (
        <ReactMapGL
            {...state.viewport}
            mapboxApiAccessToken={ConfigService.getConfig().MapConfig.key}
            mapStyle={"mapbox://styles/mapbox/satellite-streets-v11"}
            onViewportChange={onViewportChange}
            ref={ref}
        >
            {props.children}
        </ReactMapGL>
    );
};

export default withTheme(Map);
