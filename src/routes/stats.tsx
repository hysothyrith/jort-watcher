import { MaxWidthBox } from "../components/MaxWidthBox";
import { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { apiUrl } from "../config/app";
import toast from "react-hot-toast";

interface Stats {
  smallVehicleCapacity: number;
  largeVehicleCapacity: number;
  smallVehicleCapacityAvailable: number;
  largeVehicleCapacityAvailable: number;
}

export default function Stats() {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [socketStatus, setSocketStatus] = useState<
    "idle" | "connecting" | "connected"
  >("idle");
  const [parkingLotId, setParkingLotId] = useState(
    "95d67b52-bcad-4b09-ad60-36e92bca6991"
  );
  const [partnerName, setPartnerName] = useState("--");
  const [parkingLotName, setParkingLotName] = useState("--");
  const [stats, setStats] = useState<Stats | null>({
    smallVehicleCapacity: 1000,
    smallVehicleCapacityAvailable: 100,
    largeVehicleCapacity: 100,
    largeVehicleCapacityAvailable: 100,
  });

  const openSocket = useCallback(() => {
    const socket = io(`${apiUrl}/stats`);
    setSocketStatus("connecting");

    socket.emit("subscribe", { parkingLotId });

    socket.on("connected", (payload) => {
      setSocketStatus("connected");
    });

    socket.on("subscribed", (payload) => {
      setPartnerName(payload.partnerName);
      setParkingLotName(payload.parkingLotName);
      setStats({ ...payload });
    });

    socket.on("changed", (payload) => {
      console.log(payload);
      setStats({ ...payload });
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
    });

    setSocket(socket);
  }, [parkingLotId]);

  useEffect(() => {
    openSocket();
  }, []);

  return (
    <div className="mt-8">
      <MaxWidthBox>
        <h1 className="prose prose-2xl font-semibold">Statistics</h1>
        <div className="mb-4"></div>

        <div className="grid grid-cols-2 gap-4 mb-32">
          <div>
            <h2 className="prose prose-lg font-semibold">Partner</h2>
            <div>{partnerName}</div>
          </div>
          <div>
            <h2 className="prose prose-lg font-semibold">Parking Lot</h2>
            <div>{parkingLotName}</div>
          </div>
        </div>

        {stats ? (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h2 className="prose text-5xl font-semibold">Small Vehicles</h2>
              <div>
                <span className="text-9xl font-bold">
                  {stats.smallVehicleCapacityAvailable}
                </span>
                <span className="inline-block text-5xl -translate-y-2">/</span>
                <span className="inline-block text-5xl -translate-y-0.5">
                  {stats.smallVehicleCapacity}
                </span>
              </div>
              <div className="text-3xl">spots available</div>
            </div>

            <div>
              <h2 className="prose text-5xl font-semibold">Large Vehicles</h2>
              <div>
                <span className="text-9xl font-bold">
                  {stats.largeVehicleCapacityAvailable}
                </span>
                <span className="inline-block text-5xl -translate-y-2">/</span>
                <span className="inline-block text-5xl -translate-y-0.5">
                  {stats.largeVehicleCapacity}
                </span>
              </div>
              <div className="text-3xl">spots available</div>
            </div>
          </div>
        ) : null}
      </MaxWidthBox>
    </div>
  );
}
