import React, { Component } from 'react';
import './App.css';

import { Button, Card, CardBody, CardImage, CardTitle, CardText } from 'mdbreact';
import firebase from './firebase'

class App extends Component {
    constructor() {
        super();
        this.state={
            currentItem: '',
            username: '',
            items: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const itemsRef = firebase.database().ref('items');
        const item = {
            title: this.state.currentItem,
            user: this.state.username
        }
        itemsRef.push(item);
        this.setState({
            currentItem: '',
            username: ''
        });
    }
    componentDidMount() {
        const itemsRef = firebase.database().ref('items');
        itemsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            let newState = [];
            for (let item in items) {
                newState.push({
                    id: item,
                    title: items[item].title,
                    user: items[item].user
                });
            }
            this.setState({
                items: newState
            });
        });
    }
    removeItem(itemId) {
        const itemRef = firebase.database().ref(`/items/${itemId}`);
        itemRef.remove();
    }

  render() {
    return (
      <div className="App">
        <div>
          <header>
            <h1>Pot Luck Planner</h1>
          </header>
        </div>
        <div className="container row">
            <CardBody>
                <Card>
                    <section className="add-item col-lg-8">
                            <form onSubmit={this.handleSubmit}>
                                <br/>
                                <input type="text" name="username" placeholder="What's your name?" onChange={this.handleChange} value={this.state.username}/>
                                <input type="text" name="currentItem" placeholder="What's for dinner?" onChange={this.handleChange} value={this.state.currentItem}/>
                                <Button color="primary" size="sm" onClick={this.handleSubmit}>
                                    Add Item
                                </Button>
                                <br/>
                            </form>
                    </section>
                </Card>
            </CardBody>
            <section className='display-item'>
                <div className="wrapper">
                    <ul>
                        {this.state.items.map((item) => {
                            return (
                                <CardBody>
                                    <Card>
                                        <ul key={item.id}>
                                            <h3>{item.title}</h3>
                                                <br/>
                                            <p>brought by: {item.user}
                                                <br/>
                                                <Button size="sm" color="primary" onClick={() => this.removeItem(item.id)}>Remove Item</Button>
                                            </p>
                                        </ul>
                                    </Card>
                                </CardBody>
                            )
                        })}
                    </ul>
                </div>
            </section>
        </div>
      </div>
    );
  }
}

export default App;
