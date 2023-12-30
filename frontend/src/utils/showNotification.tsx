import { notifications } from "@mantine/notifications";
import { IconCheck, IconExclamationMark } from "@tabler/icons-react";

const NOTIFICATION_DURATION = 8000;

export const showNotification = (response: any) => {
  const statusCode = response.status;
  const message = response.data.message;

  const notificationProps = {
    withCloseButton: true,
    autoClose: NOTIFICATION_DURATION,
    title: message,
    message: "",
    loading: false,
  };

  if (!message) {
    return;
  }

  if (message && statusCode >= 200 && statusCode < 300) {
    notifications.show({
      ...notificationProps,
      color: "green",
      icon: <IconCheck className="font-[900] text-white text-lg" />,
      styles: (theme) => ({
        title: { color: theme.black },
        description: { color: theme.black },
      }),
      style: { backgroundColor: "#ebfbf5" },
    });
  } else {
    notifications.show({
      ...notificationProps,
      color: "red",
      icon: <IconExclamationMark className="font-[900] text-white text-lg" />,
      styles: (theme) => ({
        title: { color: theme.black },
        description: { color: theme.black },
      }),
      style: { backgroundColor: "#fdedef" },
    });
  }
};
