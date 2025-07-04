import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTournamentSchema, insertTeamSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, you'd generate a JWT token here
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token: `fake-jwt-token-${user.id}` });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { confirmPassword, ...userData } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token: `fake-jwt-token-${user.id}` });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    const users = await storage.getAllUsers();
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  });

  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.put("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const updatedUser = await storage.updateUser(id, req.body);
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(404).json({ message: "User not found" });
    }
  });

  // Game routes
  app.get("/api/games", async (req, res) => {
    const games = await storage.getAllGames();
    res.json(games);
  });

  app.get("/api/games/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const game = await storage.getGame(id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.json(game);
  });

  // Tournament routes
  app.get("/api/tournaments", async (req, res) => {
    const tournaments = await storage.getAllTournaments();
    res.json(tournaments);
  });

  app.get("/api/tournaments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const tournament = await storage.getTournament(id);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    res.json(tournament);
  });

  app.post("/api/tournaments", async (req, res) => {
    try {
      const tournamentData = insertTournamentSchema.parse(req.body);
      const tournament = await storage.createTournament(tournamentData);
      res.json(tournament);
    } catch (error) {
      res.status(400).json({ message: "Invalid tournament data" });
    }
  });

  app.put("/api/tournaments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const updatedTournament = await storage.updateTournament(id, req.body);
      res.json(updatedTournament);
    } catch (error) {
      res.status(404).json({ message: "Tournament not found" });
    }
  });

  app.delete("/api/tournaments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteTournament(id);
    res.json({ message: "Tournament deleted" });
  });

  app.get("/api/tournaments/:id/participants", async (req, res) => {
    const id = parseInt(req.params.id);
    const participants = await storage.getTournamentParticipants(id);
    res.json(participants);
  });

  app.post("/api/tournaments/:id/join", async (req, res) => {
    const tournamentId = parseInt(req.params.id);
    const { userId, teamId } = req.body;

    try {
      const tournament = await storage.getTournament(tournamentId);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }

      if (tournament.currentParticipants >= tournament.maxParticipants) {
        return res.status(400).json({ message: "Tournament is full" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const entryFee = parseFloat(tournament.entryFee);
      const userBalance = parseFloat(user.walletBalance);

      if (userBalance < entryFee) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Deduct entry fee
      await storage.updateUserWallet(userId, `-${entryFee}`);

      // Add participant
      await storage.addTournamentParticipant({
        tournamentId,
        userId,
        teamId,
      });

      // Create transaction
      await storage.createTransaction({
        userId,
        type: "tournament_entry",
        amount: `-${entryFee}`,
        description: `Tournament Entry - ${tournament.title}`,
        status: "completed",
      });

      res.json({ message: "Successfully joined tournament" });
    } catch (error) {
      res.status(500).json({ message: "Failed to join tournament" });
    }
  });

  // Team routes
  app.get("/api/teams", async (req, res) => {
    const teams = await storage.getAllTeams();
    res.json(teams);
  });

  app.get("/api/teams/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const team = await storage.getTeam(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(team);
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const teamData = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(teamData);
      
      // Add captain as team member
      await storage.addTeamMember({
        teamId: team.id,
        userId: team.captainId!,
        role: "captain",
      });

      res.json(team);
    } catch (error) {
      res.status(400).json({ message: "Invalid team data" });
    }
  });

  app.put("/api/teams/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const updatedTeam = await storage.updateTeam(id, req.body);
      res.json(updatedTeam);
    } catch (error) {
      res.status(404).json({ message: "Team not found" });
    }
  });

  app.delete("/api/teams/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteTeam(id);
    res.json({ message: "Team deleted" });
  });

  app.get("/api/teams/:id/members", async (req, res) => {
    const id = parseInt(req.params.id);
    const members = await storage.getTeamMembers(id);
    res.json(members);
  });

  app.post("/api/teams/:id/join", async (req, res) => {
    const teamId = parseInt(req.params.id);
    const { userId } = req.body;

    try {
      const team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      if (team.currentMembers >= team.maxMembers) {
        return res.status(400).json({ message: "Team is full" });
      }

      await storage.addTeamMember({
        teamId,
        userId,
        role: "member",
      });

      res.json({ message: "Successfully joined team" });
    } catch (error) {
      res.status(500).json({ message: "Failed to join team" });
    }
  });

  app.post("/api/teams/join-by-code", async (req, res) => {
    const { joinCode, userId } = req.body;

    try {
      const team = await storage.getTeamByJoinCode(joinCode);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      if (team.currentMembers >= team.maxMembers) {
        return res.status(400).json({ message: "Team is full" });
      }

      await storage.addTeamMember({
        teamId: team.id,
        userId,
        role: "member",
      });

      res.json({ message: "Successfully joined team", team });
    } catch (error) {
      res.status(500).json({ message: "Failed to join team" });
    }
  });

  app.get("/api/users/:id/teams", async (req, res) => {
    const id = parseInt(req.params.id);
    const teams = await storage.getUserTeams(id);
    res.json(teams);
  });

  // Transaction routes
  app.get("/api/users/:id/transactions", async (req, res) => {
    const id = parseInt(req.params.id);
    const transactions = await storage.getUserTransactions(id);
    res.json(transactions);
  });

  app.get("/api/transactions", async (req, res) => {
    const transactions = await storage.getAllTransactions();
    res.json(transactions);
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      
      // Update user wallet if transaction is completed
      if (transaction.status === "completed") {
        await storage.updateUserWallet(transaction.userId!, transaction.amount);
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });

  // Wallet routes
  app.post("/api/wallet/add-money", async (req, res) => {
    const { userId, amount } = req.body;

    try {
      const user = await storage.updateUserWallet(userId, amount);
      
      await storage.createTransaction({
        userId,
        type: "deposit",
        amount,
        description: "Wallet deposit",
        status: "completed",
      });

      res.json({ message: "Money added successfully", balance: user.walletBalance });
    } catch (error) {
      res.status(500).json({ message: "Failed to add money" });
    }
  });

  app.post("/api/wallet/withdraw", async (req, res) => {
    const { userId, amount } = req.body;

    try {
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const withdrawAmount = parseFloat(amount);
      const userBalance = parseFloat(user.walletBalance);

      if (userBalance < withdrawAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const updatedUser = await storage.updateUserWallet(userId, `-${amount}`);
      
      await storage.createTransaction({
        userId,
        type: "withdrawal",
        amount: `-${amount}`,
        description: "Wallet withdrawal",
        status: "pending",
      });

      res.json({ message: "Withdrawal request submitted", balance: updatedUser.walletBalance });
    } catch (error) {
      res.status(500).json({ message: "Failed to process withdrawal" });
    }
  });

  // Notification routes
  app.get("/api/users/:id/notifications", async (req, res) => {
    const id = parseInt(req.params.id);
    const notifications = await storage.getUserNotifications(id);
    res.json(notifications);
  });

  app.put("/api/notifications/:id/read", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.markNotificationAsRead(id);
    res.json({ message: "Notification marked as read" });
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    const leaderboard = await storage.getLeaderboard();
    const leaderboardWithoutPasswords = leaderboard.map(({ password, ...user }) => user);
    res.json(leaderboardWithoutPasswords);
  });

  // Tournament results routes
  app.get("/api/tournaments/:id/results", async (req, res) => {
    const id = parseInt(req.params.id);
    const results = await storage.getTournamentResults(id);
    res.json(results);
  });

  app.post("/api/tournaments/:id/results", async (req, res) => {
    const tournamentId = parseInt(req.params.id);
    const results = req.body; // Array of results

    try {
      const createdResults = [];
      for (const result of results) {
        const tournamentResult = await storage.createTournamentResult({
          ...result,
          tournamentId,
        });
        createdResults.push(tournamentResult);

        // Award prize money if any
        if (result.prizeWon && parseFloat(result.prizeWon) > 0) {
          await storage.updateUserWallet(result.userId, result.prizeWon);
          await storage.createTransaction({
            userId: result.userId,
            type: "tournament_win",
            amount: result.prizeWon,
            description: `Tournament Win - Position ${result.position}`,
            status: "completed",
          });
        }
      }

      res.json(createdResults);
    } catch (error) {
      res.status(500).json({ message: "Failed to save tournament results" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
