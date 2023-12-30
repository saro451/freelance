"use client";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.layer.css";
// import "@mantine/modals/styles.css";

const theme = createTheme({
  primaryColor: "#fff",
});

export const Mantine = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider defaultColorScheme="light" forceColorScheme="light">
      <Notifications transitionDuration={1} color="black" />
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
};

export default Mantine;
