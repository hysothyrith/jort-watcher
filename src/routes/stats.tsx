import { MaxWidthBox } from "../components/MaxWidthBox";
import { useState } from "react";

interface Stats {
  smallVehicleCapacity: number;
  largeVehicleCapacity: number;
  smallVehicleCapacityAvailable: number;
  largeVehicleCapacityAvailable: number;
}

export default function Stats() {
  const [stats, setStats] = useState<Stats | null>({
    smallVehicleCapacity: 1000,
    smallVehicleCapacityAvailable: 100,
    largeVehicleCapacity: 100,
    largeVehicleCapacityAvailable: 100,
  });

  return (
    <div className="mt-8">
      <MaxWidthBox>
        <h1 className="prose prose-2xl font-semibold">Statistics</h1>
        <div className="mb-4"></div>

        <div className="grid grid-cols-2 gap-4 mb-32">
          <div>
            <h2 className="prose prose-lg font-semibold">Partner</h2>
            <div>Northeast Regionals Mall</div>
          </div>
          <div>
            <h2 className="prose prose-lg font-semibold">Parking Lot</h2>
            <div>North</div>
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
                  {stats.smallVehicleCapacityAvailable}
                </span>
                <span className="inline-block text-5xl -translate-y-2">/</span>
                <span className="inline-block text-5xl -translate-y-0.5">
                  {stats.smallVehicleCapacity}
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
