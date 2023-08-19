import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { startTransition, useEffect, useRef, useState } from "react";
import { Grid } from "./grid";
import { BFS, DFS, convertPositionToString } from "../../algo";

export type position = {
  x: number;
  y: number;
  isBlocker: boolean;
};

const TRAVERSAL_DELAY = 30;

export default function Main() {
  const [startCoord, setStartCoord] = useState<position | null>(null);
  const [endCoord, setEndCoord] = useState<position | null>(null);
  const [currentGrid, setCurrentGrid] = useState<position[][] | null>(null);
  const [currentGridSize, setCurrentGridSize] = useState("");
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [blockerProbability, setBlockerProbability] = useState("");
  const [algo, setAlgo] = useState<"BFS" | "DFS">("BFS");

  const handleAlgoChange = (
    e: React.MouseEvent<HTMLElement>,
    val: "BFS" | "DFS"
  ) => {
    setAlgo(val);
  };

  useEffect(() => {
    setStartCoord(null);
    setEndCoord(null);
    setVisitedNodes(new Set());
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

  const handlePathFinding = async () => {
    if (currentGrid && startCoord && endCoord && currentGridSize) {
      if (algo === "BFS") {
        const genFunc = BFS(
          currentGrid,
          startCoord,
          endCoord,
          parseInt(currentGridSize)
        );
        for await (const value of genFunc) {
          setIsInputDisabled(true);
          await new Promise((res) => {
            setTimeout(() => {
              res("resolved");
              setVisitedNodes(new Set(value));
            }, TRAVERSAL_DELAY);
          });
          setIsInputDisabled(false);
        }
      } else {
        const genFunc = DFS(
          currentGrid,
          startCoord,
          endCoord,
          parseInt(currentGridSize)
        );
        for await (const value of genFunc) {
          setIsInputDisabled(true);
          await new Promise((res) => {
            setTimeout(() => {
              res("resolved");
              setVisitedNodes(new Set(value));
            }, TRAVERSAL_DELAY);
          });
          setIsInputDisabled(false);
        }
      }
    }
  };

  return (
    <div className={"flex flex-col gap-4 items-center"}>
      <div className={"flex gap-4"}>
        <TextField
          variant={"outlined"}
          disabled={isInputDisabled}
          label="Enter grid size"
          error={Boolean(currentGridSize && isNaN(parseInt(currentGridSize)))}
          onChange={(e) => setCurrentGridSize(e.target.value)}
        />
        <TextField
          variant={"outlined"}
          disabled={isInputDisabled}
          label="Enter blocker probability"
          error={Boolean(
            blockerProbability && isNaN(parseFloat(blockerProbability))
          )}
          onChange={(e) => setBlockerProbability(e.target.value)}
        />
        <ToggleButtonGroup
          color="primary"
          value={algo}
          exclusive
          onChange={handleAlgoChange}
          aria-label="Platform"
          disabled={isInputDisabled}
        >
          <ToggleButton value={"BFS"}>BFS</ToggleButton>
          <ToggleButton value={"DFS"}>DFS</ToggleButton>
        </ToggleButtonGroup>
        <Button
          disabled={
            Boolean(isNaN(parseInt(currentGridSize))) ||
            Boolean(isNaN(parseFloat(blockerProbability))) ||
            isInputDisabled
          }
          variant="outlined"
          onClick={() => {
            setCurrentGrid(
              generateGrid(
                parseInt(currentGridSize),
                isNaN(parseFloat(blockerProbability))
                  ? 0.5
                  : parseFloat(blockerProbability)
              )
            );
          }}
        >
          Generate grid
        </Button>
        <Button
          variant="outlined"
          disabled={!(startCoord && endCoord) || isInputDisabled}
          onClick={handlePathFinding}
        >
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
            visitedNodes={visitedNodes}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

const generateGrid = (gridSize: number, blockerProbability: number) => {
  const grid: position[][] = [];
  for (let i = 0; i < gridSize; i++) {
    const currentArr: position[] = [];
    for (let j = 0; j < gridSize; j++) {
      const obj: position = {
        isBlocker: Math.random() > blockerProbability,
        x: i,
        y: j,
      };
      currentArr.push(obj);
    }
    grid.push(currentArr);
  }
  return grid;
};
