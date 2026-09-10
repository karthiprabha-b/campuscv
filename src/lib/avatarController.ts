export type AvatarState = 'idle' | 'wave' | 'think' | 'listen' | 'talk' | 'typing' | 'loading' | 'celebrate';

export interface ControllerConfig {
  blinkMinInterval: number;
  blinkMaxInterval: number;
  breatheSpeed: number;
  breatheIntensity: number;
  faceTrackingSpeed: number;
  faceTrackingLimitX: number;
  faceTrackingLimitY: number;
}

export const DEFAULT_CONFIG: ControllerConfig = {
  blinkMinInterval: 3000,
  blinkMaxInterval: 6000,
  breatheSpeed: 1.5,
  breatheIntensity: 0.015,
  faceTrackingSpeed: 0.08,
  faceTrackingLimitX: 0.28,
  faceTrackingLimitY: 0.18,
};

export class AvatarController {
  private config: ControllerConfig;
  private lastBlinkTime: number = 0;
  private nextBlinkInterval: number = 4000;

  constructor(config?: Partial<ControllerConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.resetBlinkTimer();
  }

  public getConfig(): ControllerConfig {
    return this.config;
  }

  public shouldBlink(elapsedTimeMs: number): boolean {
    if (elapsedTimeMs - this.lastBlinkTime >= this.nextBlinkInterval) {
      this.lastBlinkTime = elapsedTimeMs;
      this.nextBlinkInterval =
        Math.random() * (this.config.blinkMaxInterval - this.config.blinkMinInterval) +
        this.config.blinkMinInterval;
      return true;
    }
    return false;
  }

  private resetBlinkTimer() {
    this.lastBlinkTime = typeof window !== 'undefined' ? performance.now() : 0;
    this.nextBlinkInterval = 3000 + Math.random() * 3000;
  }
}
