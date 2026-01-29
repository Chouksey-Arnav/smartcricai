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
import AIWorkout from './pages/AIWorkout';
import Chat from './pages/Chat';
import Coach from './pages/Coach';
import CoachVoiceMode from './pages/CoachVoiceMode';
import ConfidenceCheckIn from './pages/ConfidenceCheckIn';
import CricketHub from './pages/CricketHub';
import CustomDrillWorkoutCreator from './pages/CustomDrillWorkoutCreator';
import DrillDetail from './pages/DrillDetail';
import Drills from './pages/Drills';
import DrillsCreator from './pages/DrillsCreator';
import FitnessBuilder from './pages/FitnessBuilder';
import GetToKnowYou from './pages/GetToKnowYou';
import Goals from './pages/Goals';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import MatchTracker from './pages/MatchTracker';
import MentalCoaching from './pages/MentalCoaching';
import MentalRoutinePlayer from './pages/MentalRoutinePlayer';
import MentalTrainingCreator from './pages/MentalTrainingCreator';
import MiniMatch from './pages/MiniMatch';
import NewHome from './pages/NewHome';
import Onboarding from './pages/Onboarding';
import PlayerLookup from './pages/PlayerLookup';
import PlayerProfile from './pages/PlayerProfile';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import QuizPlayer from './pages/QuizPlayer';
import Quizzes from './pages/Quizzes';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import SkillPaths from './pages/SkillPaths';
import Social from './pages/Social';
import TeamMode from './pages/TeamMode';
import Timer from './pages/Timer';
import VideoAnalysis from './pages/VideoAnalysis';
import WhyDidIGetOut from './pages/WhyDidIGetOut';
import WorkoutBuilder from './pages/WorkoutBuilder';
import Premium from './pages/Premium';
import AIDrillRecommendation from './pages/AIDrillRecommendation';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIWorkout": AIWorkout,
    "Chat": Chat,
    "Coach": Coach,
    "CoachVoiceMode": CoachVoiceMode,
    "ConfidenceCheckIn": ConfidenceCheckIn,
    "CricketHub": CricketHub,
    "CustomDrillWorkoutCreator": CustomDrillWorkoutCreator,
    "DrillDetail": DrillDetail,
    "Drills": Drills,
    "DrillsCreator": DrillsCreator,
    "FitnessBuilder": FitnessBuilder,
    "GetToKnowYou": GetToKnowYou,
    "Goals": Goals,
    "Home": Home,
    "Leaderboard": Leaderboard,
    "MatchTracker": MatchTracker,
    "MentalCoaching": MentalCoaching,
    "MentalRoutinePlayer": MentalRoutinePlayer,
    "MentalTrainingCreator": MentalTrainingCreator,
    "MiniMatch": MiniMatch,
    "NewHome": NewHome,
    "Onboarding": Onboarding,
    "PlayerLookup": PlayerLookup,
    "PlayerProfile": PlayerProfile,
    "Profile": Profile,
    "Progress": Progress,
    "QuizPlayer": QuizPlayer,
    "Quizzes": Quizzes,
    "Schedule": Schedule,
    "Settings": Settings,
    "SkillPaths": SkillPaths,
    "Social": Social,
    "TeamMode": TeamMode,
    "Timer": Timer,
    "VideoAnalysis": VideoAnalysis,
    "WhyDidIGetOut": WhyDidIGetOut,
    "WorkoutBuilder": WorkoutBuilder,
    "Premium": Premium,
    "AIDrillRecommendation": AIDrillRecommendation,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};