# Set

![Screenshot](/screenshot.jpg?raw=true "Screenshot of the Game")

You can find the **demo** deployed here: [https://set.mjanke.com](https://set.mjanke.com).

## Game rules

[https://en.wikipedia.org/wiki/Set\_(card_game)](wikipedia)

The Game has 81 unique cards. Each card consists of 1 to 3 symbols of different shape, color and shading.
The play deck consists of 12 cards. All players have now to find a **set** simultaneously.
A **set** consists of three cards satisfying all of these conditions:

- They all have the same number or have three different numbers.
- They all have the same shape or have three different shapes.
- They all have the same shading or have three different shadings.
- They all have the same color or have three different colors.

### Game play

- Player x clicks a card and has now 5 seconds to select 2 more cards
  - if these 3 selected cards are a set, he scores a point
  - if not, he is blocked for 5 seconds
- if there aren't any sets in the deck, 3 additional cards are drawn
- game ends as soon as there aren't any sets in the deck
- the player with the most points wins
- if the player are stucked, they can use the tip function to preselect one card out of a possible set

Funfact: Finding a set is **NP-complete.**

## Features

- **set** game logic
- multiplayer via browser (websockets)
- responsive
- touch enabled
- game matching via 4 character code
- sounds for card click, set, no set, game end, draw cards
- you can ask for a tip
- easy sets (grandma) indicator
- card hover indicator

### Future work

- show achievements like
  - fastest fingers
  - slowest fingers
  - most wrong sets
- adjustable game settings
  - wrong set punishment
  - block duration
  - disable tips
- refactoring

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### technologies

- typescript
- react
- mobX (global state)
- websockets
- react-spring (animations)
- node.js backend

The node.js backend and react frontend share the types

### `yarn client` `yarn server`

Runs the app and the server in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build` `yarn build-server`

Builds the app for production to the `build` folder and the server to `server/dist/`.
