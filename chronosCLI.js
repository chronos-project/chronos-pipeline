const exec = require('child_process').exec;
const command = process.argv[2];
const log = (msg) => {
  console.log(`>> ${msg}`);
};
const singleArg = (command) => {
  switch (command) {
    case 'install-kafka':
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
      break;
    case 'install-pipeline':
      log('Setting up PipelineDB...');
      exec('docker-compose up -d pipeline', (err, stdout, stderr) => {
        setTimeout(() => {
          exec('docker exec -i chronos-pipeline_pipeline_1 psql -U postgres -d chronos_pl < db/setup_pipelinedb.sql').on('close', () => {
            log('PipelineDB has been configured!');
          });
        }, 5000)
      })
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
    if (arg === 'kafka-1') {
      log('Stopping Kafka Broker 1...');
      exec('docker-compose stop kafka-1').on('close', () => {
        log('Kafka Broker 1 has been succesfully shut down.');
      });
    } else if (arg === 'kafka-2') {
      log('Stopping Kafka Broker 2...');
      exec('docker-compose stop kafka-2').on('close', () => {
        log('Kafka Broker 2 has been succesfully shut down.');
      });
    } else if (arg === 'kafka-3') {
      log('Stopping Kafka Broker 3...');
      exec('docker-compose stop kafka-3').on('close', () => {
        log('Kafka Broker 3 has been succesfully shut down.');
      });
    } else if (arg === 'zookeeper') {
      log('Stopping Zookeeper...');
      exec('docker-compose stop zookeeper').on('close', () => {
        log('Zookeeper has been succesfully shut down.');
      });
    } else if (arg === 'timescale') {
      log('Stopping TimescaleDB...');
      exec('docker-compose stop timescale').on('close', () => {
        log('TimescaleDB has been succesfully shut down.');
      });
    } else if (arg === 'pipeline') {
      log('Stopping PipelineDB...');
      exec('docker-compose stop pipeline').on('close', () => {
        log('PipelineDB has been succesfully shut down.');
      });
    } else if (arg === 'api') {
      log('Stopping API Server...');
      exec('docker-compose stop api').on('close', () => {
        log('API Server has been succesfully shut down.');
      });
    } else if (arg === 'consumer') {
      log('Stopping Consumer...');
      exec('docker-compose stop consumer').on('close', () => {
        log('Consumer has been succesfully shut down.');
      });
    } else if (arg === 'grafana') {
      log('Stopping Grafana...');
      exec('docker-compose stop grafana').on('close', () => {
        log('Grafana has been succesfully shut down.');
      });
    } else {
      log("That's not a valid service.");
    }
  }
}

if (!process.argv[3]) {
  singleArg(command);
} else if (process.argv[3]) {
  twoArg(command, process.argv[3]);
}
