import React from "react";

class Header extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>{this.props.title}</h1>
        <p className="description">{this.props.description}</p>
      </React.Fragment>
    );
  }
}
export default Header;
