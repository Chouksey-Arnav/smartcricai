/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AIDrillRecommendation from './pages/AIDrillRecommendation';
import AIWorkout from './pages/AIWorkout';
import AdminSeedMentals from './pages/AdminSeedMentals';
import AdvancedPathDetails from './pages/AdvancedPathDetails';
import Chat from './pages/Chat';
import Coach from './pages/Coach';
import CoachVoiceMode from './pages/CoachVoiceMode';
import ConfidenceCheckIn from './pages/ConfidenceCheckIn';
import CustomDrillWorkoutCreator from './pages/CustomDrillWorkoutCreator';
import DrillDetail from './pages/DrillDetail';
import DrillWorkoutCreator from './pages/DrillWorkoutCreator';
import DrillYouTubeFinder from './pages/DrillYouTubeFinder';
import Drills from './pages/Drills';
import ExpandedProgress from './pages/ExpandedProgress';
import ExtendedMilestones from './pages/ExtendedMilestones';
import FitnessBuilder from './pages/FitnessBuilder';
import GetToKnowYou from './pages/GetToKnowYou';
import Goals from './pages/Goals';
import HeadCoach from './pages/HeadCoach';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import MatchDetail from './pages/MatchDetail';
import MatchHistory from './pages/MatchHistory';
import MatchTracker from './pages/MatchTracker';
import MentalCoaching from './pages/MentalCoaching';
import MentalRoutinePlayer from './pages/MentalRoutinePlayer';
import MentalTrainingCreator from './pages/MentalTrainingCreator';
import MiniMatch from './pages/MiniMatch';
import NinetyDayChallenge from './pages/NinetyDayChallenge';
import Onboarding from './pages/Onboarding';
import Premium from './pages/Premium';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import QuizPlayer from './pages/QuizPlayer';
import Quizzes from './pages/Quizzes';
import SavedDrillWorkout from './pages/SavedDrillWorkout';
import Schedule from './pages/Schedule';
import ScheduleExtendedView from './pages/ScheduleExtendedView';
import Settings from './pages/Settings';
import SkillPaths from './pages/SkillPaths';
import ThirtyDayChallenge from './pages/ThirtyDayChallenge';
import Timer from './pages/Timer';
import ViewLogMatches from './pages/ViewLogMatches';
import WhyDidIGetOut from './pages/WhyDidIGetOut';
import WorkoutBuilder from './pages/WorkoutBuilder';
import WorkoutHistory from './pages/WorkoutHistory';
import WorkoutPlayer from './pages/WorkoutPlayer';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIDrillRecommendation": AIDrillRecommendation,
    "AIWorkout": AIWorkout,
    "AdminSeedMentals": AdminSeedMentals,
    "AdvancedPathDetails": AdvancedPathDetails,
    "Chat": Chat,
    "Coach": Coach,
    "CoachVoiceMode": CoachVoiceMode,
    "ConfidenceCheckIn": ConfidenceCheckIn,
    "CustomDrillWorkoutCreator": CustomDrillWorkoutCreator,
    "DrillDetail": DrillDetail,
    "DrillWorkoutCreator": DrillWorkoutCreator,
    "DrillYouTubeFinder": DrillYouTubeFinder,
    "Drills": Drills,
    "ExpandedProgress": ExpandedProgress,
    "ExtendedMilestones": ExtendedMilestones,
    "FitnessBuilder": FitnessBuilder,
    "GetToKnowYou": GetToKnowYou,
    "Goals": Goals,
    "HeadCoach": HeadCoach,
    "Home": Home,
    "Leaderboard": Leaderboard,
    "MatchDetail": MatchDetail,
    "MatchHistory": MatchHistory,
    "MatchTracker": MatchTracker,
    "MentalCoaching": MentalCoaching,
    "MentalRoutinePlayer": MentalRoutinePlayer,
    "MentalTrainingCreator": MentalTrainingCreator,
    "MiniMatch": MiniMatch,
    "NinetyDayChallenge": NinetyDayChallenge,
    "Onboarding": Onboarding,
    "Premium": Premium,
    "Profile": Profile,
    "Progress": Progress,
    "QuizPlayer": QuizPlayer,
    "Quizzes": Quizzes,
    "SavedDrillWorkout": SavedDrillWorkout,
    "Schedule": Schedule,
    "ScheduleExtendedView": ScheduleExtendedView,
    "Settings": Settings,
    "SkillPaths": SkillPaths,
    "ThirtyDayChallenge": ThirtyDayChallenge,
    "Timer": Timer,
    "ViewLogMatches": ViewLogMatches,
    "WhyDidIGetOut": WhyDidIGetOut,
    "WorkoutBuilder": WorkoutBuilder,
    "WorkoutHistory": WorkoutHistory,
    "WorkoutPlayer": WorkoutPlayer,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};