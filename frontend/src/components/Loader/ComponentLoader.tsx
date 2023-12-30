import React from "react";
import { Center, Loader } from "@mantine/core";

export default function ComponentLoader() {
  return (
    <Center>
      <Loader py={30} my={30} size={30} />
    </Center>
  );
}
