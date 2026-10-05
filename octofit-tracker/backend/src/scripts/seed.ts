import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    const octocats = await Team.findOneAndUpdate(
      { name: 'Octocats' },
      { $set: { description: 'A steady team focused on building healthy habits.' } },
      { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    const trailblazers = await Team.findOneAndUpdate(
      { name: 'Trailblazers' },
      { $set: { description: 'Outdoor miles and weekend challenges.' } },
      { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    const users = await Promise.all([
      User.findOneAndUpdate(
        { email: 'maya.chen@example.com' },
        { $set: { displayName: 'Maya Chen', team: octocats._id } },
        { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true },
      ),
      User.findOneAndUpdate(
        { email: 'leo.martin@example.com' },
        { $set: { displayName: 'Leo Martin', team: octocats._id } },
        { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true },
      ),
      User.findOneAndUpdate(
        { email: 'nina.patel@example.com' },
        { $set: { displayName: 'Nina Patel', team: trailblazers._id } },
        { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true },
      ),
    ]);

    if (users.some((user) => user === null)) {
      throw new Error('Could not create the sample users');
    }

    const [maya, leo, nina] = users;

    await Promise.all([
      Team.updateOne({ _id: octocats._id }, { $set: { members: [maya._id, leo._id] } }),
      Team.updateOne({ _id: trailblazers._id }, { $set: { members: [nina._id] } }),
    ]);

    const activitySamples = [
      {
        user: maya._id,
        activityType: 'running',
        durationMinutes: 32,
        distanceKm: 5.1,
        notes: 'Riverside tempo run',
        completedAt: new Date('2026-10-03T07:30:00.000Z'),
      },
      {
        user: leo._id,
        activityType: 'cycling',
        durationMinutes: 48,
        distanceKm: 16.4,
        notes: 'Harbor loop ride',
        completedAt: new Date('2026-10-04T08:15:00.000Z'),
      },
      {
        user: nina._id,
        activityType: 'walking',
        durationMinutes: 55,
        distanceKm: 4.2,
        notes: 'Hill trail walk',
        completedAt: new Date('2026-10-04T16:00:00.000Z'),
      },
    ];

    await Promise.all(
      activitySamples.map(({ user, notes, ...activity }) =>
        Activity.findOneAndUpdate(
          { user, notes },
          { $set: { ...activity, user, notes } },
          { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true },
        ),
      ),
    );

    await Promise.all(
      [
        { user: maya._id, team: octocats._id, points: 185, rank: 1 },
        { user: nina._id, team: trailblazers._id, points: 160, rank: 2 },
        { user: leo._id, team: octocats._id, points: 125, rank: 3 },
      ].map(({ user, ...entry }) =>
        Leaderboard.findOneAndUpdate(
          { user, period: 'all-time' },
          { $set: { ...entry, user, period: 'all-time' } },
          { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true },
        ),
      ),
    );

    const workoutSamples = [
      {
        title: 'Foundation Strength',
        description: 'A balanced full-body session for building consistency.',
        category: 'strength',
        durationMinutes: 35,
        difficulty: 'moderate',
        exercises: ['Bodyweight squats', 'Incline push-ups', 'Glute bridges', 'Dead bugs'],
      },
      {
        title: 'Easy Interval Run',
        description: 'A gentle run-walk session with short, relaxed intervals.',
        category: 'cardio',
        durationMinutes: 28,
        difficulty: 'easy',
        exercises: ['Warm-up walk', 'Six relaxed intervals', 'Cool-down walk'],
      },
      {
        title: 'Post-ride Mobility',
        description: 'A short mobility reset for hips, hamstrings, and upper back.',
        category: 'mobility',
        durationMinutes: 18,
        difficulty: 'easy',
        exercises: ['Hip flexor stretch', 'Hamstring stretch', 'Thoracic rotations'],
      },
    ];

    await Promise.all(
      workoutSamples.map(({ title, ...workout }) =>
        Workout.findOneAndUpdate(
          { title },
          { $set: { ...workout, title } },
          { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true },
        ),
      ),
    );

    const [userCount, teamCount, activityCount, leaderboardCount, workoutCount] = await Promise.all([
      User.countDocuments(),
      Team.countDocuments(),
      Activity.countDocuments(),
      Leaderboard.countDocuments(),
      Workout.countDocuments(),
    ]);

    console.log('Database seeding complete', {
      users: userCount,
      teams: teamCount,
      activities: activityCount,
      leaderboard: leaderboardCount,
      workouts: workoutCount,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seedDatabase();
