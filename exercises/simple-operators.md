# Simple Operators

In this session we are going to get ourselves set up with a course folder and start to look at the Ramda API.

To follow along all you need installed on your computer is nodejs. There will be some information about doing this in the course notes.

Open your terminal and navigate to a location where you'd like to create your course folder.

* Create the course folder and cd into it.

We are going to use a couple of node packages `ramda` (of cause) and `jest`. Lets add these packages to our course folder using `npm init`.

## Jest script

Jest is a testing framework developed at 'the facebook' company. We are going to explore the Ramda API by writing tests and making assertions. Jest comes with a watch facility so we can have Jest watch our files and re-run the tests when we save our changes. Lets make this easy for ourselves by making that our test command `jest --watchAll`.

* Create our first file

## Importing ramda

I'm going to write my first failing test. To get the test to pass I need to import Ramda. There are a few ways to do this. We can assign the whole package to a variable `R` and reference the functions we want to use with `R.add()` for example. That will make the test pass.

I don't really find that very pleasing. I have the entire library of functions in my file, I just want to use two in this session.

What I want to do is use the `import` syntax. Now I can remove the `R`. But that doesn't work yet in node 8. I would need to transpile my javascript with Babel, and I don't like doing that either.

Since we have destructuring in node 8 lets just pull in the functions we need using require. Now I feel like I'm getting what I wanted.

## Ramda API

As you can see there are lots of functions and utilities in the Ramda library. Lets use two of them really quickly. `add subtract multiply divide` you know what these functions do already. Lets start exploring Ramda with the low hanging fruit.

That is all for this session. We have started to use our first Ramda functions.
