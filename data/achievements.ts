// Achievements data for all games in Partyverse
// These unlock as players complete specific milestones

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    game?: string; // Which game this achievement is tied to
    category: 'first_play' | 'mastery' | 'social' | 'special';
}

export const ACHIEVEMENTS: Achievement[] = [
    // FIRST PLAY ACHIEVEMENTS (One for each game)
    { id: 'first_hot_bomb', name: 'Bomb Squad', description: 'Play Hot Bomb', icon: '💣', unlocked: false, game: 'Hot Bomb', category: 'first_play' },
    { id: 'first_stack_tower', name: 'Block Builder', description: 'Play Stack Tower', icon: '🏗️', unlocked: false, game: 'Stack Tower', category: 'first_play' },
    { id: 'first_lightning', name: 'Speed Demon', description: 'Play Lightning Rounds', icon: '⚡', unlocked: false, game: 'Lightning Rounds', category: 'first_play' },
    { id: 'first_pic_you', name: 'Camera Shy', description: 'Play Don\'t Let It PIC You', icon: '📸', unlocked: false, game: 'Don\'t Let It PIC You', category: 'first_play' },
    { id: 'first_blown_away', name: 'Balloon Master', description: 'Play Blown Away', icon: '🎈', unlocked: false, game: 'Blown Away', category: 'first_play' },

    { id: 'first_brain_buzzer', name: 'Quiz Whiz', description: 'Play Brain Buzzer', icon: '🧠', unlocked: false, game: 'Brain Buzzer', category: 'first_play' },
    { id: 'first_brain_vs_brain', name: 'Mental Duel', description: 'Play Brain vs Brain', icon: '⚔️', unlocked: false, game: 'Brain vs Brain', category: 'first_play' },
    { id: 'first_memory_rush', name: 'Memory Master', description: 'Play Memory Rush', icon: '🎯', unlocked: false, game: 'Memory Rush', category: 'first_play' },
    { id: 'first_phrase_master', name: 'Word Wizard', description: 'Play Phrase Master', icon: '📝', unlocked: false, game: 'Phrase Master', category: 'first_play' },
    { id: 'first_stop_game', name: 'Category King', description: 'Play Stop Game', icon: '🛑', unlocked: false, game: 'Stop Game', category: 'first_play' },

    { id: 'first_color_clash', name: 'Color Expert', description: 'Play Color Clash', icon: '🎨', unlocked: false, game: 'Color Clash', category: 'first_play' },
    { id: 'first_ride_bus', name: 'Card Shark', description: 'Play Ride the Bus', icon: '🚌', unlocked: false, game: 'Ride the Bus', category: 'first_play' },
    { id: 'first_mic_madness', name: 'Singer', description: 'Play Mic Madness', icon: '🎤', unlocked: false, game: 'Mic Madness', category: 'first_play' },
    { id: 'first_lip_sync', name: 'Performer', description: 'Play Lip Sync Battle', icon: '🎭', unlocked: false, game: 'Lip Sync', category: 'first_play' },
    { id: 'first_laugh', name: 'Comedian', description: 'Play If You Laugh', icon: '😂', unlocked: false, game: 'If You Laugh', category: 'first_play' },

    { id: 'first_truth_bluff', name: 'Deceiver', description: 'Play Truth or Bluff', icon: '🎲', unlocked: false, game: 'Truth or Bluff', category: 'first_play' },
    { id: 'first_extreme', name: 'Daredevil', description: 'Play Extreme Roulette', icon: '🎰', unlocked: false, game: 'Extreme Roulette', category: 'first_play' },

    // MASTERY ACHIEVEMENTS (Win multiple times)
    { id: 'master_trivia', name: 'Trivia Master', description: 'Win 5 Brain Buzzer games', icon: '🏆', unlocked: false, category: 'mastery' },
    { id: 'master_cards', name: 'Card Champion', description: 'Win 5 card games', icon: '🃏', unlocked: false, category: 'mastery' },
    { id: 'master_creativity', name: 'Creative Genius', description: 'Win 5 creativity games', icon: '✨', unlocked: false, category: 'mastery' },
    { id: 'master_action', name: 'Action Hero', description: 'Win 5 action games', icon: '💪', unlocked: false, category: 'mastery' },
    { id: 'master_memory', name: 'Memory Champion', description: 'Win 5 Memory Rush games', icon: '🎯', unlocked: false, category: 'mastery' },

    // SOCIAL ACHIEVEMENTS
    { id: 'party_starter', name: 'Party Starter', description: 'Play 10 games total', icon: '🎉', unlocked: false, category: 'social' },
    { id: 'social_butterfly', name: 'Social Butterfly', description: 'Play 5 multiplayer games', icon: '🦋', unlocked: false, category: 'social' },
    { id: 'crowd_pleaser', name: 'Crowd Pleaser', description: 'Play games with 4+ players', icon: '👥', unlocked: false, category: 'social' },
    { id: 'friend_magnet', name: 'Friend Magnet', description: 'Play with different friends', icon: '🧲', unlocked: false, category: 'social' },
    { id: 'ice_breaker', name: 'Ice Breaker', description: 'Play Truth or Bluff 3 times', icon: '❄️', unlocked: false, category: 'social' },

    // SPECIAL ACHIEVEMENTS
    { id: 'night_owl', name: 'Night Owl', description: 'Play past midnight', icon: '🦉', unlocked: false, category: 'special' },
    { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Play on Saturday', icon: '🎊', unlocked: false, category: 'special' },
    { id: 'dedicated', name: 'Dedicated Player', description: 'Play 3 days in a row', icon: '⭐', unlocked: false, category: 'special' },
    { id: 'explorer', name: 'Game Explorer', description: 'Try 10 different games', icon: '🗺️', unlocked: false, category: 'special' },
    { id: 'champion', name: 'Ultimate Champion', description: 'Win 20 games total', icon: '👑', unlocked: false, category: 'special' },
    { id: 'lucky_streak', name: 'Lucky Streak', description: 'Win 3 games in a row', icon: '🍀', unlocked: false, category: 'special' },
    { id: 'comeback_kid', name: 'Comeback Kid', description: 'Win after losing streak', icon: '🔥', unlocked: false, category: 'special' },
    { id: 'perfect_game', name: 'Perfect Game', description: 'Win without mistakes', icon: '💯', unlocked: false, category: 'special' },
    { id: 'speedster', name: 'Speedster', description: 'Win Lightning Rounds under 2 min', icon: '💨', unlocked: false, category: 'special' },
    { id: 'marathon', name: 'Marathon Player', description: 'Play for 1 hour straight', icon: '🏃', unlocked: false, category: 'special' },
];

export const getAchievementById = (id: string): Achievement | undefined => {
    return ACHIEVEMENTS.find(a => a.id === id);
};

export const getAchievementsByCategory = (category: Achievement['category']): Achievement[] => {
    return ACHIEVEMENTS.filter(a => a.category === category);
};

export const getUnlockedAchievements = (): Achievement[] => {
    return ACHIEVEMENTS.filter(a => a.unlocked);
};

export const getTotalAchievements = (): number => {
    return ACHIEVEMENTS.length;
};

export const getUnlockedCount = (): number => {
    return ACHIEVEMENTS.filter(a => a.unlocked).length;
};
