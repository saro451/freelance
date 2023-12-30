import { Config } from "@/lib/Config";

interface BackgroundProps {
  height: string;
}

export default function Back({ height }: BackgroundProps) {
  const config = Config();
  return (
    <>
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100vh",
        }}
      >
        <img
          src={config.image}
          alt=""
          style={{
            width: "100%",
            minHeight: "100%",
            objectFit: "cover",
            objectPosition: "center",
            zIndex: "-10",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />
      </div>
    </>
  );
}
