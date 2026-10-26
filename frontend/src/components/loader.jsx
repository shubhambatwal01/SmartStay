import { TailSpin } from "react-loader-spinner";
import { useState } from "react";

function Loader({ fullscreen = true }) {
  const [loading] = useState(true);

  return (
    <div
      className={
        fullscreen
          ? "min-h-screen w-full flex items-center justify-center"
          : "flex items-center justify-center"
      }
    >
      <TailSpin
        height={fullscreen ? "100" : "20"}
        width={fullscreen ? "80" : "20"}
        color="#ff5a5f"
        ariaLabel="tail-spin-loading"
        visible={loading}
      />
    </div>
  );
}

export default Loader;
