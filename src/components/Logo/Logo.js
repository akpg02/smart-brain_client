import Tilt from "react-parallax-tilt";
import brain from "./brain.png";
import "./Logo.css";

const Logo = () => {
  return (
    <Tilt className="Tilt br2 shadow-2">
      <div className="Tilt-inner pa3" style={{ height: 150, width: 150 }}>
        <img src={brain} alt="logo" style={{ paddingTop: "5px" }} />
      </div>
    </Tilt>
  );
};

export default Logo;

/**
 *  <Tilt className="Tilt br2 shadow-2" perspective={500} scale={1.02}>
        <div className="Tilt-inner pa3" style={{ height: 150, width: 150 }}>
          <img src={brain} alt="logo" style={{ paddingTop: "5px" }} />
        </div>
      </Tilt>
 */
