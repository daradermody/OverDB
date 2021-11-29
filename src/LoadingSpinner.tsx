import {CircularProgress} from "@material-ui/core";
import * as React from "react";

export default function LoadingSpinner() {
  return <div style={{display: "flex", justifyContent: "center", marginTop: 200}}>
    <CircularProgress size={300} thickness={1}/>
  </div>;
}
