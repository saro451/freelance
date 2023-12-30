import cx from "clsx";
import { Button, Flex, Text } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import classes from "./DndList.module.css";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axios/axios";
const data = [
  { code: 6, symbol: "E", name: "English" },
  { code: 7, symbol: "B", name: "Bokmal" },
  { code: 39, symbol: "N", name: "Nynorsk" },
];

export default function AddLanguage() {
  const [language, setLanguage] = useState<any>([]);
  const [state, handlers] = useListState(language);

  useEffect(() => {
    console.log("S" + state);
  }, []);

  const fetchLanguage = async () => {
    try {
      const response = await axiosInstance.get(`/admin/language/ui`);
      setLanguage(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLanguage();
  }, []);

  const items = language.map((item: any, index: any) => (
    <Draggable key={item.id} index={index} draggableId={item.id}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
          })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div
            style={{
              width: "100%",
            }}
          >
            <Flex w={"100%"} justify={"space-between"}>
              <img
                src={item?.icon}
                style={{
                  height: "60px",
                }}
              />
              <div className="bg-[#117ee4]">Default</div>
            </Flex>

            <Text mt={"lg"}>Language : {item?.name}</Text>
            <Text c="dimmed" size="sm">
              Code : {item?.code}
            </Text>
            <Button mt={"lg"} type="submit">
              Edit Flag
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
      }
    >
      <Droppable droppableId="dnd-list" direction="horizontal">
        {(provided) => (
          <div
            style={{ display: "flex", gap: "10px" }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
