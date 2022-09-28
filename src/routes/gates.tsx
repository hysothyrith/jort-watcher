import classnames from "classnames";
import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import Webcam from "react-webcam";
import io from "socket.io-client";
import { apiUrl } from "../config/app";

export default function Gates() {
  const [gateId, setGateId] = useState("5ed8522a-784e-4561-89fb-4fd2c8eca1b1");
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [socketStatus, setSocketStatus] = useState<
    "idle" | "connecting" | "connected"
  >("idle");
  const [gateState, setGateState] = useState<"closed" | "open" | "denied">(
    "closed"
  );
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(
    () => webcamRef.current?.getScreenshot(),
    [webcamRef]
  );

  const openSocket = useCallback(() => {
    const socket = io(`${apiUrl}/gate`);
    setSocketStatus("connecting");

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

    socket.on("deny", () => {
      setGateState("denied");

      setTimeout(() => {
        setGateState("closed");
      }, 5000);
    });

    socket.on("toast", (payload) => {
      switch (payload.type) {
        case "success":
          return toast.success(payload.message, {
            duration: 10_000,
          });
        case "error":
          return toast.error(payload.message, {
            duration: 10_000,
          });
        default:
          return toast(payload.message, {
            duration: 10_000,
          });
      }
    });

    socket.on("disconnect", () => {
      setSocketStatus("idle");
      setQrSrc(null);
    });

    setSocket(socket);
  }, [gateId]);

  function captureImages(tenancyId: string) {
    console.info("capturing images...");

    const formData = new FormData();
    formData.append("tenancyId", tenancyId);
    formData.append("gateId", gateId);
    const image = capture();
    if (image) {
      fetch(image)
        .then((res) => res.blob())
        .then((blob) => new File([blob], "image.jpg", { type: "image/jpeg" }))
        .then((file) => {
          formData.append("images", file);

          fetch(`${apiUrl}/captures`, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then(console.log);
        });
    }
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
      className={classnames("h-full transition-colors ease-in duration-300", {
        "bg-green-500": gateState === "open",
        "bg-red-500": gateState === "denied",
      })}
    >
      <div className="flex h-full justify-center items-center">
        {socketStatus !== "connected" ? (
          <div className="rounded-md border border-gray-100 px-6 pb-8 pt-4 w-96 drop-shadow-lg bg-white -translate-y-16">
            <h2 className="prose prose-xl font-semibold mb-2">Gate Connect</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (gateId) {
                  openSocket();
                }
              }}
            >
              <input
                type="text"
                className="rounded-md py-2 px-2 border border-gray-300 w-full"
                placeholder="Gate ID"
                value={gateId}
                onChange={(e) => setGateId(e.target.value)}
                spellCheck={false}
              />

              <br />
              <div className="mb-2"></div>
              <button
                className="bg-gray-200 hover:bg-gray-300 py-2 px-5 rounded-md border border-gray-300 transition-colors text-slate-500 drop-shadow-sm"
                type="submit"
              >
                {socketStatus === "idle" ? "Connect" : "Connecting..."}
              </button>
            </form>
          </div>
        ) : null}
        {qrSrc ? (
          <div>
            <div className="-translate-y-32">
              <img src={qrSrc} alt="Gate QR code" />
            </div>
            <div className="absolute left-0 right-0 bottom-0 h-80 flex justify-center">
              <Webcam screenshotFormat="image/jpeg" ref={webcamRef} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
