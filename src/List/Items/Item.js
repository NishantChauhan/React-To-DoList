import React, {Component} from "react";

class Item extends Component {
    state = {editable: false};
    onBlurEvent = (event, item) => {
        this.props.onItemUpdate(event, this.props.item);
        this.setState({editable: false});
    }
    onEditButtonClick = () => {
        this.setState({editable: true});
    }

    render() {
        if (!this.state.editable) {
            return (
                <div className='form-inline'>
                    <li className="list-group-item"> {this.props.item.itemText}</li>
                    <button onClick={this.onEditButtonClick}>Edit</button>
                </div>
            );
        } else {
            return (
                <input className="list-group-item" type='text'
                       onBlur={(event) => this.onBlurEvent(event, this.props.item)}
                        defaultValue={this.props.item.itemText}
                />
            );
        }
    }
}

export default Item;