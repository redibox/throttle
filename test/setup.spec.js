global.HOOK_NAME = 'throttle';
import Redibox from 'redibox';
import UserHook from './../src/hook';

global.some = {
  coolFunction(data) {
    console.log('COOL');
    console.dir(data);
  },
  unCoolFunc(data) {
    console.log('UNCOOL');
    console.dir(data);
  },
};

const config = {
  hooks: {}, schedule: {
    schedules: [
      {
        runs: 'some.coolFunction',
        data: { live: true },
        interval: 'every 15 seconds',
      },
      {
        runs: 'some.unCoolFunc',
        data: { live: true },
        interval: 'every 30 seconds',
      },
    ],
  },
};
config.hooks[global.HOOK_NAME] = UserHook;

const clusterConfig = {
  log: { level: 'error' },
  redis: {
    connectionTimeout: 2000,
    hosts: [
      {
        host: '127.0.0.1',
        port: 30001,
      },
      {
        host: '127.0.0.1',
        port: 30002,
      },
      {
        host: '127.0.0.1',
        port: 30003,
      },
      {
        host: '127.0.0.1',
        port: 30004,
      },
      {
        host: '127.0.0.1',
        port: 30005,
      },
      {
        host: '127.0.0.1',
        port: 30006,
      },
    ],
  },
  hooks: {},
};

clusterConfig.hooks[global.HOOK_NAME] = UserHook;

before(done => {
  global.RediBox = new Redibox(config, () => {
    global.Hook = RediBox.hooks[global.HOOK_NAME];
    global.RediBoxCluster = new Redibox(clusterConfig, () => {
      global.HookCluster = global.RediBoxCluster.hooks[global.HOOK_NAME];
      done();
    });
  });
});

beforeEach(() => {
  Promise.all([
    RediBox.client.flushall(),
    RediBoxCluster.cluster.flushall(),
  ]);
});

after(() => {
  RediBox.disconnect();
});
