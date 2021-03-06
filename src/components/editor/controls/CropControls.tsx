﻿import * as React from "react";

import { ICropTransform, CropType } from "../../../types/transformedImage/Transforms";
import { BoxActions } from "../../../types/editor/cropActions/BoxActions";
import { ZoomActions } from "../../../types/editor/cropActions/ZoomActions";
import { FrameActions } from "../../../types/editor/cropActions/FrameActions";

import { BaseControls, IBaseControlsProps, EditAction, RectProps } from "./BaseControls";
import { NumberInput, NumberInputType } from "../inputs/NumberInput";
import { SVGOverlay } from "./SVGOverlay";

export interface ICropControlsProps extends IBaseControlsProps<ICropTransform> {
}

export interface ICropControlsState {
}

export class CropControls extends BaseControls<ICropControlsProps, ICropTransform, ICropControlsState> {
    onClickSidebar(): void {
    }

    updateTransform = () => {
        if (this.actionParams.action !== EditAction.none) {
            const { type } = this.props.transform;

            switch (type) {
                case CropType.frame:
                    this.setTransform({ frame: new FrameActions().getTransform(this.currentRectProps) });
                    break;
                case CropType.box:
                    this.setTransform({ box: new BoxActions().getTransform(this.currentRectProps) });
                    break;
                case CropType.zoom:
                    this.setTransform({ zoom: new ZoomActions().getTransform(this.currentRectProps) });
                    break;
            }

            this.actionParams.action = EditAction.none;
        }

        return true;
    };

    getImageOverlay() {
        const { type, frame, box, zoom } = this.props.transform;

        let rectProps: RectProps = this.noRectProps;

        if (this.actionParams.action !== EditAction.none) {
            switch (type) {
                case CropType.box:
                    rectProps = new BoxActions().getEditingRect(this.actionParams, box);
                    break;
                case CropType.zoom:
                    rectProps = new ZoomActions().getEditingRect(this.actionParams, zoom);
                    break;
                case CropType.frame:
                    rectProps = new FrameActions().getEditingRect(this.actionParams, frame);
                    break;
            }
        } else {
            switch (type) {
                case CropType.frame:
                    rectProps = new FrameActions().getPassiveRect(frame);
                    break;
                case CropType.box:
                    rectProps = new BoxActions().getPassiveRect(box);
                    break;
                case CropType.zoom:
                    if (zoom.zFloat > 0) {
                        rectProps = new ZoomActions().getPassiveRect(zoom);
                    } else {
                        rectProps = this.noRectProps;
                    }
                    break;
            }
        }

        rectProps = this.ensureRectWithinImage(rectProps);

        if (rectProps.height === 0 && rectProps.width === 0) {
            rectProps = this.noRectProps;
        }

        this.currentRectProps = rectProps;

        return (
            <SVGOverlay
                rectProps={rectProps}
                canDrag={type !== CropType.frame}
                isSelecting={this.actionParams.action === EditAction.selecting}
            />
        );
    }

