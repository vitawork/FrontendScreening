import React, { useEffect, useState } from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "./components/TextField";
import Autocomplete from "./components/Autocomplete";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import ProgressBar from "react-customizable-progressbar";
import Button from "@material-ui/core/Button";
const data = require("./files/data");

const useStyles = makeStyles((theme) => ({
  header: {
    alignItems: "center",
    padding: "35px 20px",
    display: "flex",
    "& .RCP": {
      height: "100px",
      "& h5": {
        margin: 0,
      },
    },
    "& h1": {
      width: "75%",
      color: "#000000",
      fontFamily: "Fjalla One, Sans-serif",
      fontSize: "52px",
      fontWeight: "400",
      textTransform: "uppercase",
      padding: 0,
      margin: 0,
      lineHeight: 1,
    },
  },
  root: {
    margin: "auto",
    padding: "5px 15px 5px 10px",
    width: "600px",
    backgroundColor: "#80808014",
    fontFamily: "Fjalla One, Sans-serif",
  },
}));

function App() {
  const classes = useStyles();
  const [values, setValues] = useState(null);
  const [progress, setProgress] = useState({ remaining: 0, total: 0 });

  useEffect(() => {
    if (values) {
      let total = 0;
      let remaining = 0;
      for (const k in values) {
        const field = values[k];
        if (
          field.type === "select" ||
          field.type === "text" ||
          field.type === "number"
        ) {
          if (!field.dependencies || allDependenciesTrue(field.dependencies)) {
            total++;
            if (
              (field.type === "select" && !field.value) ||
              ((field.type === "text" || field.type === "number") &&
                field.value.trim() === "")
            )
              remaining++;
          }
        }
      }
      setProgress({ remaining, total });
    }
  }, [values]);

  useEffect(() => {
    const defaultDataValues = {};
    for (const k in data) {
      const section = data[k];

      for (let i = 0; i < section.length; i++) {
        const fieldProps = section[i];

        if (fieldProps.type === "checkbox")
          defaultDataValues[fieldProps.id] = { value: false, ...fieldProps };
        if (fieldProps.type === "text" || fieldProps.type === "number")
          defaultDataValues[fieldProps.id] = { value: "", ...fieldProps };
        if (fieldProps.type === "select")
          defaultDataValues[fieldProps.id] = { value: null, ...fieldProps };
      }
    }
    setValues(defaultDataValues);
  }, [data]);

  const allDependenciesTrue = (dependencies) => {
    for (const fielsName in dependencies) {
      if (
        (typeof dependencies[fielsName] === "boolean" &&
          dependencies[fielsName] !== values[fielsName].value) ||
        (typeof dependencies[fielsName] === "function" &&
          !dependencies[fielsName](values[fielsName].value))
      )
        return false;
    }
    return true;
  };

  const handleChange = (id, value) => {
    setValues((values) => ({
      ...values,
      [id]: {
        ...values[id],
        value: value,
      },
    }));
  };

  return (
    values && (
      <form className={`${classes.root} App`}>
        <div className={classes.header}>
          <h1>Please fill the following fields.</h1>
          <ProgressBar
            progress={
              ((progress.total - progress.remaining) * 100) / progress.total
            }
            radius={50}
            cut={150}
            rotate={165}
            strokeWidth={6}
            trackStrokeWidth={12}
            strokeColor="#549ec7"
            // pointerRadius={5}
            initialAnimation={true}
            initialAnimationDelay={500}
            children={
              <div
                style={{
                  position: "absolute",
                  top: "43px",
                  width: "140px",
                  fontWeight: "300",
                }}
              >
                <h5>{progress.total} Total</h5>
                <h5>{progress.remaining} Remaining</h5>
              </div>
            }
          />
        </div>

        {Object.keys(data)?.map((key) => (
          <section key={key}>
            <h1
              style={{
                color: "#000000",
                fontFamily: "Fjalla One, Sans-serif",
                fontWeight: "400",
              }}
            >
              {key}
            </h1>
            {data[key]?.map((fieldProps) => {
              const show =
                !fieldProps.dependencies ||
                allDependenciesTrue(fieldProps.dependencies);

              if (fieldProps.type === "text" || fieldProps.type === "number")
                return (
                  <TextField
                    key={fieldProps.id}
                    id={fieldProps.id}
                    className={`show_${show}`}
                    label={fieldProps.label}
                    definition={fieldProps.definition}
                    value={values[fieldProps.id].value}
                    onChange={handleChange}
                    mask={fieldProps.mask}
                    show={show}
                  />
                );

              if (fieldProps.type === "select")
                return (
                  <Autocomplete
                    key={fieldProps.id}
                    id={fieldProps.id}
                    className={`show_${show}`}
                    label={fieldProps.label}
                    options={fieldProps.sourceList}
                    getOptionLabel={(option) =>
                      fieldProps.id === "country" ? option.name : option
                    }
                    definition={fieldProps.definition}
                    value={values[fieldProps.id].value}
                    onChange={handleChange}
                    mask={fieldProps.mask}
                    show={show}
                  />
                );

              if (fieldProps.type === "checkbox")
                return (
                  <FormControlLabel
                    key={fieldProps.id}
                    control={
                      <Checkbox
                        id={fieldProps.id}
                        checked={values[fieldProps.id].value}
                        onChange={(event) => {
                          handleChange(fieldProps.id, event.target.checked);
                        }}
                        color="primary"
                      />
                    }
                    label={fieldProps.label}
                  />
                );
            })}
          </section>
        ))}

        <div style={{ padding: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            // disabled={progress.remaining !== 0}
            style={{
              minWidth: "200px",
              fontFamily: "Fjalla One, Sans-serif",
              fontSize: "18px",
              backgroundColor: "#272727",
            }}
          >
            Submit
          </Button>
        </div>
      </form>
    )
  );
}

export default App;
