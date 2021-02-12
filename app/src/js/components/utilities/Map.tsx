import 'mapbox-gl/dist/mapbox-gl.css';

import * as React from 'react';
import ReactMapGL from 'react-map-gl';

import { withTheme, WithTheme } from '@material-ui/core';
import { ConfigService } from '../../services/ConfigService';

type IMapProps = WithTheme & {
    children?: React.ReactNode;
    latitude?: number;
    longitude?: number;
    style?: React.CSSProperties;
}

const Map = (props: IMapProps) => {
    const [state, setState] = React.useState({
        viewport: {
            height: 400,
            latitude: Number(props.latitude),
            longitude: Number(props.longitude),
            width: 0,
            zoom: 15
        }
    });

    const ref = React.useRef();

    React.useEffect(() => {
        if (ref.current) {
            setState({
                ...state,
                viewport: {
                    ...state.viewport,
                    // @ts-ignore
                    height: ref.current.offsetHeight,
                    // @ts-ignore
                    width: ref.current.offsetWidth
                }
            });
        }
    }, 
    // eslint-disable-next-line
    []);

    function onViewportChange(viewport) {
        const {latitude, longitude, zoom} = viewport;
        setState({
            ...state,
            viewport: {
                ...state.viewport,
                latitude,
                longitude,
                zoom
            }
        });   
    };

    return (
        <div ref={ref}>
            <ReactMapGL
                {...state.viewport}
                mapboxApiAccessToken={ConfigService.getConfig().MapConfig.key}
                mapStyle={"mapbox://styles/mapbox/satellite-streets-v11"}
                onViewportChange={onViewportChange}
            >
                {props.children}
            </ReactMapGL>
        </div>
    );
}

export default withTheme(Map);