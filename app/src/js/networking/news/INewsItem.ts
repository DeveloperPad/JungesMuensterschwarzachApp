import IUser from '../account_data/IUser';
import IImage from '../images/IImage';

export default interface INewsItem {

    author?: IUser;
    content?: string;
    imageIds?: IImage[];
    modificationDate?: Date;
    newsId: number;
    postingDate: Date;
    summary: string;
    title: string;

}