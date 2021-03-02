import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
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

function CartaAutocomplete(props) {
  const classes = useStyles(props);

  return (
    <div
      className={`${classes.root} ${props?.className ? props.className : ""}`}
    >
      <Autocomplete
        fullWidth
        id={props.id}
        value={props.value}
        onChange={(event, newValue) => {
          if (
            props.onChange &&
            ((props.mask &&
              (event.target.value.match(new RegExp(props.mask)) ||
                event.target.value === "")) ||
              !props.mask)
          )
            props.onChange(props.id, newValue);
        }}
        options={props.options ? props.options : []}
        getOptionLabel={props.getOptionLabel ?? props.getOptionLabel}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.label}
            variant="outlined"
            size="small"
            autoComplete="nope"
          />
        )}
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
export default React.memo(CartaAutocomplete, deepEqualObjects);
