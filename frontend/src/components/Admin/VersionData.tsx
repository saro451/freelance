import { Button, Grid, GridCol, Group, Textarea } from "@mantine/core";
import VersionItems from "./VersionItems";

export default function VersionData({
  versionData,
  setBlue,
  el,
  keys,
  category,
}: any) {
  return (
    <Grid mt={"lg"}>
      <GridCol span={2} mt={"sm"}>
        {el.keys.key}
      </GridCol>
      <GridCol span={"auto"}>
        {Object.entries(el.languages).map(([key, value]: any, index) => (
          <VersionItems
            key={index}
            keg={key}
            value={value}
            keys={keys}
            category={category}
          />
        ))}
      </GridCol>
    </Grid>
  );
}
