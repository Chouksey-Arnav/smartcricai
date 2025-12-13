import Home from './pages/Home';
import Coach from './pages/Coach';
import Drills from './pages/Drills';
import DrillDetail from './pages/DrillDetail';
import MentalCoaching from './pages/MentalCoaching';
import MentalRoutinePlayer from './pages/MentalRoutinePlayer';
import Quizzes from './pages/Quizzes';
import QuizPlayer from './pages/QuizPlayer';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import PlayerLookup from './pages/PlayerLookup';
import MiniMatch from './pages/MiniMatch';
import SkillPaths from './pages/SkillPaths';
import TeamMode from './pages/TeamMode';
import Schedule from './pages/Schedule';
import VideoAnalysis from './pages/VideoAnalysis';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Coach": Coach,
    "Drills": Drills,
    "DrillDetail": DrillDetail,
    "MentalCoaching": MentalCoaching,
    "MentalRoutinePlayer": MentalRoutinePlayer,
    "Quizzes": Quizzes,
    "QuizPlayer": QuizPlayer,
    "Progress": Progress,
    "Settings": Settings,
    "Onboarding": Onboarding,
    "PlayerLookup": PlayerLookup,
    "MiniMatch": MiniMatch,
    "SkillPaths": SkillPaths,
    "TeamMode": TeamMode,
    "Schedule": Schedule,
    "VideoAnalysis": VideoAnalysis,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};