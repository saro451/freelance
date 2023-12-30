import { Config } from "@/lib/Config";

interface BackgroundProps {
  height: string;
}

export default function SecondBack({ height }: BackgroundProps) {
  const config = Config();
  return (
    <>
      {config.image ? (
        <div
          style={{
            position: "fixed",
            height: "100vh",
          }}
        >
          <img
            id="background-img"
            src={config.image}
            alt={"Image"}
            style={{
              width: "100%",
              height: "100%",
              position: "fixed",
              top: "0",
              left: "0",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
