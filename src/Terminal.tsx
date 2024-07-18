import { type ComponentProps, onMount } from "solid-js";
import { Terminal as XTerm } from "@xterm/xterm";
import * as wasm from "../koan-wasm-wrapper/pkg/koan_wasm_wrapper";
import "@xterm/xterm/css/xterm.css";
import { createEmphasize } from "emphasize";
import { Chalk } from "chalk";

const chalk = new Chalk({ level: 3 });

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

const reset = "\x1b[0m";

const emphasize = createEmphasize({
	koan: (_x) => ({
		case_insensitive: false,
		// keywords: "let",
		contains: [
			{
				scope: "string",
				begin: '"',
				end: '"',
			},
			{
				scope: "number",
				match: /\d+(\.\d+)?/,
			},
			{
				scope: "keyword",
				match: /let/,
			},
			{
				scope: "variable",
				match: /([a-zA-Z_][a-zA-Z0-9_]*|π)/,
			},
		],
	}),
});

export interface TerminalProps extends ComponentProps<"div"> {}

function highlight(line: string): string {
	return emphasize.highlight("koan", line, {
		keyword: chalk.hex("#E06C75"),
		number: chalk.hex("#E5C07B"),
		string: chalk.hex("#98C379"),
	}).value;
}

class Buffer {
	line: string;
	cursor: number;
	term: XTerm;

	constructor(term: XTerm) {
		this.line = "";
		this.cursor = 0;
		this.term = term;
	}

	clearLine() {
		this.term.write("\x1b[2K\r");
		this.prompt();
	}

	delChar() {
		if (this.cursor - 1 >= 0) {
			this.line =
				this.line.substring(0, this.cursor - 1) +
				this.line.substring(this.cursor);
			this.cursor--;

			this.rerender();
		}
	}

	reset() {
		this.line = "";
		this.cursor = 0;
	}

	insert(data: string) {
		this.line =
			this.line.slice(0, this.cursor) +
			data +
			this.line.slice(this.cursor);
		this.cursor += data.length;

		this.rerender();
	}

	cursorLeft() {
		if (this.cursor > 0) {
			this.cursor--;
			this.rerender();
		}
	}

	cursorRight() {
		if (this.cursor < this.line.length) {
			this.cursor++;
			this.rerender();
		}
	}

	prompt() {
		this.term.write(`\x1b[34m λ ${reset}`);
	}

	rerender() {
		this.clearLine();
		this.term.write(highlight(this.line));
		this.term.write(`\x1b[${this.cursor + 4}G`);
	}
}

export function Terminal() {
	let ref!: HTMLDivElement;

	onMount(() => {
		const term = new XTerm({
			fontFamily: '"Cascadia Code", Menlo, monospace',
			theme: baseTheme,
			cursorBlink: true,
		});

		const buffer = new Buffer(term);
		const state = new wasm.WState();

		term.open(ref);

		term.onData((e) => {
			switch (e) {
				case "\r":
					try {
						buffer.term.writeln("");

						if (buffer.line) {
							const out = wasm.run_line(buffer.line, state);
							buffer.reset();

							if (out.result() !== "nothing") {
								buffer.term.writeln(` ${out.result()}`);
							}

							if (out.stdout()) {
								buffer.term.writeln(
									` ${out.stdout().slice(0, -1)}`,
								);
							}
						}

						buffer.prompt();
					} catch (err) {
						buffer.reset();
						term.writeln(`Error: ${err}`);
						buffer.prompt();
					}
					break;

				case "\x1b[D":
					buffer.cursorLeft();
					break;

				case "\x1b[C":
					buffer.cursorRight();
					break;

				// Backspace
				case "\u007F":
					if (buffer.line.length >= 1 && buffer.cursor > 0) {
						buffer.delChar();
					}

					break;
				default:
					if (
						(e >= String.fromCharCode(0x20) &&
							e <= String.fromCharCode(0x7e)) ||
						e >= "\u00a0"
					) {
						buffer.insert(e);
					}
			}
		});

		buffer.term.writeln(`\n Welcome to the ${chalk.hex("#C678DD")("Koan")} repl!`);
		buffer.prompt(); 
	});

	return (
		<div
			ref={ref}
			style="border: 1px solid #424242; border-radius: 5px; padding: 10px"
		/>
	);
}
