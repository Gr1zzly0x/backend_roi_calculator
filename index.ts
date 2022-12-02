import express, { Request, Response } from "express";
import cors from "cors";

// Helper function that simulates a coin flip, with a 50% chance of winning or losing each bet
function betWinLose(): boolean {
  return Math.random() > 0.5;
}

// Helper function that calculates the final balance of the player after a series of bets
function finalBalance(initialBalance: number, houseEdge: number, wagerRequirementMultiplier: number): number {
  let balance = initialBalance;
  const bet = initialBalance / 10;
  const totalWagerNeeded = initialBalance * wagerRequirementMultiplier;

  let totalBet = 0;
  while (totalBet < totalWagerNeeded && balance > 0) {
    if (balance >= bet) {
      if (betWinLose()) {
        balance += bet * (1 - (2 * (houseEdge / 100)));
        totalBet += bet;
      } else {
        balance -= bet;
        totalBet += bet;
      }
    } else {
      if (betWinLose()) {
        balance += balance * (1 - (2 * (houseEdge / 100)));
        totalBet += balance;
      } else {
        balance -= balance;
        totalBet += balance;
      }
    }
  }

  return balance;
}

// Function that simulates a series of bets and calculates the expected return on investment (ROI) for the player
function simulateBets(initialBalance: number, houseEdge: number, wagerRequirementMultiplier: number, simulations: number): number {
  let sum = 0;
  for (let i = 0; i < simulations; i++) {
    sum += finalBalance(initialBalance, houseEdge, wagerRequirementMultiplier);
  }

  return sum / simulations;
}

const app = express();
const port = 3000;

// Enable CORS support
app.use(cors());

// GET method endpoint that calculates the expected ROI for the player
app.get("/simulateBets", (req: Request, res: Response) => {
  const { initialBalance, houseEdge, wagerRequirementMultiplier, simulations } = req.query;

  // Calculate the expected ROI for the player
  const roi = simulateBets(
    Number(initialBalance),
    Number(houseEdge),
    Number(wagerRequirementMultiplier),
    Number(simulations)
  );

  res.json({ roi });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});