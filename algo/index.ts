import { position } from "@/app/main";

export function* BFS(
  grid: position[][],
  startCoord: position,
  endCoord: position,
  gridSize: number
) {
  const blockers = new Set<string>();
  grid.forEach((val) => {
    val.forEach((coord) => {
      if (coord.isBlocker) {
        blockers.add(convertPositionToString(coord));
      }
    });
  });
  const visited = new Set<string>();
  let visitedPoints: position[] = [startCoord];
  let queue: position[] = [startCoord];
  while (queue.length && !visited.has(convertPositionToString(endCoord))) {
    const { pointsInStr, points } = visitNearbyPoints(
      queue?.[0],
      gridSize,
      blockers,
      visited
    );
    queue.shift();
    pointsInStr.forEach((val) => visited.add(val));
    queue = queue.concat(points);
    visitedPoints = visitedPoints.concat(points);
    yield visited;
  }
}

export function* DFS(
  grid: position[][],
  startCoord: position,
  endCoord: position,
  gridSize: number
) {
  const blockers = new Set<string>();
  grid.forEach((val) => {
    val.forEach((coord) => {
      if (coord.isBlocker) {
        blockers.add(convertPositionToString(coord));
      }
    });
  });
  const visited = new Set<string>();
  let visitedPoints: position[] = [startCoord];
  let stack: position[] = [startCoord];
  while (stack.length && !visited.has(convertPositionToString(endCoord))) {
    const node = getNearbyNotVisitedNode(
      stack?.[stack.length - 1],
      gridSize,
      blockers,
      visited
    );
    if (node) {
      visitedPoints.push(node);
      visited.add(convertPositionToString(node));
      stack.push(node);
      yield visited;
    } else {
      stack.pop();
    }
  }
}

const getNearbyNotVisitedNode = (
  node: position,
  gridSize: number,
  blockers: Set<string>,
  visited: Set<string>
) => {
  const { points, pointsInStr } = visitNearbyPoints(
    node,
    gridSize,
    blockers,
    visited
  );
  if (points.length > 0) {
    return points?.[0];
  }
  return null;
};

const visitNearbyPoints = (
  point: position,
  gridSize: number,
  blockers: Set<string>,
  visited: Set<string>
) => {
  const pointsCoordsInString: string[] = [];
  const pointsCoords: position[] = [];
  // x axis
  if (point.x - 1 >= 0) {
    pointsCoords.push({ x: point.x - 1, y: point.y, isBlocker: false });
  }
  if (point.x + 1 < gridSize) {
    pointsCoords.push({ x: point.x + 1, y: point.y, isBlocker: false });
  }
  // y axis
  if (point.y - 1 >= 0) {
    pointsCoords.push({ x: point.x, y: point.y - 1, isBlocker: false });
  }
  if (point.y + 1 < gridSize) {
    pointsCoords.push({ x: point.x, y: point.y + 1, isBlocker: false });
  }
  // diagonals
  if (point.x - 1 >= 0 && point.y - 1 > 0) {
    pointsCoords.push({
      x: point.x - 1,
      y: point.y - 1,
      isBlocker: false,
    });
  }
  if (point.x + 1 < gridSize && point.y + 1 < gridSize) {
    pointsCoords.push({
      x: point.x + 1,
      y: point.y + 1,
      isBlocker: false,
    });
  }
  if (point.x - 1 >= 0 && point.y + 1 < gridSize) {
    pointsCoords.push({
      x: point.x - 1,
      y: point.y + 1,
      isBlocker: false,
    });
  }
  if (point.x + 1 < gridSize && point.y - 1 >= 0) {
    pointsCoords.push({
      x: point.x + 1,
      y: point.y - 1,
      isBlocker: false,
    });
  }
  const filteredPoints: position[] = [];
  pointsCoords.forEach((coord) => {
    const convertedStr = convertPositionToString(coord);
    if (!blockers.has(convertedStr) && !visited.has(convertedStr)) {
      pointsCoordsInString.push(convertedStr);
      filteredPoints.push(coord);
    }
  });
  return {
    pointsInStr: pointsCoordsInString,
    points: filteredPoints,
  };
};

export const convertPositionToString = (coord: position) => {
  return `${coord.x}-${coord.y}`;
};
