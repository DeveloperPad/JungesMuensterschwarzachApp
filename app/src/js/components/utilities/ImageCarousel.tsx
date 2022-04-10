import "react-responsive-carousel/lib/styles/carousel.min.css";

import * as React from "react";
import { Carousel } from "react-responsive-carousel";

import { withTheme, WithTheme } from "@material-ui/core";

import { Dict } from "../../constants/dict";
import IImage from "../../networking/images/IImage";
import { ConfigService } from "../../services/ConfigService";

type IImageCarouselProps = WithTheme & {
    images?: IImage[];
    style?: React.CSSProperties;
};

const ImageCarousel = (props: IImageCarouselProps) => {
    const { images, style, theme } = props;

    const getImagePath = React.useCallback((image: IImage): string => {
        return ConfigService.getConfig().BaseUrls.WEBSERVICE + "/" + image.path;
    }, []);
    const statusFormatter = React.useCallback(
        (current: any, total: any): string => {
            return current + Dict.image_navigation_counter_infix + total;
        },
        []
    );

    const showIndicators: boolean = React.useMemo(
        () => images && images.length > 1,
        [images]
    );
    const imageDivs: React.ReactElement<any>[] = React.useMemo(
        () =>
            images
                ? images.map((image) => (
                      <div key={image.imageId}>
                          <img src={getImagePath(image)} alt="" />
                      </div>
                  ))
                : [],
        [getImagePath, images]
    );

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div
            style={{
                ...style,
                marginBottom: theme.spacing(2),
            }}
        >
            <Carousel
                dynamicHeight={true}
                showIndicators={false}
                showStatus={showIndicators}
                showThumbs={showIndicators}
                statusFormatter={statusFormatter}
            >
                {imageDivs}
            </Carousel>
        </div>
    );
};

export default withTheme(ImageCarousel);
