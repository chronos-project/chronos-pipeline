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
  } else if (cmd === 'start') {
    if (arg === 'kafka-1') {
      log('Starting Kafka Broker 1...');
      exec('docker-compose start kafka-1').on('close', () => {
        log('Kafka Broker 1 has succesfully booted up.');
      });
    } else if (arg === 'kafka-2') {
      log('Starting Kafka Broker 2...');
      exec('docker-compose start kafka-2').on('close', () => {
        log('Kafka Broker 2 has succesfully booted up.');
      });
    } else if (arg === 'kafka-3') {
      log('Starting Kafka Broker 3...');
      exec('docker-compose start kafka-3').on('close', () => {
        log('Kafka Broker 3 has succesfully booted up.');
      });
    } else if (arg === 'zookeeper') {
      log('Starting Zookeeper...');
      exec('docker-compose start zookeeper').on('close', () => {
        log('Zookeeper has succesfully booted up.');
      });
    } else if (arg === 'timescale') {
      log('Starting TimescaleDB...');
      exec('docker-compose start timescale').on('close', () => {
        log('TimescaleDB has succesfully booted up.');
      });
    } else if (arg === 'pipeline') {
      log('Starting PipelineDB...');
      exec('docker-compose start pipeline').on('close', () => {
        log('PipelineDB has succesfully booted up.');
      });
    } else if (arg === 'api') {
      log('Starting API Server...');
      exec('docker-compose start api').on('close', () => {
        log('API Server has succesfully booted up.');
      });
    } else if (arg === 'consumer') {
      log('Starting Consumer...');
      exec('docker-compose start consumer').on('close', () => {
        log('Consumer has succesfully booted up.');
      });
    } else if (arg === 'grafana') {
      log('Starting Grafana...');
      exec('docker-compose start grafana').on('close', () => {
        log('Grafana has succesfully booted up.');
      });
    } else {
      log("That's not a valid service.");
    }
  } else if (cmd === 'logs') {
    if (arg === 'kafka-1') {
      exec('docker-compose logs kafka-1', (err, stdout, stderr) => log(stdout));
    } else if (arg === 'kafka-2') {
      exec('docker-compose logs kafka-2', (err, stdout, stderr) => log(stdout));
    } else if (arg === 'kafka-3') {
      exec('docker-compose logs kafka-3', (err, stdout, stderr) => log(stdout));
    } else if (arg === 'zookeeper') {
      exec('docker-compose logs zookeeper', (err, stdout, stderr) => log(stdout));
    } else if (arg === 'timescale') {
      exec('docker-compose logs timescale', (err, stdout, stderr) => log(stdout));
    } else if (arg === 'pipeline') {
      exec('docker-compose logs pipeline', (err, stdout, stderr) => log(stdout));
    } else if (arg === 'api') {
      exec('docker-compose logs api', (err, stdout, stderr) => log(stdout));
    } else if (arg === 'consumer') {
      exec('docker-compose logs consumer', (err, stdout, stderr) => log(stdout));
    } else if (arg === 'grafana') {
      exec('docker-compose logs grafana', (err, stdout, stderr) => log(stdout));
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
