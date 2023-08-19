import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  TextField,
} from "@mui/material";
import { startTransition, useEffect, useRef, useState } from "react";
import { Grid } from "./grid";

export type position = {
  x: number;
  y: number;
  isBlocker: boolean;
};

export default function Main() {
  const [startCoord, setStartCoord] = useState<position | null>(null);
  const [endCoord, setEndCoord] = useState<position | null>(null);
  const [currentGrid, setCurrentGrid] = useState<position[][] | null>(null);
  const [currentGridSize, setCurrentGridSize] = useState("");

  useEffect(() => {
    setStartCoord(null);
    setEndCoord(null);
  }, [currentGrid]);

  const handleOnPress = (x: number, y: number) => {
    if (startCoord && endCoord) {
      return;
    }
    if (!startCoord) {
      setStartCoord({ isBlocker: false, x: x, y: y });
    } else {
      setEndCoord({ isBlocker: false, x: x, y: y });
    }
  };

  return (
    <div className={"flex flex-col gap-4 items-center"}>
      <div className={"flex gap-4"}>
        <TextField
          variant={"outlined"}
          label="Enter grid size"
          error={Boolean(currentGridSize && isNaN(parseInt(currentGridSize)))}
          onChange={(e) => setCurrentGridSize(e.target.value)}
        />
        <Button
          disabled={Boolean(isNaN(parseInt(currentGridSize)))}
          variant="outlined"
          onClick={() => {
            setCurrentGrid(generateGrid(parseInt(currentGridSize)));
          }}
        >
          Generate grid
        </Button>
        <Button variant="outlined" disabled={!(startCoord && endCoord)}>
          Start Path finding
        </Button>
      </div>
      <div>
        {currentGrid ? (
          <Grid
            grid={currentGrid}
            onCellPress={handleOnPress}
            selectionDisabled={!!(startCoord && endCoord)}
            startCoord={startCoord}
            endCoord={endCoord}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

const generateGrid = (gridSize: number) => {
  const grid: position[][] = [];
  for (let i = 0; i < gridSize; i++) {
    const currentArr: position[] = [];
    for (let j = 0; j < gridSize; j++) {
      const obj: position = { isBlocker: Math.random() > 0.85, x: i, y: j };
      currentArr.push(obj);
    }
    grid.push(currentArr);
  }
  return grid;
};
