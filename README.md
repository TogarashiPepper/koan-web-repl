# Koan Web Repl
This is a fun little side project I've been working on in addition to my language. The web REPL runs by having the interpreter be compiled to wasm and having everything run entirely client-side.
I'll admit this probably isn't very efficient, as theres a cost to pass types between js <-> wasm boundary and of course the wasm virtual machine itself also has some overhead. If eventually it proves
to be an issue I'll spin up a cf worker.

Syntax highlighting coming soon™

# Screenshots
## Binary Expressions
![image](https://github.com/TogarashiPepper/koan-web-repl/assets/83902606/346aac29-726a-4240-a124-84a07002a67d)

## Calculating n-th fibonacci
### Calculating `fib(10)`
This is a fun way to calcluate fibonacci numbers although due to floating point inaccuracy we end up with some noise
![image](https://github.com/TogarashiPepper/koan-web-repl/assets/83902606/ca3bc3fa-c2b2-4e7c-886b-73fd5a3f09fb)

### Calculating `fib(25)`
Even though there's some noise, it's still quite close to the expected answer!
![image](https://github.com/TogarashiPepper/koan-web-repl/assets/83902606/f81e7749-dc5e-4ed8-b541-6ff5772d4c8b)
