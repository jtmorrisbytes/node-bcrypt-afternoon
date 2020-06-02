import React, { Component } from "react";
import Axios from "axios";

export default class AddTreasure extends Component {
  constructor() {
    super();
    this.state = {
      treasureURL: "",
    };
  }

  handleInput(e) {
    this.setState({ treasureURL: e.target.value });
  }

  addTreasure() {
    Axios.post("/api/treasure/user", { treasureURL: this.state.treasureURL })
      .then((res) => {
        this.props.addMyTreasure(res.data);
      })
      .catch((e) => {
        console.log(e);
        try {
          let parsed = JSON.parse(e.response.request.response);
          alert(parsed.error);
        } catch (e) {
          console.error(e);
          alert("an unhandled error occurred when adding user treasure");
        }
      });
  }

  render() {
    return (
      <div className="addTreasure">
        <input
          type="text"
          placeholder="Add image URL"
          onChange={(e) => this.handleInput(e)}
          value={this.state.treasureURL}
        />
        <button onClick={() => this.addTreasure()}>Add</button>
      </div>
    );
  }
}