    renderInputs(crop: ICropTransform): React.ReactNode {
        const { type, frame, box, zoom } = crop;

        if (this.props.imageHeight && this.props.imageWidth) {
            switch (type) {
                case CropType.box:
                    return (
                        <div className="fields vertical" key={CropType.box}>
                            <div className="fieldsBlock">
                                <NumberInput
                                    type={this.defaultNumberType}
                                    allowedTypes={this.allowedNumberTypes}
                                    value={this.getZeroOrNull(box.xFloat)}
                                    max={this.props.imageWidth}
                                    tooltip="Start X"
                                    setValue={value => {
                                        crop.box.xFloat = value;
                                        this.setTransform({ box: crop.box })
                                    }}
                                />
                                <NumberInput
                                    type={this.defaultNumberType}
                                    allowedTypes={this.allowedNumberTypes}
                                    value={this.getZeroOrNull(box.yFloat)}
                                    max={this.props.imageWidth}
                                    tooltip="Start Y"
                                    setValue={value => {
                                        crop.box.yFloat = value;
                                        this.setTransform({ box: crop.box })
                                    }}
                                />
                            </div>
                            <div className="fieldsBlock">
                                <NumberInput
                                    type={this.defaultNumberType}
                                    allowedTypes={this.allowedNumberTypes}
                                    value={this.getZeroOrNull(box.wFloat)}
                                    max={this.props.imageWidth}
                                    tooltip="Width"
                                    setValue={value => {
                                        crop.box.wFloat = value;
                                        this.setTransform({ box: crop.box })
                                    }}
                                />
                                <NumberInput
                                    type={this.defaultNumberType}
                                    allowedTypes={this.allowedNumberTypes}
                                    value={this.getZeroOrNull(box.hFloat)}
                                    max={this.props.imageWidth}
                                    tooltip="Height"
                                    setValue={value => {
                                        crop.box.hFloat = value;
                                        this.setTransform({ box: crop.box })
                                    }}
                                />
                            </div>
                        </div>
                    );
                case CropType.zoom:
                    return (
                        <div className="fields vertical" key={CropType.zoom}>
                            <div className="fieldsBlock">
                                <NumberInput
                                    type={this.defaultNumberType}
                                    allowedTypes={this.allowedNumberTypes}
                                    value={this.getZeroOrNull(zoom.xFloat)}
                                    max={this.props.imageWidth}
                                    tooltip="Center X"
                                    setValue={value => {
                                        crop.zoom.xFloat = value;
                                        this.setTransform({ zoom: crop.zoom })
                                    }}
                                />
                                <NumberInput
                                    type={this.defaultNumberType}
                                    allowedTypes={this.allowedNumberTypes}
                                    value={this.getZeroOrNull(zoom.yFloat)}
                                    max={this.props.imageWidth}
                                    tooltip="Center Y"
                                    setValue={value => {
                                        crop.zoom.yFloat = value;
                                        this.setTransform({ zoom: crop.zoom })
                                    }}
                                />
                                <NumberInput
                                    type={NumberInputType.float}
                                    allowedTypes={[NumberInputType.float]}
                                    value={this.getZeroOrNull(zoom.zFloat)}
                                    max={100}
                                    min={1}
                                    tooltip="Zoom"
                                    setValue={value => {
                                        crop.zoom.zFloat = value;
                                        this.setTransform({ zoom: crop.zoom })
                                    }}
                                />
                            </div>
                        </div >
                    );
                case CropType.frame:
                    return (
                        <div className="fields" key={CropType.frame}>
                            <NumberInput
                                type={this.defaultNumberType}
                                allowedTypes={this.allowedNumberTypes}
                                value={this.getZeroOrNull(frame.wFloat)}
                                max={this.props.imageWidth}
                                tooltip="Width"
                                setValue={value => {
                                    crop.frame.wFloat = value;
                                    this.setTransform({ frame: crop.frame })
                                }}
                            />
                            <NumberInput
                                type={this.defaultNumberType}
                                allowedTypes={this.allowedNumberTypes}
                                value={this.getZeroOrNull(frame.hFloat)}
                                max={this.props.imageHeight}
                                tooltip="Height"
                                setValue={value => {
                                    crop.frame.hFloat = value;
                                    this.setTransform({ frame: crop.frame })
                                }}
                            />
                        </div>
                    );
            }
        }
    }

    renderControls() {
        const crop = this.props.transform;

        return (
            <div>
                <div className="modes">
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.box)}`}
                        onClick={() => this.setTransform({ type: CropType.box })}
                    >
                        Box
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.zoom)}`}
                        onClick={() => this.setTransform({ type: CropType.zoom })}
                    >
                        Zoom
                    </button>
                    <button
                        className={`btn mode ${this.buttonIsSelectedClass(crop.type === CropType.frame)}`}
                        onClick={() => this.setTransform({ type: CropType.frame })}
                    >
                        Frame
                    </button>
                </div>
                {this.renderInputs(crop)}
            </div>
        );
    }
}