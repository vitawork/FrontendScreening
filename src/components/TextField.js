import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import HelpOutlineTwoToneIcon from "@material-ui/icons/HelpOutlineTwoTone";
import Tooltip from "@material-ui/core/Tooltip";
import { deepEqualObjects } from "../utils/deepEqual";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    display: "flex",
    alignItems: "center",
    width: (props) => props.width,
  },
  icon: { margin: 0, color: theme.palette.secondary.main },
}));

function CartaTextField(props) {
  const classes = useStyles(props);

  return (
    <div
      className={`${classes.root} ${props.className ? props.className : ""}`}
    >
      <TextField
        fullWidth
        id={props.id}
        label={props.label}
        value={props.value}
        onChange={(event) => {
          if (
            props.onChange &&
            ((props.mask &&
              (event.target.value.match(new RegExp(props.mask)) ||
                event.target.value === "")) ||
              !props.mask)
          )
            props.onChange(props.id, event.target.value);
        }}
        variant="outlined"
        size="small"
        autoComplete="nope"
        style={{ maxWidth: props.maxWidth }}
      />

      {props.definition && props.show && (
        <Tooltip
          title={
            <h3 style={{ fontFamily: "Libre Franklin, Sans-serif" }}>
              {props.definition}
            </h3>
          }
          placement="right"
        >
          <HelpOutlineTwoToneIcon className={classes.icon} />
        </Tooltip>
      )}
    </div>
  );
}

// Reduce the renders number comming from the parent changes, it will rerender only if a non functional prop change //
export default React.memo(CartaTextField, deepEqualObjects);
