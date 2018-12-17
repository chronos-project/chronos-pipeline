const exec = require('child_process').exec;
const SERVICES = ['kafka-1', 'kafka-2', 'kafka-3', 'zookeeper', 'grafana',
                  'timescale', 'pipeline', 'api', 'consumer'];
const NAMES = {
  'kafka-1': 'Kafka Broker 1',
  'kafka-2': 'Kafka Broker 2',
  'kafka-3': 'Kafka Broker 3',
  'zookeeper': 'Zookeeper',
  'timescale': 'TimescaleDB',
  'pipeline': 'PipelineDB',
  'grafana': 'Grafana',
  'api': 'API Server',
  'consumer': 'Consumer'
};
const command = process.argv[2];
const log = (msg) => {
  console.log(`>> ${msg}`);
};
const logs = (service) => {
  if (SERVICES.includes(service)) {
    exec(`docker-compose logs ${service}`, (err, stdout, stderr) => log(stdout));
  } else {
    // show man page for logs
  }
};
const start = (service) => {
  if (SERVICES.includes(service)) {
    log(`Starting ${NAMES[service]}...`);
    exec(`docker-compose start ${service}`).on('close', () => {
      log(`${NAMES[service]} has succesfully booted up.`);
    });
  } else {
    // show man page for start
  }
};
const stop = (service) => {
  if (SERVICES.includes(service)) {
    log(`Stopping ${NAMES[service]}...`);
    exec(`docker-compose stop ${service}`).on('close', () => {
      log(`${NAMES[service]} has been succesfully shut down.`);
    });
  } else {
    // show man page for stop
  }
};
const installKafka = () => {
  log('Setting up Kafka...');
  exec('docker-compose up -d zookeeper', (err, stdout, stderr) => {
    log('Starting Zookeeper...');
    setTimeout(() => {
      log('Starting Kafka Brokers...');
      exec('docker-compose up -d kafka-1').on('close', () => {
        log('Kafka Broker 1 running');
        exec('docker-compose up -d kafka-2').on('close', () => {
          log('Kafka Broker 2 running');
          exec('docker-compose up -d kafka-3').on('close', () => {
            log('Kafka Broker 3 running');

            setTimeout(() => {
              log("Setting up 'events' topic...")
              exec('docker exec -i chronos-pipeline_kafka-1_1 kafka-topics --zookeeper zookeeper:2181 --create --topic events --replication-factor 3 --partitions 6 --if-not-exists').on('close', () => {
                log('Topic created')
                exec('docker-compose stop');
                log('Stopping Zookeeper and Kafka Brokers...')
              });
            }, 7000);
          });
        });
      });
      log('Kafka cluster has been configured!');
    }, 7000);
  });
};
const installPipeline = () => {
  log('Setting up PipelineDB...');
  exec('docker-compose up -d pipeline', (err, stdout, stderr) => {
    setTimeout(() => {
      exec('docker exec -i chronos-pipeline_pipeline_1 psql -U postgres -d chronos_pl < db/setup_pipelinedb.sql').on('close', () => {
        log('PipelineDB has been configured!');
      });
    }, 5000)
  });
};

const singleArg = (command) => {
  switch (command) {
    case 'install-kafka':
      installKafka();
      break;
    case 'install-pipeline':
      installPipeline();
      break;
    case 'start':
      log('Chronos is booting up...');
      exec('docker-compose up -d zookeeper', (err, stdout, stderr) => {
        setTimeout(() => exec('docker-compose up').on('close', (err, stdout, stderr) => {
          log('Chronos has succesfully booted up!');
        }), 7000);
      });
      break;
    case 'stop':
      log('Chronos is shutting down...');
      exec('docker-compose stop', (err, stdout, stderr) => {
        log('Chronos has successfully shut down.');
      });
      break;
    case 'status':
      exec('docker ps', (err, stdout, stderr) => console.log(stdout));
    default:
      // TODO: add error and help file
  }
}

const twoArg = (cmd, arg) => {
  if (cmd === 'stop') {
    stop(arg);
  } else if (cmd === 'start') {
    start(arg);
  } else if (cmd === 'logs') {
    logs(arg);
  } else {
    // show man page
  }
}



if (!process.argv[3]) {
  singleArg(command);
} else if (process.argv[3]) {
  twoArg(command, process.argv[3]);
}
