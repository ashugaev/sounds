import {
  observable, action, computed, runInAction,
} from 'mobx';

class PlayerStore {
    // Что бы установить новое время проигрывания нужно измениеть это значение
    @observable newTimeValue

    @observable currentTime

    @observable duration

    @observable isPlaying = false

    setTimeoutId;

    calcTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);

      if (!minutes && minutes !== 0) return;

      return `${minutes}:${(`0${seconds}`).slice(-2)}`;
    }

    @computed
    get getPercent() {
      return this.currentTime / this.duration * 100;
    }

    @computed
    get currentTimeStr() {
      return this.calcTime(this.currentTime);
    }

    @computed
    get durationStr() {
      return this.calcTime(this.duration);
    }

    @action.bound
    setByPercent(percent) {
      this.newTimeValue = Math.floor(percent / 100 * this.duration);
    }

    @action.bound
    startIncrementing() {
      if (this.setTimeoutId) {
        clearTimeout(this.setTimeoutId);

        this.setTimeoutId = undefined;
      }

      this.setTimeoutId = setTimeout(() => runInAction(() => {
        this.currentTime++;
        this.startIncrementing();
      }), 1000);
    }

    @action.bound
    stopIncrementing() {
      clearTimeout(this.setTimeoutId);
    }

    @action.bound
    onPlay() {
      this.startIncrementing();
    }

    @action.bound
    onStop() {
      this.stopIncrementing();
    }

    @action.bound
    setCurrentTime(cur) {
      this.currentTime = cur;
    }

    @action.bound
    toggleIsPlaying(newState) {
      this.isPlaying = newState || !this.isPlaying;
    }

    @action.bound
    setDuration(dur) {
      this.duration = dur;
    }
}

export default new PlayerStore();
