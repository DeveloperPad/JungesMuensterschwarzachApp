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

    if (!images || images.length === 0) {
        return null;
    }

    const getImagePath = (image: IImage): string => {
        return ConfigService.getConfig().BaseUrls.WEBSERVICE + "/" + image.path;
    };
    const statusFormatter = (current: any, total: any): string => {
        return current + Dict.image_navigation_counter_infix + total;
    };

    const showIndicators: boolean = images.length > 1;
    const imageDivs: React.ReactElement<any>[] = images.map((image) => (
        <div key={image.imageId}>
            <img src={getImagePath(image)} alt="" />
        </div>
    ));

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
