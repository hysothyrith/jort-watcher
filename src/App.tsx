import "./App.css";
import io from "socket.io-client";
import classnames from "classnames";
import { apiUrl } from "./config/app";
import { useCallback, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [gateId, setGateId] = useState("");
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [socketStatus, setSocketStatus] = useState<"idle" | "connected">(
    "idle"
  );
  const [gateState, setGateState] = useState<"closed" | "open">("closed");
  const [images, setImages] = useState<FileList | null>(null);
  const [qrSrc, setQrSrc] = useState<string | null>(null);

  const openSocket = useCallback(() => {
    const socket = io(`${apiUrl}/gate`);

    socket.emit("start", { gateId });

    socket.on("connected", (payload) => {
      setSocketStatus("connected");
      setQrSrc(payload.qr);
    });

    socket.on("capture", (payload) => {
      captureImages(payload.tenancyId);
    });

    socket.on("allow", () => {
      openGate();
    });

    socket.on("toast", (payload) => {
      switch (payload.type) {
        case "success":
          return toast.success(payload.message);
        case "error":
          return toast.error(payload.message);
        default:
          return toast(payload.message);
      }
    });

    socket.on("disconnect", () => {
      setSocketStatus("idle");
    });

    setSocket(socket);
  }, [gateId]);

  function captureImages(tenancyId: string) {
    console.info("capturing images...");

    const formData = new FormData();
    formData.append("tenancyId", tenancyId);
    formData.append("gateId", gateId);
    for (const image of images ?? []) {
      formData.append("images", image);
    }

    fetch(`${apiUrl}/captures`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(console.log);
  }

  function openGate() {
    console.info("opening gate...");

    setGateState("open");

    setTimeout(() => {
      setGateState("closed");
    }, 5000);
  }

  return (
    <div
      className={classnames("app", {
        "bg-green-500": gateState === "open",
      })}
    >
      <Toaster />
      {socketStatus === "idle" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (gateId) {
              openSocket();
            }
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImages(e.target.files)}
          />
          <input
            type="text"
            value={gateId}
            onChange={(e) => setGateId(e.target.value)}
          />
          <button type="submit">Connect</button>
        </form>
      ) : (
        <div>
          <h1>Connected</h1>
          {qrSrc ? (
            <div>
              <img src={qrSrc} alt="QR code" />
            </div>
          ) : null}
        </div>
      )}

      <h2>Gate is {gateState}.</h2>
    </div>
  );
}

export default App;
