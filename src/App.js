import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import { makeStyles } from "@material-ui/core";
import { LoadingButton } from "@mui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  box: {
    width: "400px",
    border: "1px solid",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "30px",
    borderRadius: "10px",
    gap: "20px",
  },
  error: {
    color: ({ error }) => (error?.severity === "error" ? "red" : "green"),
  },
}));

function App() {
  const [error, setError] = useState("");
  const classes = useStyles({ error });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialValue = {
    ModelId: "1224",
    RequestId: "231",
    CustomerId: "1234",
    PredictionInputs: [1.1, 2.2, 3.3],
  };

  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    getData();
    return () => {
      setData([]);
    };
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const data = await axios("/v1/api");
      setData(data?.data);
    } catch (error) {
      setError({ ...error?.response?.data, severity: "error" });
    }
    setLoading(false);
  };
  const createData = async () => {
    const emptyFields = Object.values(value).some(
      (x) => x === null || x === ""
    );
    if (emptyFields) {
      return setError({
        message: "All fields are requrierd",
        severity: "error",
      });
    }
    setLoading(true);
    try {
      const data = await axios.post("/v1/api", value);
      if (data?.status === 201) {
        setValue((prev) => ({
          ...prev,
          ModelId: String(parseInt(prev.ModelId) + 1),
        }));
        setData(data?.data);
        setError({ message: "its in", severity: "success" });
      }
    } catch (error) {
      setError({ ...error?.response?.data, severity: "error" });
    }
    setLoading(false);
  };
  const handleChange = (e) => {
    setValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };
  const inputFields = ["RequestId", "CustomerId", "ModelId"];
  return (
    <div className={classes.root}>
      <h1>some header</h1>
      <Box
        component="form"
        className={classes.box}
        noValidate
        autoComplete="off"
      >
        {error && <p className={classes.error}>{error.message}</p>}
        {inputFields.map((name) => (
          <Input
            key={name}
            placeholder={name}
            name={name}
            onChange={handleChange}
            value={value[name]}
          />
        ))}
        <LoadingButton
          variant="contained"
          onClick={createData}
          loading={loading}
        >
          Submit
        </LoadingButton>
      </Box>
    </div>
  );
}

export default App;
