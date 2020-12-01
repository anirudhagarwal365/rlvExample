import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {DataProvider, GridLayoutProvider, RecyclerListView} from "recyclerlistview";
import {RecyclerListViewProps, RecyclerListViewState} from "recyclerlistview/dist/reactnative/core/RecyclerListView";
import {ScrollEvent} from "recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView";

const FULL_SPAN = 12;

interface TestComponentState {
    visibleIndex: number;
}

export default class TestComponent extends React.Component<any, TestComponentState> {
    dataProvider: DataProvider;

    constructor(props) {
        super(props);
        this.state = {visibleIndex: 0};
        this.dataProvider = new DataProvider((row1, row2) => {
            return row1 !== row2;
        });
        this.dataProvider = this.dataProvider.cloneWithRows(data);
    }

    private _recyclerListViewRef: RecyclerListView<RecyclerListViewProps, RecyclerListViewState> | undefined;

    private _setProgressiveListViewRef = (ref: RecyclerListView<RecyclerListViewProps, RecyclerListViewState>) => {
        this._recyclerListViewRef = ref;
    };

    private _getLayoutHeight(index: number) {
        return 100;
    }

    private onScroll = (_rawEvent: ScrollEvent, _offsetX: number, _offsetY: number) => {
        if (this._recyclerListViewRef) {
            const visibleIndex = this._recyclerListViewRef.findApproxFirstVisibleIndex();
            if (this.state.visibleIndex !== visibleIndex) {
                this.setState({
                    visibleIndex
                });
            }
        }
    };

    layoutProvider = new GridLayoutProvider(
        FULL_SPAN,
        (index: number) => 'Section',
        (index: number) => FULL_SPAN,
        (index: number) => this._getLayoutHeight(index)
    );

    private rowRenderer = (_: React.ReactText, section: any, index: number): JSX.Element | null => {
        return (
            <View>
                <View style={{padding: 16, backgroundColor: 'green'}}>
                    <Text> Header </Text>
                </View>
                {this.getBody(index)}
            </View>
        );
    };

    private getRandom() {
        return Math.floor(Math.random() * 6) + 1;
    }

    private getBody(index: number) {
        const viewList = [];
        for (let i = 0; i < this.getRandom(); i++) {
            viewList.push(<Text style={{padding: 8}}>{index}</Text>)
        }
        return <View>
            {viewList}
        </View>;
    }

    private getRightListItems() {
        return data.map((item, index) => {
            return <TouchableOpacity onPress={() => {
                this._recyclerListViewRef.scrollToIndex(index);
            }}>
                <Text style={{padding: 2, color: this.state.visibleIndex === index ? 'red' : 'black'}}>{item}</Text>
            </TouchableOpacity>
        });
    }

    render() {
        return (
            <View style={{height: 500, flexDirection: 'row'}}>
                <View style={{flex: 9}}>
                    <View style={{height: 100, backgroundColor: 'blue'}} />
                    <RecyclerListView
                        ref={this._setProgressiveListViewRef}
                        onScroll={this.onScroll}
                        layoutProvider={this.layoutProvider}
                        dataProvider={this.dataProvider}
                        rowRenderer={this.rowRenderer}
                        canChangeSize
                        forceNonDeterministicRendering
                    />
                </View>
                <View style={{flex: 1, backgroundColor: 'yellow', alignItems: 'center'}}>
                    {this.getRightListItems()}
                </View>
            </View>
        );
    }
}

const data = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
