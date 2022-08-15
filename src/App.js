import React, { useCallback, useState } from "react";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import "./App.css";

import { particlesOptions } from "./assets/constants";

const initialState = {
  input: "",
  imageUrl: "",
  boxes: [],
  route: "signin",
  isSignedIn: false,
  user: {},
};

function App() {
  const [formValues, setFormValues] = useState(initialState);
  const { input, imageUrl, boxes, route, isSignedIn, user } = formValues;

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  const calculateFaceLocation = (data) => {
    const regions = data.outputs[0].data.regions;

    return regions.map((region) => {
      const clarifaiFace = region.region_info.bounding_box;
      const image = document.getElementById("inputimage");
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
      };
    });
  };

  const resetFormFields = () => {
    setFormValues(initialState);
  };

  const onInputChange = (e) => {
    setFormValues({
      ...formValues,
      input: e.target.value,
      imageUrl: e.target.value,
      boxes: [],
    });
  };

  const onRouteChange = (route, user = null) => {
    if (route === "signout") {
      resetFormFields();
    } else if (route === "home") {
      setFormValues({ ...formValues, route, isSignedIn: true, user });
    } else {
      setFormValues({ ...formValues, route });
    }
  };

  const onButtonSubmit = () => {
    if (!input) {
      return;
    }
    fetch(`${process.env.REACT_APP_API}/imageurl`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          fetch(`${process.env.REACT_APP_API}/image`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: user.id }),
          })
            .then((response) => response.json())
            .then((count) => {
              setFormValues({
                ...formValues,
                user: { ...user, entries: count },
                boxes: calculateFaceLocation(result),
              });
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="App">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesOptions}
      />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />

      {route === "home" ? (
        <>
          <Logo />
          <Rank name={user?.name} entries={user?.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
        </>
      ) : route === "register" ? (
        <Register onRouteChange={onRouteChange} />
      ) : (
        <Signin onRouteChange={onRouteChange} />
      )}
    </div>
  );
}

export default App;
