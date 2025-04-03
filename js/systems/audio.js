import { config } from '../config/gameConfig.js';

export function initAudioEffects() {
    const ambientWind = document.getElementById('ambient-wind');
    const distantThunder = document.getElementById('distant-thunder');
    const eerieAmbient = document.getElementById('eerie-ambient');
    
    ambientWind.volume = config.audio.ambientVolume;
    distantThunder.volume = config.audio.thunderVolume;
    eerieAmbient.volume = config.audio.eerieVolume;
    
    // Start ambient sounds on first interaction
    document.addEventListener('click', () => {
        ambientWind.play();
        eerieAmbient.play();
        scheduleThunderSounds();
    }, { once: true });
}

function scheduleThunderSounds() {
    const delay = config.audio.thunderMinDelay + 
                 Math.random() * (config.audio.thunderMaxDelay - config.audio.thunderMinDelay);
    
    setTimeout(() => {
        const thunder = document.getElementById('distant-thunder');
        thunder.volume = 0.1 + Math.random() * 0.2;
        thunder.currentTime = 0;
        thunder.play();
        scheduleThunderSounds();
    }, delay);
}
