"use client";
import { ThemeProvider, createTheme } from "@mui/material";
import Main from "./main";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
        <Main />
      </ThemeProvider>
    </main>
  );
}

const generateGrid = (gridSize: number) => {};
