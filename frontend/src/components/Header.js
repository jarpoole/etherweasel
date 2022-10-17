import React from "react";

function UnstyledLink(props) {
  return (
    <React.Fragment>
      <h1>{props.title}</h1>
      <p class="description">{props.description}</p>
      {props.children}
    </React.Fragment>
  );
}

export default UnstyledLink;
