import 'react-responsive-carousel/lib/styles/carousel.min.css';

import * as React from 'react';
import { Carousel } from 'react-responsive-carousel';

import { withTheme, WithTheme } from '@material-ui/core';

import { Dict } from '../../constants/dict';
import IImage from '../../networking/images/IImage';
import { ConfigService } from '../../services/ConfigService';

type IImageCarouselProps = WithTheme & {
    images?: IImage[];
    style?: React.CSSProperties;
}

class ImageCarousel extends React.Component<IImageCarouselProps> {

    private carouselContainerStyle: React.CSSProperties = {
        ...this.props.style,
        marginBottom: this.props.theme.spacing(2)
    };

    public render(): React.ReactNode {
        if (!this.props.images || this.props.images.length === 0) {
            return null;
        }

        const showIndicators: boolean = this.props.images.length > 1;
        const imageDivs: React.ReactNode = this.props.images.map(image => (
            <div
                key={image.imageId}
            >
                <img src={this.getImagePath(image)} alt="" />
            </div>
        ));

        return (
            <div
                style={this.carouselContainerStyle}
            >
                <Carousel
                    dynamicHeight={true}
                    showIndicators={false}
                    showStatus={showIndicators}
                    showThumbs={showIndicators}
                    statusFormatter={this.statusFormatter}>
                    {imageDivs}
                </Carousel>
            </div>
        );
    }

    private getImagePath = (image: IImage): string => {
        return ConfigService.getConfig().BaseUrls.WEBSERVICE + "/" + image.path;
    }

    private statusFormatter = (current: any, total: any): string => {
        return current + Dict.image_navigation_counter_infix + total;
    }

}

export default withTheme(ImageCarousel);