# Koan Web Repl
This is a fun little side project I've been working on in addition to my language. The web REPL runs by having the interpreter be compiled to wasm and having everything run entirely client-side.
I'll admit this probably isn't very efficient, as theres a cost to pass types between js <-> wasm boundary and of course the wasm virtual machine itself also has some overhead. If eventually it proves
to be an issue I'll spin up a cf worker.

Syntax highlighting coming soon™

# Screenshots
## Binary Expressions
<img width="759" alt="image" src="https://github.com/user-attachments/assets/5095af83-eb33-4aca-b053-7002298b58bb">


## Calculating n-th fibonacci
### Calculating `fib(10)`
This is a fun way to calcluate fibonacci numbers although due to floating point inaccuracy we end up with noise
<img width="756" alt="image" src="https://github.com/user-attachments/assets/eebed13e-0e4f-4bb7-94b3-aa874c7c22b7">


### Calculating `fib(25)`
Even though there's some noise, it's still quite close to the expected answer!
<img width="756" alt="image" src="https://github.com/user-attachments/assets/de95ed4c-992a-44a8-864c-86a9b17827b3">

