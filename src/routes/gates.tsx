// import { MaxWidthBox } from "../components/MaxWidthBox";
import io from "socket.io-client";
import classnames from "classnames";
import { apiUrl } from "../config/app";
import { useCallback, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Gates() {
  const [gateId, setGateId] = useState("");
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [socketStatus, setSocketStatus] = useState<
    "idle" | "connecting" | "connected"
  >("idle");
  const [gateState, setGateState] = useState<"closed" | "open" | "denied">(
    "closed"
  );
  const [images, setImages] = useState<FileList | null>(null);
  const [qrSrc, setQrSrc] = useState<string | null>(null);

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
    for (const image of images ?? []) {
      formData.append("images", image);
    }

    console.log(images?.length);

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
                type="file"
                accept="image/*"
                onChange={(e) => setImages(e.target.files)}
              />
              <input
                type="text"
                className="rounded-md py-2 px-2 border border-gray-300 w-full"
                placeholder="Gate ID"
                value={gateId}
                onChange={(e) => setGateId(e.target.value)}
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
            <img src={qrSrc} alt="Gate QR code" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
