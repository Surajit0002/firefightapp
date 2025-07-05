import { Pool } from '@neondatabase/serverless';

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function testDatabase() {
  try {
    console.log('🔌 Testing database connection...\n');
    
    // Test user data
    const allUsers = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Total Users: ${allUsers.rows[0].count}`);
    
    // Test games data
    const allGames = await pool.query('SELECT COUNT(*) as count FROM games');
    console.log(`🎮 Total Games: ${allGames.rows[0].count}`);
    
    // Test tournaments data
    const allTournaments = await pool.query('SELECT COUNT(*) as count FROM tournaments');
    console.log(`🏆 Total Tournaments: ${allTournaments.rows[0].count}`);
    
    // Test teams data
    const allTeams = await pool.query('SELECT COUNT(*) as count FROM teams');
    console.log(`👨‍👩‍👧‍👦 Total Teams: ${allTeams.rows[0].count}`);
    
    // Test transactions data
    const allTransactions = await pool.query('SELECT COUNT(*) as count FROM transactions');
    console.log(`💰 Total Transactions: ${allTransactions.rows[0].count}`);
    
    // Test notifications data
    const allNotifications = await pool.query('SELECT COUNT(*) as count FROM notifications');
    console.log(`🔔 Total Notifications: ${allNotifications.rows[0].count}`);
    
    console.log('\n✅ Database connection successful!');
    console.log('\n📊 Sample Data Preview:');
    
    // Show sample users
    const sampleUsers = await pool.query('SELECT username, country, wallet_balance, is_admin FROM users LIMIT 5');
    console.log('\nTop 5 Users:');
    sampleUsers.rows.forEach(user => {
      console.log(`  • ${user.username} (${user.country}) - Balance: $${user.wallet_balance} ${user.is_admin ? '[ADMIN]' : ''}`);
    });
    
    // Show sample tournaments
    const sampleTournaments = await pool.query('SELECT title, status, prize_pool, current_participants, max_participants FROM tournaments LIMIT 5');
    console.log('\nTop 5 Tournaments:');
    sampleTournaments.rows.forEach(tournament => {
      console.log(`  • ${tournament.title} [${tournament.status.toUpperCase()}] - Prize: $${tournament.prize_pool} (${tournament.current_participants}/${tournament.max_participants})`);
    });
    
    // Show sample teams
    const sampleTeams = await pool.query('SELECT name, country, wins, matches_played, rank FROM teams ORDER BY rank LIMIT 5');
    console.log('\nTop 5 Teams by Rank:');
    sampleTeams.rows.forEach(team => {
      const winRate = team.matches_played > 0 ? ((team.wins / team.matches_played) * 100).toFixed(1) : '0.0';
      console.log(`  • ${team.name} (${team.country}) - Rank #${team.rank} - Win Rate: ${winRate}% (${team.wins}/${team.matches_played})`);
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await pool.end();
  }
}

testDatabase();