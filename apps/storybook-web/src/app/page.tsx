import type { Metadata } from "next";

import TradingViewChart from "../components/TradingViewChart";
import { Button } from "ui/components/button";

export const metadata: Metadata = {
  title: "Web - Turborepo Example",
};

export default function Home() {
  return (
    <>
      <TradingViewChart symbol="IP/USDC" interval="1H" />
    </>
  );
}
