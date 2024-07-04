import { ComponentProps, onMount } from 'solid-js';
import { Terminal as XTerm } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

// Custom theme to match style of xterm.js logo
var baseTheme = {
  foreground: '#F8F8F8',
  background: '#2D2E2C',
  selection: '#5DA5D533',
  black: '#1E1E1D',
  brightBlack: '#262625',
  red: '#CE5C5C',
  brightRed: '#FF7272',
  green: '#5BCC5B',
  brightGreen: '#72FF72',
  yellow: '#CCCC5B',
  brightYellow: '#FFFF72',
  blue: '#5D5DD3',
  brightBlue: '#7279FF',
  magenta: '#BC5ED1',
  brightMagenta: '#E572FF',
  cyan: '#5DA5D5',
  brightCyan: '#72F0FF',
  white: '#F8F8F8',
  brightWhite: '#FFFFFF',
};

export interface TerminalProps extends ComponentProps<'div'> {}

export function Terminal() {
  let ref!: HTMLDivElement;
  let buffer = "";

  onMount(() => {
    const term = new XTerm({
      fontFamily: '"Cascadia Code", Menlo, monospace',
      theme: baseTheme,
      cursorBlink: true,
    });

    term.open(ref);

    term.onData((e) => {
      switch (e) {
        case '\u0003': // Ctrl+C
          term.write('^C');
          break;
        case '\r':
          // TODO: wasm support
          break;
        case '\u007F':
          buffer = buffer.slice(0, -1);
          break;
        default:
          // Print all other characters for demo
          if (
            (e >= String.fromCharCode(0x20) &&
              e <= String.fromCharCode(0x7e)) ||
            e >= '\u00a0'
          ) {
            // command += e;
            term.write(e);
          }
      }
    });

    // Initial content.
    term.writeln(
      [
        '',
        '    Xterm.js is the frontend component that powers many terminals including',
        ' \x1b[3mVS Code\x1b[0m, \x1b[3mHyper\x1b[0m and \x1b[3mTheia\x1b[0m!',
        '',
        ' ┌ \x1b[1mFeatures\x1b[0m ──────────────────────────────────────────────────────────────────┐',
        ' │                                                                            │',
        ' │  \x1b[31;1mApps just work                         \x1b[32mPerformance\x1b[0m                        │',
        ' │   Xterm.js works with most terminal      Xterm.js is fast and includes an  │',
        ' │   apps like bash, vim and tmux           optional \x1b[3mWebGL renderer\x1b[0m           │',
        ' │                                                                            │',
        ' │  \x1b[33;1mAccessible                             \x1b[34mSelf-contained\x1b[0m                     │',
        ' │   A screen reader mode is available      Zero external dependencies        │',
        ' │                                                                            │',
        ' │  \x1b[35;1mUnicode support                        \x1b[36mAnd much more...\x1b[0m                   │',
        ' │   Supports CJK 語 and emoji \u2764\ufe0f            \x1b[3mLinks\x1b[0m, \x1b[3mthemes\x1b[0m, \x1b[3maddons\x1b[0m,            │',
        ' │                                          \x1b[3mtyped API\x1b[0m, \x1b[3mdecorations\x1b[0m            │',
        ' │                                                                            │',
        ' └────────────────────────────────────────────────────────────────────────────┘',
        '',
      ].join('\r\n')
    );
  });

  return <div ref={ref} style="border: 1px solid #424242; border-radius: 5px; padding: 10px" />;
}

