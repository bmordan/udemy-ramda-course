# Functional Programming

This course is about the Ramda library, which in turn has been created to support developers programme in a functional style.

## What is a functional style?

The code we write is an abstraction. Our instructions are interpreted by our computers to do tasks. There are different ways to do that. There is the imperative style; for example a build script that is a series of steps, do this do that. Object orientated programming models concepts from our world into the computers world. For example a programme controlling bike hire might have a programming object called `Bike` that had properties like, `docked: true`, `broken: false`, `location`.

Functional programming says that tasks should be defined as simple functions. A simple function has one input, one output and no side effects (changing or manipulating objects out of scope).

We'll explore these ideas later for now let us give ourselves three rules which we have to follow.

* Functions can only receive one argument
* Functions can only return one value
* Functions cannot have side effects

## Addition function

The addition function in a functional style is a good place to begin. Lets create a basic function that takes two numbers and adds them. The challenge we face immediately is we need to pass 2 arguments, but functional programming says we can only use one. If we pass just one our function will not work correctly.

How can we solve this? Well, we could return a function that adds the first argument to something. This is the functional style. One input, one output. The input is a number, the output is a function. A function that will add whatever you passed to any consequential argument.

Lets do that.

It looks ugly. Imagine adding three numbers together, very nested. We can use Ramda to help us here.

Ramda's add function behaves like this returning a function if only one argument is passed. This is called currying and we'll look at that in the next session.
