import React, {Component} from "react";
import List from "../List/List";

class ListsContainer extends Component {
    state = {
        listGroup: {
            lists: [],
            /**
             *
             {
                    listId: 1,
                    listName: 'List 1',
                    listCounter:2,
                    items: [{itemId: 1, listId:1, itemText: 'Item 1-1'}, {itemId: 2, listId:1, itemText: 'Item 1-2'}]
                },
             {listId: 2, listName: 'List 2', itemCounter:1,items: [{itemId: 1, listId:2, itemText: 'Item 2-1'}]},
             {listId: 3, listName: 'List 3', itemCounter:1,items: [{itemId: 1, listId:3, itemText: 'Item 3-1'}]}

             *
             * */
            previousListGroup: undefined,
            nextListGroup: undefined,
            listCounter: 0,
            updateId: 0
        },
        updates: {
            count: 0, updateList: [{
                updateId: 0,
                update: 'Inital State before updates',
                current: true
            }]
        },
    }
    itemAddHandler = (selectedlist) => {
        let newState = {};
        newState.listGroup = {...this.state.listGroup};
        newState.listGroup.lists = this.state.listGroup.lists.map((currentList) => {
            if (currentList.listId === selectedlist.listId) {
                let newList = {...selectedlist};
                newList.items = selectedlist.items.concat({
                    itemId: selectedlist.itemCounter + 1,
                    listId: selectedlist.listId,
                    itemText: ''
                });
                newList.itemCounter = selectedlist.itemCounter + 1;
                return newList;
            }
            return currentList;
        });
        let message = 'New Item was added at the end of ' + selectedlist.listName;
        this.mapUpdatesForNewState(newState, message);
        newState.listGroup.updateId = newState.updates.count;
        newState.listGroup.previousListGroup = {...this.state.listGroup};
        newState.listGroup.nextLists = undefined;
        this.setState(newState);
    }

    itemUpdateHandler = (event, item) => {
        if (item.itemText === event.target.value) {
            return;
        }
        let newState = {};
        newState.listGroup = {...this.state.listGroup};
        newState.listGroup.lists = this.state.listGroup.lists.slice();
        let newList = undefined;
        newState.listGroup.lists = this.state.listGroup.lists.map((list) => {
                let listItem = this.findEditedItem(list, item);
                if (listItem) {
                    newList = {...list};
                    return this.updatedList(list, listItem, event);
                }
                return list;
            }
        );
        let message = 'You updated Item "' + item.itemText + '" in the list ' + newList.listName + ' to "' + event.target.value + '"';
        this.mapUpdatesForNewState(newState, message);
        newState.listGroup.updateId = newState.updates.count;
        newState.listGroup.previousListGroup = {...this.state.listGroup};
        newState.listGroup.nextLists = undefined;
        this.setState(newState);
    }

    mapUpdatesForNewState(newState, message) {
        newState.updates = {...this.state.updates};
        newState.updates.count = this.state.updates.count + 1;

        newState.updates.updateList = this.state.updates.updateList.concat({
            updateId: this.state.updates.count + 1,
            update: message,
            current: true
        });
    }

    findEditedItem(list, item) {
        return list.items.find((listItem) => listItem.itemId === item.itemId && listItem.listId === item.listId);
    }

    updatedList(list, listItem, event) {
        let newList = {...list};
        newList.items = list.items.map(
            (item) => {
                if (item === listItem) {
                    let newItem = {...listItem};
                    let originalText = event.target.value
                    newItem.itemText = originalText;
                    return newItem;
                }
                return item;
            }
        )
        return newList;
    }

    onUndoClick = (event) => {
        let prevListGroup = {...this.state.listGroup.previousListGroup};
        prevListGroup.nextListGroup = {...this.state.listGroup};
        this.setState({listGroup: prevListGroup});
    }
    onRedoClick = (event) => {
        let nextListGroup = {...this.state.listGroup.nextListGroup};
        this.setState({listGroup: nextListGroup});
    }
    onAddListClick = (event) => {
        let newState = {...this.state}
        newState.listGroup = {...this.state.listGroup};
        let listCounter = this.state.listGroup.listCounter + 1;
        newState.listGroup.lists = this.state.listGroup.lists.concat({
            listId: listCounter,
            listName: 'List ' + (listCounter),
            itemCounter: 0,
            items: []
        })
        newState.listGroup.listCounter = listCounter;
        this.setState(newState);
    }

    render() {
//        console.log('[ListsContainer.js]', this.state);
        return (
            <div>
                <div className='card'>
                    <div className='form-inline'>
                        <button onClick={this.onAddListClick}>Add List</button>
                        <button onClick={this.onUndoClick} disabled={!this.state.listGroup.previousListGroup}>Undo
                        </button>
                        <button onClick={this.onRedoClick} disabled={!this.state.listGroup.nextListGroup}>Redo</button>
                    </div>
                    <div>
                        {this.state.listGroup.lists.map(
                            (itemList) => <List key={itemList.listId} list={itemList}
                                                itemUpdateHandler={this.itemUpdateHandler}
                                                itemAddHandler={this.itemAddHandler}/>
                        )}
                    </div>
                </div>
                <hr/>
                <div className='card'>
                    <div className='card-header'>Updates</div>
                    <ol className='list-group list-group-flush'>
                        {this.state.updates.updateList.map((update) => <li
                            className={update.updateId === this.state.listGroup.updateId ? 'list-group-item active' : 'list-group-item'}
                            key={update.updateId}>{update.update}</li>)}
                    </ol>
                </div>
            </div>
        )
    }
}

export default ListsContainer;