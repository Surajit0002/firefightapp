import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import Tournaments from "./pages/Tournaments";
import TournamentDetails from "./pages/TournamentDetails";
import Teams from "./pages/Teams";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import MatchRoom from "./pages/MatchRoom";
import Referral from "./pages/Referral";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import TournamentManagement from "./pages/admin/TournamentManagement";
import UserManagement from "./pages/admin/UserManagement";
import TeamManagement from "./pages/admin/TeamManagement";
import WalletManagement from "./pages/admin/WalletManagement";
import Reports from "./pages/admin/Reports";
import CMS from "./pages/admin/CMS";
import NotificationCenter from "./pages/admin/NotificationCenter";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* User routes */}
      <Route path="/">
        <Layout>
          <Home />
        </Layout>
      </Route>
      
      <Route path="/tournaments">
        <Layout>
          <Tournaments />
        </Layout>
      </Route>
      
      <Route path="/tournaments/:id">
        {(params) => (
          <Layout>
            <TournamentDetails id={parseInt(params.id)} />
          </Layout>
        )}
      </Route>
      
      <Route path="/teams">
        <Layout>
          <Teams />
        </Layout>
      </Route>
      
      <Route path="/wallet">
        <Layout>
          <Wallet />
        </Layout>
      </Route>
      
      <Route path="/profile">
        <Layout>
          <Profile />
        </Layout>
      </Route>
      
      <Route path="/leaderboard">
        <Layout>
          <Leaderboard />
        </Layout>
      </Route>
      
      <Route path="/match-room/:id">
        {(params) => (
          <Layout>
            <MatchRoom id={parseInt(params.id)} />
          </Layout>
        )}
      </Route>
      
      <Route path="/referral">
        <Layout>
          <Referral />
        </Layout>
      </Route>
      
      <Route path="/help">
        <Layout>
          <Help />
        </Layout>
      </Route>
      
      {/* Admin routes */}
      <Route path="/admin">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/tournaments">
        <AdminLayout>
          <TournamentManagement />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/users">
        <AdminLayout>
          <UserManagement />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/teams">
        <AdminLayout>
          <TeamManagement />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/wallet">
        <AdminLayout>
          <WalletManagement />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/reports">
        <AdminLayout>
          <Reports />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/cms">
        <AdminLayout>
          <CMS />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/notifications">
        <AdminLayout>
          <NotificationCenter />
        </AdminLayout>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
