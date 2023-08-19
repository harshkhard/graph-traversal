import React from "react";
import { position } from "./main";
import { Button, ButtonBase, Typography, styled } from "@mui/material";

type GridProps = {
  grid: position[][];
  selectionDisabled: boolean;
  onCellPress: (x: number, y: number) => void;
  startCoord: position | null;
  endCoord: position | null;
};

export const Grid = (props: GridProps) => {
  return (
    <div className={"flex flex-col"}>
      {props.grid?.map((row, index) => {
        return (
          <div key={index} className={"flex"}>
            {row.map((col, index) => {
              return (
                <Cell
                  key={index}
                  isBlocker={col.isBlocker}
                  disabled={props.selectionDisabled}
                  isStartingPoint={
                    props.startCoord
                      ? props.startCoord?.x === col.x &&
                        props.startCoord?.y === col.y
                      : false
                  }
                  isEndingPoint={
                    props.endCoord
                      ? props.endCoord?.x === col.x &&
                        props.endCoord?.y === col.y
                      : false
                  }
                  onPress={() => {
                    props.onCellPress(col.x, col.y);
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

type CellProps = {
  isBlocker: boolean;
  isStartingPoint?: boolean;
  isEndingPoint?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

const Cell = (props: CellProps) => {
  const getBackgroundColor = () => {
    if (props.isBlocker) {
      return "bg-red-900";
    }
    if (props.isStartingPoint || props.isEndingPoint) {
      return "bg-sky-950";
    }
    return "";
  };

  const getText = () => {
    if (props.isEndingPoint) {
      return "X";
    }
    if (props.isStartingPoint) {
      return "O";
    }
    return "";
  };

  return (
    <div
      className={`flex items-center justify-content-center h-20 w-20 border-2 ${getBackgroundColor()}`}
    >
      <StyledButton
        disabled={props.disabled ?? false}
        onClick={
          !props.isBlocker
            ? () => {
                props.onPress();
              }
            : () => {}
        }
      >
        <Typography color={"white"}>{getText()}</Typography>
      </StyledButton>
    </div>
  );
};

const StyledButton = styled(Button)({ height: "100%", width: "100%" });
