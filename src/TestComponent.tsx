import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {DataProvider, GridLayoutProvider, RecyclerListView} from "recyclerlistview";
import {RecyclerListViewProps, RecyclerListViewState} from "recyclerlistview/dist/reactnative/core/RecyclerListView";
import {ScrollEvent} from "recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView";

const FULL_SPAN = 12;

interface TestComponentState {
    visibleIndex: number;
}

const actualHeights = {
    "0": 241.42857360839844,
    "1": 233.42857360839844,
    "2": 421.1428527832031,
    "3": 233.42857360839844,
    "4": 139.7142791748047,
    "5": 139.7142791748047,
    "6": 233.42857360839844,
    "7": 233.42857360839844,
    "8": 139.7142791748047,
    "9": 233.42857360839844,
    "10": 233.42857360839844,
    "11": 327.4285583496094,
    "12": 233.42857360839844,
    "13": 139.7142791748047,
    "14": 421.1428527832031,
    "15": 139.7142791748047,
    "16": 233.42857360839844
    };

    const staticHeights = {
        "0": 231.71428571428572,
        "1": 223.71428571428572,
        "2": 407.42857142857144,
        "3": 223.71428571428572,
        "4": 131.85714285714286,
        "5": 131.85714285714286,
        "6": 223.71428571428572,
        "7": 223.71428571428572,
        "8": 131.85714285714286,
        "9": 223.71428571428572,
        "10": 223.71428571428572,
        "11": 315.57142857142856,
        "12": 223.71428571428572,
        "13": 131.85714285714286,
        "14": 407.42857142857144,
        "15": 131.85714285714286,
        "16": 223.71428571428572,
        "17": 223.71428571428572,
        "18": 131.85714285714286,
        "19": 131.85714285714286,
        "20": 223.71428571428572,
        "21": 131.85714285714286,
        "22": 131.85714285714286,
        "23": 131.85714285714286
    };

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
        // return this.getRandom() * 10;
        return staticHeights[index];
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
            <View style={{backgroundColor: 'teal', height: actualHeights[index]}}>
                <View style={{padding: 16, backgroundColor: 'green'}}>
                    <Text>{index}</Text>
                </View>
                {/* {this.getBody(index)} */}
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
                <View style={{flex: 9, borderColor: 'blue', borderWidth: 2}}>
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
