import React from "react";
import dynamic from "next/dynamic";

const DynamicGame = dynamic(() => import("./components/Game"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Home() {
  return <DynamicGame />;
}
