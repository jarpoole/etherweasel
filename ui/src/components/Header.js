import React from "react";

class Header extends React.Component {
  renderDescription = (description) => {
    if (description) {
      return <p className="description">{this.props.description}</p>;
    }
  };
  render() {
    return (
      <React.Fragment>
        <h1 className="title">{this.props.title}</h1>
        {this.renderDescription(this.props.description)}
      </React.Fragment>
    );
  }
}
export default Header;
