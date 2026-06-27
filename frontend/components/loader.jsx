import { TailSpin } from "react-loader-spinner";
import {useState} from 'react'

function Loader() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <TailSpin
        height="100"
        width="60"
        color="#ff5a5f"
        ariaLabel="tail-spin-loading"
        visible={loading}
      />
    </div>
  );
}

export default Loader;
