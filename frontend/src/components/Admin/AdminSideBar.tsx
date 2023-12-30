"use client";
import {
  Group,
  Code,
  ScrollArea,
  rem,
  Text,
  Title,
  Button,
} from "@mantine/core";
import { IconNotes } from "@tabler/icons-react";
// import { UserButton } from "../UserButton/UserButton";
import { LinksGroup } from "./NavbarLinksGroup";
// import { Logo } from './Logo';
import classes from "./NavbarNested.module.css";
import ClearCache from "./ClearCache";

const mockdata = [
  //   { label: "Dashboard", icon: IconGauge },
  {
    label: "Language",
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: "Edit Language", link: "/admin" },
      { label: "Add Language", link: "/admin/languages/add" },
    ],
  },
  //   {
  //     label: "Releases",
  //     icon: IconCalendarStats,
  //     links: [
  //       { label: "Upcoming releases", link: "/" },
  //       { label: "Previous releases", link: "/" },
  //       { label: "Releases schedule", link: "/" },
  //     ],
  //   },
  //   { label: "Analytics", icon: IconPresentationAnalytics },
  //   { label: "Contracts", icon: IconFileAnalytics },
  //   { label: "Settings", icon: IconAdjustments },
  //   {
  //     label: "Security",
  //     icon: IconLock,
  //     links: [
  //       { label: "Enable 2FA", link: "/" },
  //       { label: "Change password", link: "/" },
  //       { label: "Recovery codes", link: "/" },
  //     ],
  //   },
];

export default function AdminSideBar() {
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Title
            className="text-white shadow-md py-5 w-full"
            px={"32px"}
            pt={"sm"}
            size={"24px"}
          >
            Admin Dashboard
          </Title>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <ClearCache />
      </div>
    </nav>
  );
}
