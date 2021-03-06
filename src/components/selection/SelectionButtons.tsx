﻿import * as React from "react";
import { If } from "../If";

export interface ISelectionButtonsProps {
    onClickUpdate(): void;
    onClickCancel(): void;
    onClickLoadMore(): void;
    showLoadMore: boolean;
}

export class SelectionButtons extends React.PureComponent<ISelectionButtonsProps> {
    render() {
        return (
            <div className="selectionBar">
                <span className="spacer" />
                <span>
                    <button
                        className="btn btn--destructive"
                        onClick={() => this.props.onClickCancel()}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn--primary"
                        onClick={() => this.props.onClickUpdate()}
                    >
                        Update
                    </button>
                    <If shouldRender={this.props.showLoadMore}>
                        <button
                            className="btn btn--primary"
                            onClick={() => this.props.onClickLoadMore()}
                        >
                            Load more
                        </button>
                    </If>
                </span>
            </div>
        );
    }
}