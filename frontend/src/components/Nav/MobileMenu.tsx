import {
  Center,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  ScrollArea,
  ScrollAreaAutosize,
  Text,
} from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import {
  IconFileFilled,
  IconUser,
  IconSettings,
  IconBook,
  IconTag,
  IconFileDescription,
  IconX,
  IconReceiptTax,
  IconClipboardList,
  IconCloudUpload,
  IconLogout,
  IconCreditCard,
  IconCircleX,
} from "@tabler/icons-react";
import Link from "next/link";

const collections = [
  { emoji: <IconFileFilled color="#54cfff" />, label: "Invoices", link: "" },
  { emoji: <IconUser color="#28ffc1" />, label: "Customer", link: "client" },
  {
    emoji: <IconSettings color="#54cfff" />,
    label: "My Business",
    link: "server",
  },
  {
    emoji: <IconBook color="#5ae2ff" />,
    label: "Invoice Journal",
    link: "extra",
  },
  {
    emoji: <IconTag color="#ffb257" />,
    label: "Price List",
    link: "dashboard/pricelist",
  },
  {
    emoji: <IconFileDescription color="#54cfff" />,
    label: "Multiple Invoicing",
    link: "",
  },
  {
    emoji: <IconCircleX color="#ff4b97" />,
    label: "Unpaid Invoices",
    link: "",
  },
  { emoji: <IconReceiptTax color="#f7c90b" />, label: "Offer", link: "" },
  {
    emoji: <IconClipboardList color="#16ceff" />,
    label: "Inventory Control",
    link: "",
  },
  {
    emoji: <IconCreditCard color="#1b9aff" />,
    label: "Member Invoicing",
    link: "",
  },
  {
    emoji: <IconCloudUpload color="#82b1ff" />,
    label: "Import / Export",
    link: "",
  },
  { emoji: <IconLogout color="#6effca" />, label: "Log out", link: "" },
];

export default function MobileMenu() {
  const collectionlink = collections.map((collection) => (
    <Link href={"/" + collection.link} key={collection.label} className="">
      <Menu.Item
        leftSection={collection.emoji}
        className="hover:bg-[#eaeaea]"
        py={21}
      >
        <span
          className={
            "flex gap-3 hover:bg-[#ede7f6] rounded-lg duration-700 hover:text-[#7754bd] font-[300] tracking-wide"
          }
        >
          {/* {collection.emoji} */}
          <p className="text-sm">{collection.label}</p>
        </span>
      </Menu.Item>
    </Link>
  ));
  return (
    <Menu shadow="lg" width={250} zIndex={20}>
      <MenuTarget>
        <IconMenu2
          className="user-det-icon my-4 cursor-pointer"
          size={28}
          strokeWidth={2}
          color="white"
        />
      </MenuTarget>

      <MenuDropdown
        className="mobile-dropdown-work"
        style={{
          top: 0,
        }}
      >
        <MenuItem w={50}>
          <IconX />
        </MenuItem>

        <Center mt={14}>
          <Text>Menu</Text>
        </Center>
        <Menu.Divider color="#80bee2" />
        <ScrollArea h={"100vh"}>{collectionlink}</ScrollArea>
      </MenuDropdown>
    </Menu>
  );
}
