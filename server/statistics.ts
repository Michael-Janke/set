import { observable, decorate } from "mobx";

class Statistics {
  sets: number = 0;
  fails: number = 0;
  setTimes: { set: number[]; time: number }[] = [];
}

decorate(Statistics, {
  sets: observable,
  fails: observable,
});

export default Statistics;
