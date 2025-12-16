import { useAchievementChecker } from '../utils/useAchievementChecker';

/**
 * Component that monitors achievements in the background
 * Place inside all providers to enable automatic achievement unlocking
 */
export function AchievementMonitor() {
    useAchievementChecker();
    return null;
}
