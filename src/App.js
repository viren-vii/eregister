import { useEffect, useState } from "react";
import "./App.css";
import { getStatus, signInUsingGoogle } from "./firebase";
import Clock from "./Components/Clock";
import { InfinitySpin } from "react-loader-spinner";

const App = () => {
  const [background, setBackground] = useState("#fff");
  const [backgroundOverlay, setBackgroundOverlay] = useState("#00000055");
  const [loading, setLoading] = useState(true);
  const [isIn, setIsIn] = useState(null);
  const [firstRender, setFirstRender] = useState(false);
  useEffect(() => {
    if (!firstRender) {
      getStatus(setBackground, setLoading, setIsIn);
      setFirstRender(true);
    }
  });

  const handleClick = async (click) => {
    setBackgroundOverlay(click === "en" ? "#66B03299" : "#ff370099");
    setLoading(true);
    signInUsingGoogle(setBackgroundOverlay, setLoading).then(() => {
      getStatus(setBackground, setLoading, setIsIn);
    });
  };

  return (
    <>
      {console.log(loading)}
      {loading ? (
        <div className="overlay" style={{ background: backgroundOverlay }}>
          <div className="overlay__inner">
            <div className="overlay__content">
              <InfinitySpin color="#fff" />
            </div>
          </div>
        </div>
      ) : (
        <div className="App" style={{ background: background }}>
          <Clock clr={isIn === null ? "#000" : "#fff"} />
          <div className="btn-div">
            {isIn === true ? (
              <button onClick={() => handleClick()} className="btn" id="leave">
                LEAVE
              </button>
            ) : (
              <button
                onClick={() => handleClick("en")}
                className="btn"
                id="enter"
              >
                ENTER
              </button>
            )}
          </div>
          <div>{isIn !== null && <p>YOU ARE {isIn ? "IN" : "OUT"}</p>}</div>
        </div>
      )}
    </>
  );
};

export default App;
