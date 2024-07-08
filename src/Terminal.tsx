import { ComponentProps, onMount } from "solid-js";
import { Terminal as XTerm } from "@xterm/xterm";
import * as wasm from "../koan-wasm-wrapper/pkg/koan_wasm_wrapper";
import "@xterm/xterm/css/xterm.css";
import { createEmphasize } from "emphasize";

// Custom theme to match style of xterm.js logo
const baseTheme = {
  foreground: "#F8F8F8",
  background: "#2D2E2C",
  selection: "#5DA5D533",
  black: "#1E1E1D",
  brightBlack: "#262625",
  red: "#CE5C5C",
  brightRed: "#FF7272",
  green: "#5BCC5B",
  brightGreen: "#72FF72",
  yellow: "#CCCC5B",
  brightYellow: "#FFFF72",
  blue: "#5D5DD3",
  brightBlue: "#7279FF",
  magenta: "#BC5ED1",
  brightMagenta: "#E572FF",
  cyan: "#5DA5D5",
  brightCyan: "#72F0FF",
  white: "#F8F8F8",
  brightWhite: "#FFFFFF",
};

const blue = "\x1b[34m";
const reset = "\x1b[0m";
const emphasize = createEmphasize({
    'koan': (_x) => ({
      case_insensitive: false,
      // keywords: "let",
      contains: [
          {
              scope: 'string',
              begin: '"',
              end: '"',
          },
          {
              scope: 'number',
              match: /\d+(.\d+)?/,
          },
          {
              scope: 'keyword',
              match: /let/,
          },
          {
              scope: 'variable',
              match: /[a-zA-Z_][a-zA-Z0-9_]*/,
          },
      ]
    })
})

export interface TerminalProps extends ComponentProps<"div"> {}

export function Terminal() {
  let ref!: HTMLDivElement;
  let buffer = "";

  onMount(() => {
    const term = new XTerm({
      fontFamily: '"Cascadia Code", Menlo, monospace',
      theme: baseTheme,
      cursorBlink: true,
    });

    let state = new wasm.WState();

    term.open(ref);

    term.onData((e) => {
      switch (e) {
        case "\u0003": // Ctrl+C
          term.write("^C");
          break;
        case "\r":
          try {
            term.writeln("");

            if (buffer) {
              const out = wasm.run_line(buffer, state);
              buffer = "";

              term.writeln(" " + out.result());
              if (out.stdout()) {
                term.writeln(" " + out.stdout().slice(0, -1));
              }
            }

            term.write(" λ ");
          } catch (err) {
            buffer = "";
            term.writeln("Error: " + err);
            term.write(" λ ");
          }
          break;
        case "\u007F":
          if (buffer.length >= 1) {
            buffer = buffer.slice(0, -1);
            term.write("\b \b");
          }
          break;
        default:
          if (
            (e >= String.fromCharCode(0x20) &&
              e <= String.fromCharCode(0x7e)) ||
            e >= "\u00a0"
          ) {
            buffer += e;
            term.write('\x1b[2K\r');
            term.write(" λ " + emphasize.highlight('koan', buffer).value);
          }
      }
    });

    term.writeln(`\n Welcome to the ${blue}Koan${reset} repl!`);
    term.write(" λ ");
  });

  return (
    <div
      ref={ref}
      style="border: 1px solid #424242; border-radius: 5px; padding: 10px"
    />
  );
}
