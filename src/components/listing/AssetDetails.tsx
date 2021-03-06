﻿import * as React from "react";
import * as moment from "moment";

import { TransformedImage } from "../../types/transformedImage/TransformedImage";

export interface IAssetDetailsProps {
    image: TransformedImage;
}

export class AssetDetails extends React.PureComponent<IAssetDetailsProps> {
    getAssetFileSize = (sizeInBytes: number): string => {
        let finalSize = sizeInBytes;
        let unit = "B";

        // GigaBytes
        if (sizeInBytes > (1024 * 1024 * 1024)) {
            finalSize = sizeInBytes / 1024 / 1024 / 1024;
            unit = "GB";
        }
        // MegaBytes
        else if (sizeInBytes > (1024 * 1024)) {
            finalSize = sizeInBytes / 1024 / 1024;
            unit = "MB";
        }
        // KiloBytes
        else if (sizeInBytes > (1024)) {
            finalSize = sizeInBytes / 1024;
            unit = "kB";
        }

        return `${Number(finalSize).toFixed(2)} ${unit}`;
    }

    getAssetLastModified(lastModified: Date): string {
        return this._printDate(lastModified);
    }

    _printDate(date: Date): string {
        return moment(date).format('MMM D, YYYY');
    }

    //_printTime(date: Date, includeSeconds: boolean = false): string {
    //    return moment(date).format('h:mm' + (includeSeconds ? ':ss' : '') + ' a');
    //}

    //_printDatetime(date: Date, includeSeconds: boolean = false): string {
    //    return this._printDate(date) + ' \u00B7 ' + this._printTime(date, includeSeconds);
    //}

    render() {
        return (
            <div className="assetDetailsSummary">
                <div className="assetDetailsTitle">
                    <div className="assetDetailsName">
                        <span className="assetDetailsFileName">
                            {this.props.image.fileName}
                        </span>
                    </div>
                </div>
                <span className="assetDetailsTechDetails">
                    <span className="assetDetailsTechDetail">
                        {this.getAssetFileSize(this.props.image.size)}
                    </span>
                    <span className="assetDetailsTechDetail">
                        {this.getAssetLastModified(this.props.image.lastModified)}
                    </span>
                </span>
            </div>

        );
    }
}