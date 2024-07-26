export interface iEbayImageResponse {
    xml: string;
    UploadSiteHostedPicturesResponse: {
        Timestamp: Date;
        Ack: string;
        Errors: {
                ShortMessage: string;
                LongMessage: string;
                ErrorCode: number;
                SeverityCode: string;
                ErrorParameters: {
                    Value: number;
                },
                ErrorClassification: string;
            },
            Version: number;
            Build: string;
            PictureSystemVersion: number
            SiteHostedPictureDetails: {
                PictureName: string;
                PictureSet: string;
                PictureFormat: string;
                FullURL: string;
                BaseURL: string;
                PictureSetMember:     {
                    MemberURL: string;
                    PictureHeight: number;
                    PictureWidth: number;
                }[];
                UseByDate: Date;
            }
    }
}